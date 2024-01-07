import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { PolicyDataTable } from "./PolicyDataTable";

const RLSPoliciesList = ({
  project,
  className,
}: {
  project: string;
  className: string;
}) => {
  return (
    <Card className={`${className}`}>
      <CardHeader>
        <CardTitle>RLS Policies</CardTitle>
      </CardHeader>
      <CardContent className="relative flex flex-col space-y-4">
        <PolicyDataTable project={project} />
      </CardContent>
    </Card>
  );
};

export default RLSPoliciesList;
