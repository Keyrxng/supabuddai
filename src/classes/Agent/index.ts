import { OpenAI } from "openai";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);
interface AgentCommand {
  name: string;
  func: (...args: any[]) => Promise<any>;
  expectedArgs: string[];
}

const gptFunctions: OpenAI.Chat.Completions.ChatCompletionCreateParams.Function[] =
  [];

const starterPrompt = `
You are SupaBuddAi, a Supabase RLS security expert, you are equipped to handle tasks involving the review and penetration test planning of RLS policies using database schemas in TypeScript. You will analyse the complete TypeScript type schema and all RLS policies, including schema name, table name, policy name, condition, check, command, and role. You will generate JSON structures detailing the necessary tests for each policy. These JSONs will contain schema, table, policy, and test context, describing how each policy should be tested against considering the parameters of the RLS policy in-scope.
`;

class Agent {
  apikey;
  openAI;
  supabase;

  constructor() {
    this.apikey = process.env.OPENAI_API_KEY;
    this.openAI = new OpenAI({
      apiKey: this.apikey,
    });
    this.supabase = supabase;
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
    });
  }

  async handleResponse(
    response: OpenAI.Chat.Completions.ChatCompletion,
    chatHistory: OpenAI.Chat.Completions.ChatCompletionMessageParam[]
  ) {
    let chainCount = 0;
    let finalResponse = "";
    let funcName = response.choices[0].message.function_call?.name;
    let funcParams = response.choices[0].message.function_call?.arguments;

    const AgentCommands: AgentCommand[] = [
      {
        name: "",
        func: this.singleResponse,
        expectedArgs: [],
      },
    ];

    while (funcName) {
      chainCount++;
      console.log(`Chain count: ${chainCount}`);
      console.log(
        `Response ${chainCount}: ${response.choices[0].message.content}`
      );
      const func = AgentCommands.find((command) => command.name === funcName);
      if (!func) throw new Error(`Agent command not found.`);

      let argObj: { [x: string]: any };

      if (funcParams) {
        argObj = JSON.parse(funcParams);
      } else {
        argObj = {};
      }

      const args = func.expectedArgs.map(
        (argName) => argObj[argName] ?? chatHistory
      );

      let result;
      try {
        result = await func.func(...args);
      } catch (err) {
        console.log("====================================");
        console.log("err:", err);
        console.log("====================================");
        throw new Error(`Error executing function: ${funcName}`);
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
      );

      response = await this.singleResponse(chatHistory);

      console.log("====================================");
      console.log("singleResponse:", response.choices[0].message.content);
      console.log("====================================");

      funcName = response.choices[0].message.function_call?.name;
      funcParams = response.choices[0].message.function_call?.arguments;
    }

    finalResponse = response.choices[0].message.content || `No response found.`;

    return finalResponse;
  }

  async createEmbeddings(toEmbed: string[]) {
    const res = await this.openAI.embeddings.create({
      input: toEmbed,
      model: "text-embedding-ada-002",
    });
    return res;
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
      });
    if (error) {
      console.log("error", error);
    }
    return data;
  }

  async assistantFileUpload(
    schemaFile: File,
    policyFile: File,
    name: string,
    userId: string
  ) {
    const schemaRes = await this.openAI.files.create({
      file: schemaFile,
      purpose: "assistants",
    });
    const policyRes = await this.openAI.files.create({
      file: policyFile,
      purpose: "assistants",
    });

    const schema = schemaRes;
    const policy = policyRes;
    const assistant = await this.createAssistantWithUpload(
      [schema.id, policy.id],
      name,
      userId
    );
    return { schema, policy, assistant };
  }

  async createAssistantWithUpload(
    fileIds: string[],
    name: string,
    userId: string
  ) {
    const res = await this.openAI.beta.assistants.create({
      name: name,
      description: "SupaBuddAi, a Supabase RLS security expert.",
      model: "gpt-4-1106-preview",
      file_ids: fileIds,
      tools: [{ type: "code_interpreter" }, { type: "retrieval" }],
      instructions: starterPrompt,
      metadata: {
        user: userId,
        name: name,
      },
    });
    return res;
  }

  async createNewThread(fileIds: string[], userId: string) {
    const res = await this.openAI.beta.threads.create({
      messages: [
        {
          role: "user",
          content:
            "Return a json structure describing the necessary tests for each policy.",
          file_ids: fileIds,
        },
      ],
    });
    return res;
  }

  async runThread(threadId: string, assistantId: string) {
    const res = await this.openAI.beta.threads.runs.create(threadId, {
      assistant_id: assistantId,
    });
    return res;
  }

  async listThreadRuns(threadId: string, runId: string) {
    const res = await this.openAI.beta.threads.runs.retrieve(threadId, runId);
    return res;
  }

  async listThreadRunSteps(threadId: string, runId: string) {
    const res = await this.openAI.beta.threads.runs.steps.list(threadId, runId);
    return res;
  }

  async getThreadRunStep(threadId: string, runId: string, stepId: string) {
    const res = await this.openAI.beta.threads.runs.steps.retrieve(
      threadId,
      runId,
      stepId
    );
    return res;
  }

  async cancelThreadRun(threadId: string, runId: string) {
    const res = await this.openAI.beta.threads.runs.cancel(threadId, runId);
    return res;
  }

  async getThread(threadId: string) {
    const res = await this.openAI.beta.threads.retrieve(threadId);
    return res;
  }
}

export default Agent;
