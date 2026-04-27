
interface ProductSupportWarrantyProps {
  warrantyCoverage: string[];
  extendedWarranty?: string;
}

export default function ProductSupportWarranty({ warrantyCoverage, extendedWarranty }: ProductSupportWarrantyProps) {
  return (
    <div className="bg-white rounded-lg">
      {/* Warranty Coverage Section */}
      <div className="mb-6 mt-14">
        <h3 className="text-[24px] font-semibold text-gray-800 mb-5">Warranty & Support</h3>
        <p className="text-gray-600 text-xl mb-5">
          All Power - 8 products come with comprehensive warranty coverage and professional support.
        </p>
        
        <h4 className="font-semibold text-gray-900 text-[16px] mb-3">Warranty Coverage:</h4>
        <ul className="space-y-4 pl-5">
          {warrantyCoverage.map((item, index) => (
            <li key={index} className="flex items-center text-xl gap-3 text-gray-600 ">
              <span className="text-green-500 font-bold">✓</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Extended Warranty Section */}
      {extendedWarranty && (
        <div className="mt-6 p-6 bg-orange-50 rounded-lg">
          <h4 className="font-semibold text-[16px] text-gray-900 mb-2">Extended Warranty Available</h4>
          <p className="text-gray-600 text-xl">{extendedWarranty}</p>
        </div>
      )}
    </div>
  );
}