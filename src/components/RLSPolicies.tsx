import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { PolicyDataTable } from "./PolicyDataTable";

const RLSPoliciesList: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>RLS Policies</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col space-y-4">
        <PolicyDataTable />
      </CardContent>
    </Card>
  );
};

export default RLSPoliciesList;
