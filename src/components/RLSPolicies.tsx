import Image from "next/image";

const RLSPoliciesList: React.FC = () => {
  const policies = [
    {
      id: "1",
      name: "Policy 1",
      description: "This is the first policy",
    },
    {
      id: "2",
      name: "Policy 2",
      description: "This is the second policy",
    },
    {
      id: "3",
      name: "Policy 3",
      description: "This is the third policy",
    },
  ];

  return (
    <div className="divide-y divide-gray-200">
      {policies.map((policy) => (
        <div className="flex text-left px-4 py-4 sm:px-6" key={policy.id}>
          <div className="flex-shrink-0">
            <Image
              className="h-12 w-12"
              src="https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-01.jpg"
              alt=""
              width={48}
              height={48}
            />
          </div>
          <div className="ml-6 pt-1">
            <h4 className="text-lg leading-6 font-medium text-gray-900">
              {policy.name}
            </h4>
            <p className="text-sm text-gray-500">{policy.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RLSPoliciesList;
