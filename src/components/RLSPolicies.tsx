import { PolicyDataTable } from "./PolicyDataTable"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

const RLSPoliciesList = ({
  project,
  db_key,
  db_url,
  className,
}: {
  project: string
  db_key: string
  db_url: string
  className: string
}) => {
  return (
    <Card className={`${className}`}>
      <CardHeader>
        <CardTitle>RLS Policies</CardTitle>
      </CardHeader>
      <CardContent className="relative flex flex-col space-y-4">
        <PolicyDataTable project={project} db_key={db_key} db_url={db_url} />
      </CardContent>
    </Card>
  )
}

export default RLSPoliciesList
