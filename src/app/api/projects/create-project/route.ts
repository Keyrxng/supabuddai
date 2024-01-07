import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const formData = await request.json();
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({
    cookies: () => cookieStore,
  });

  const { data, error } = await supabase.from("user_projects").insert({
    db_name: formData.name,
    db_url: formData.url,
    db_pass: formData.pass,
    db_ref: formData.ref,
    db_key: formData.key,
  });

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

/**
BEGIN
    RETURN QUERY
    SELECT 
        ns.nspname::TEXT AS schema_name,
        cls.relname::TEXT AS table_name,
        pol.polname::TEXT AS policy_name,
        pg_get_expr(pol.polqual, pol.polrelid)::TEXT AS policy_condition,
        pg_get_expr(pol.polwithcheck, pol.polrelid)::TEXT AS policy_check,
        CASE pol.polcmd 
          WHEN 'r' THEN 'SELECT'
          WHEN 'a' THEN 'INSERT'
          WHEN 'w' THEN 'UPDATE'
          WHEN 'd' THEN 'DELETE'
          ELSE pol.polcmd 
        END::TEXT AS command,
        COALESCE(rol.rolname, 'public')::TEXT AS role
    FROM 
        pg_policy pol
        LEFT JOIN pg_class cls ON cls.oid = pol.polrelid
        LEFT JOIN pg_namespace ns ON ns.oid = cls.relnamespace
        LEFT JOIN pg_roles rol ON rol.oid = any(pol.polroles)
    ORDER BY 
        ns.nspname, 
        cls.relname, 
        pol.polname;
END;
 */
