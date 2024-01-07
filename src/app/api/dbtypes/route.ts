import { exec } from "child_process";

async function generateSupabaseTypes(projectId: string, schema = "public") {
  const command = `npx supabase gen types typescript --project-id "${projectId}" --schema ${schema}`;

  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return reject(error);
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
      resolve(stdout);
    });
  });
}

export async function POST(request: Request) {
  // const formData = await request.formData();
  // const db_url = String(formData.get("db_url"));
  // const db_key = String(formData.get("db_key"));
  // const projectId = String(formData.get("projectId"));
  const temp = "ywaeexoevxxjquwlhfjx";

  const data = await generateSupabaseTypes(temp);

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
