import { exec } from "child_process"

async function generateSupabaseTypes(projectId: string, schema = "public") {
  const command = `npx supabase gen types typescript --project-id "${projectId}" --schema ${schema}`

  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`)
        return reject(error)
      }
      console.error(`stderr: ${stderr}`)
      resolve(stdout)
    })
  })
}

export async function POST(request: Request) {
  const { db_ref } = await request.json()

  if (!db_ref) {
    return new Response(JSON.stringify({ error: "db_ref is required" }), {
      status: 400,
      headers: {
        "Content-Type": "text/plain",
      },
    })
  }

  const data = await generateSupabaseTypes(db_ref)

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  })
}
