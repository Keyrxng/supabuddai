import RLSPoliciesList from "@/components/RLSPolicies";
import SchemaTable from "@/components/SchemaTable";

export default function Page() {
  return (
    <div className="m-12 flex flex-col justify-between gap-8">
      <SchemaTable />
      <RLSPoliciesList />
    </div>
  );
}
