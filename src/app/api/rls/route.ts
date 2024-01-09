import { SupabaseClient } from "@supabase/supabase-js"

export async function POST(request: Request) {
  const { db_url, db_key } = await request.json()
  const func = "get_all_rls_policies"

  if (!db_url || !db_key) {
    return new Response(
      JSON.stringify({ error: "db_url and db_key are required" }),
      {
        status: 400,
        headers: {
          "Content-Type": "text/plain",
        },
      }
    )
  }
  const supa = new SupabaseClient(db_url, db_key)

  const { data, error } = await supa.rpc(func)

  if (error) {
    console.log("error", error)
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  })
}
