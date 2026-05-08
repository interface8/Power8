
interface ProductSpecificationProps {
  specifications: { label: string; value: string }[];
}

export default function ProductSpecification({ specifications }: ProductSpecificationProps) {
  if (!specifications || specifications.length === 0) {
    return (
      <div className="bg-white rounded-lg">
        <p className="text-gray-500">No specifications available.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg mt-14">
      <h3 className="text-[24px] font-semibold text-gray-800 mb-5">Technical Specifications</h3>
      <div className="grid md:grid-cols-2 gap-y-6 gap-x-6">
        {specifications.map((spec, index) => (
          <div key={index} className="flex justify-between text-xl py-5 px-4 bg-gray-50 border-b border-gray-100 rounded-2xl">
            <span className="text-gray-500">{spec.label}</span>
            <span className="font-medium text-gray-900">{spec.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}