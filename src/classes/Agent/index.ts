import { createClient } from "@supabase/supabase-js"
import { OpenAI } from "openai"

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!url) throw new Error("SUPABASE_URL not found in .env")
if (!key) throw new Error("SUPABASE_KEY not found in .env")

const supabase = createClient(url, key)

interface AgentCommand {
  name: string
  func: (...args: any[]) => Promise<any>
  expectedArgs: string[]
}

const gptFunctions: OpenAI.Chat.Completions.ChatCompletionCreateParams.Function[] =
  []

const starterPrompt = `
# You are SupaBuddAi, a Supabase RLS security expert, you are equipped to handle tasks involving the review and penetration test planning of RLS policies using database schema types.

- Using the files provided, you will analyse the complete schema txt file and rls CSV file and use these as input and reference data.
- Do not ask for user input, validation or confirmation. You are expected to perform tasks without any user input.
- Once you are finished any task, use the code intepreter to generate a downloadable file containing a JSON array of JSON objects according to the format instructions.
- You will generate the complete set of JSON structures detailing the necessary tests for each policy.
- These JSONs will abide by the JSON format below without fail, describing how each policy should be tested against considering the parameters of the RLS policy in-scope.

`

class Agent {
  apikey
  openAI
  supabase

  constructor(apikey: string) {
    this.apikey = apikey
    this.openAI = new OpenAI({
      apiKey: this.apikey,
    })
    this.supabase = supabase
  }

  async singleResponse(
    chatHistory: OpenAI.Chat.Completions.ChatCompletionMessageParam[]
  ) {
    return await this.openAI.chat.completions.create({
      messages: chatHistory,
      model: "gpt-4",
      temperature: 0,
      functions: gptFunctions,
      function_call: "auto",
    })
  }

  async handleResponse(
    response: OpenAI.Chat.Completions.ChatCompletion,
    chatHistory: OpenAI.Chat.Completions.ChatCompletionMessageParam[]
  ) {
    let chainCount = 0
    let finalResponse = ""
    let funcName = response.choices[0].message.function_call?.name
    let funcParams = response.choices[0].message.function_call?.arguments

    const AgentCommands: AgentCommand[] = [
      {
        name: "",
        func: this.singleResponse,
        expectedArgs: [],
      },
    ]

    while (funcName) {
      chainCount++
      console.log(`Chain count: ${chainCount}`)
      console.log(
        `Response ${chainCount}: ${response.choices[0].message.content}`
      )
      const func = AgentCommands.find((command) => command.name === funcName)
      if (!func) throw new Error(`Agent command not found.`)

      let argObj: { [x: string]: any }

      if (funcParams) {
        argObj = JSON.parse(funcParams)
      } else {
        argObj = {}
      }

      const args = func.expectedArgs.map(
        (argName) => argObj[argName] ?? chatHistory
      )

      let result
      try {
        result = await func.func(...args)
      } catch (err) {
        console.log("====================================")
        console.log("err:", err)
        console.log("====================================")
        throw new Error(`Error executing function: ${funcName}`)
      }

      chatHistory.push(
        {
          role: "function",
          name: funcName,
          content: `# ${funcName} executed\n - data: ${result}`,
        },
        {
          role: "system",
          content: `As the function has been executed, the agent will now continue to the next step. That means executing the next function in the chain, or returning the final response.`,
        }
      )

      response = await this.singleResponse(chatHistory)

      console.log("====================================")
      console.log("singleResponse:", response.choices[0].message.content)
      console.log("====================================")

      funcName = response.choices[0].message.function_call?.name
      funcParams = response.choices[0].message.function_call?.arguments
    }

    finalResponse = response.choices[0].message.content || `No response found.`

    return finalResponse
  }

  async createEmbeddings(toEmbed: string[]) {
    const res = await this.openAI.embeddings.create({
      input: toEmbed,
      model: "text-embedding-ada-002",
    })
    return res
  }

  async saveEmbeddings(
    project: string,
    embeddings: OpenAI.Embeddings.Embedding[]
  ) {
    const { data, error } = await this.supabase
      .from("project_embeddings")
      .insert({
        project: project,
        embeddings: embeddings,
      })
    if (error) {
      console.log("error", error)
    }
    return data
  }

  async assistantFileUpload(policyFile: File, schemaFile: File, name: string) {
    const schemaRes = await this.openAI.files.create({
      file: schemaFile,
      purpose: "assistants",
    })
    const policyRes = await this.openAI.files.create({
      file: policyFile,
      purpose: "assistants",
    })

    const schema = schemaRes
    const policy = policyRes
    const assistant = await this.createAssistantWithUpload(
      [schema.id, policy.id],
      name
    )
    return { schema, policy, assistant }
  }

