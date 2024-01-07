import { SupabaseClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  // const formData = await request.formData();
  // const db_url = String(formData.get("db_url"));
  // const db_key = String(formData.get("db_key"));
  // const projectId = String(formData.get("projectId"));

  const func = "get_all_rls_policies";
  const schema = "public";
  const key =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3YWVleG9ldnh4anF1d2xoZmp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDE1MTI0NzAsImV4cCI6MjAxNzA4ODQ3MH0.47_j0Q-nfP1bvG8wUP5RAsrpQKZMuZkv_rPvmjVIXHM";
  const url = "https://ywaeexoevxxjquwlhfjx.supabase.co";
  const temp = "ywaeexoevxxjquwlhfjx";

  const supa = new SupabaseClient(url, key);

  const { data, error } = await supa.rpc(func);

  console.log("data", data);

  if (error) {
    console.log("error", error);
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
