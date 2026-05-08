
interface ProductDescriptionProps {
  description: string;
  keyFeatures: string[];
}

export default function ProductDescription({ description, keyFeatures }: ProductDescriptionProps) {
  return (
    <div className="bg-white rounded-lg">
      {/* Product Description Section */}
      <div className="mb-6 mt-14">
        <h3 className="text-[24px] font-semibold text-gray-800 mb-5">Product Description</h3>
        <p className="text-gray-600 text-xl leading-relaxed">{description}</p>
      </div>

      {/* Key Features Section */}
      {keyFeatures && keyFeatures.length > 0 && (
        <div>
          <h4 className="font-semibold text-2xl text-gray-800 mb-3">Key Features:</h4>
          <ul className="space-y-3">
            {keyFeatures.map((feature, index) => (
              <li key={index} className="flex items-center gap-3 text-xl font-normal text-gray-700">
                <span className="text-green-500">✓</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}