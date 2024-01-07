import HomeHero from "@/components/HomeHero";

export default function Page() {
  return (
    <>
      <HomeHero />
    </>
  );
}

/**
 * <Card className="grid gap-4 text-center col-span-2">
        <CardHeader>
          <CardTitle>Why It Works</CardTitle>
        </CardHeader>
        <CardContent className="container flex flex-col">
          <div className="grid grid-flow-dense gap-4">
            <ul className="flex flex-col gap-4">
              <li className="text-sm text-muted">
                SupabuddAI uses the best in class{" "}
                <a
                  href=""
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  artificial intelligence
                </a>{" "}
                to generate a tailored test suite from the <a href="">schema</a>{" "}
                and <a href="">RLS rules</a> of your database.
              </li>
              <li className="text-sm text-muted">
                Utilizing the power of{" "}
                <a
                  href=""
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  embeddings
                </a>{" "}
                SupaBuddAi leverages the Supabase CLI to gather your database
                types, then fetches all RLS rules from your database (including
                storage), as well as your database schema before storing them in
                a vector space. SupabuddAI then uses RAG (Retrieval-Augmented
                Generation) to analyze, and work out the best way to attack your
                RLS rules.
              </li>
              <li className="text-sm text-muted">
                SupabuddAI will then generate a comprehensive test suite
                attacking your RLS rules one by one, and will then generate a
                final report for you to review. This report will include
                information about the test suite, and the RLS rules that were
                tested against, as well as the results and any other advice that
                SupabuddAI can give you.
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
 */