  async createAssistantWithUpload(fileIds: string[], name: string) {
    const res = await this.openAI.beta.assistants.create({
      name: name,
      description: "SupaBuddAi, a Supabase RLS security expert.",
      model: "gpt-3.5-turbo-1106",
      file_ids: fileIds,
      tools: [{ type: "code_interpreter" }, { type: "retrieval" }],
      instructions: starterPrompt,
      metadata: {
        name: name,
      },
    })
    return res
  }

  async fetchAssistant(assistantId: string) {
    const res = await this.openAI.beta.assistants.retrieve(assistantId)
    return res
  }

  async createNewThread(fileIds: string[], userId: string) {
    const res = await this.openAI.beta.threads.create({
      messages: [
        {
          role: "user",
          content:
            "Return a json structure describing the necessary tests for each table in the database. Use the typescript typed schema file and the RLS policies json file as input data. The JSONs should contain schema, table, policy, and test context, describing how each policy should be tested against considering the parameters of the RLS policies protecting the table in-scope.",
          file_ids: fileIds,
        },
      ],
      metadata: {
        user_id: userId,
      },
    })
    return res
  }

  async readFile(threadId: string, messageId: string, fileId: string) {
    try {
      const res = await this.openAI.beta.threads.messages.files.retrieve(
        threadId,
        messageId,
        fileId
      )
      return res
    } catch (err) {
      return err
    }
  }

  async readFileString(fileId: string) {
    try {
      const res = await this.openAI.files.content(fileId)
      return res
    } catch (err) {
      return err
    }
  }

  async runThread(assistantId: string, userId: string) {
    const content = `## First Task Format Instructions: JSON Schema
    - Once complete, you will use the code intepreter to generate a downloadable file containing a JSON array of JSON objects according to the format instructions.
    - Do not ask for user input, validation or confirmation. You are expected to perform tasks without any user input.
    - Ensure that your output is a JSON array of JSON objects with the following format, do not deviate from this format:
    [{
      "index": number,
      "schema": string,
      "table": string, 
      "policy": string,
      "tests": [
          {
              "description": string,
              "role": string,
              "command": string,
              "condition": string,
              "expected_result": string
          }
      ]
    }]`

    const res = await this.openAI.beta.threads.createAndRun({
      assistant_id: assistantId,
      model: "gpt-3.5-turbo-1106",
      instructions: content,
      thread: {
        metadata: {
          user_id: userId,
        },
      },
    })
    return res
  }

  async getThreadRuns(threadId: string, runId: string) {
    const res = await this.openAI.beta.threads.runs.retrieve(threadId, runId)
    return res
  }

  async getThreadMessages(threadId: string) {
    const res = await this.openAI.beta.threads.messages.list(threadId)
    return res
  }

  async createMessage(threadId: string, content: string, fileIds?: string[]) {
    const res = await this.openAI.beta.threads.messages.create(threadId, {
      role: "user",
      content: content,
      file_ids: fileIds,
    })

    return res
  }

  async generateTests(threadId: string, assistantId: string) {
    const content = `## Second Task Format Instructions: JSON Schema

    Using the test plans you just created, you are going to write the javascript executable code for each test according to the requirements.
    Each test will have a dynamically generated function via 'new Function(name, functionString)' that will be executed by the API route handler.

    - Schema 'storage' is accessed via the 'supabase.storage' object.
    - Any other schema is accessed via the 'supabase.from' object.
    - Do not explain the tests, just write the tests and add comments to the code if necessary.
    - Assume that the client is already imported and configured, and that the supabasejs client is available as 'supabase'.
    - Do not ask for user input, validation or confirmation. You are expected to perform tasks without any user input.

    - Once complete, you will use the code intepreter to generate a downloadable file containing a JSON array of JSON objects according to the format instructions.
    - Ensure that your output is a JSON array of JSON objects with the following format and do not deviate from this format:
    [{
      "index": number,
      "schema": string,
      "table": string, 
      "policy": string,
      "test" : {
        "name": string,
        "functionString": 'return (supabase) => {...}'
      }
    }]
    `

    const run = await this.openAI.beta.threads.runs.create(threadId, {
      assistant_id: assistantId,
      additional_instructions: content,
    })

    return run
  }

  async cancelRun(threadId: string, runId: string) {
    const res = await this.openAI.beta.threads.runs.cancel(threadId, runId)
    return res
  }

  async listThreadRuns(threadId: string) {
    const res = await this.openAI.beta.threads.runs.list(threadId)
    return res
  }

  async listThreadRunSteps(threadId: string, runId: string) {
    const res = await this.openAI.beta.threads.runs.steps.list(threadId, runId)
    return res
  }

  async getThreadRunStep(threadId: string, runId: string, stepId: string) {
    const res = await this.openAI.beta.threads.runs.steps.retrieve(
      threadId,
      runId,
      stepId
    )
    return res
  }

  async cancelThreadRun(threadId: string, runId: string) {
    const res = await this.openAI.beta.threads.runs.cancel(threadId, runId)
    return res
  }

  async getThread(threadId: string) {
    const res = await this.openAI.beta.threads.retrieve(threadId)
    return res
  }
}

export default Agent
