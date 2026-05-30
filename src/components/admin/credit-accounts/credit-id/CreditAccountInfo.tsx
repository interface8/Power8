interface Props {
  customerName: string;
  email: string;
  phone: string;
  durationMonths: number;
  startDate: string;
  endDate: string;
}

export default function CreditAccountInfo({
  customerName,
  email,
  phone,
  durationMonths,
  startDate,
  endDate,
}: Props) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-lg font-semibold">
        Customer Information
      </h2>

      <div className="grid gap-5 md:grid-cols-2">
        <Info label="Customer Name" value={customerName} />
        <Info label="Email" value={email} />
        <Info label="Phone" value={phone} />
        <Info
          label="Duration"
          value={`${durationMonths} months`}
        />
        <Info label="Start Date" value={startDate} />
        <Info label="End Date" value={endDate} />
      </div>
    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-sm text-gray-500">
        {label}
      </p>

      <p className="mt-1 font-medium text-gray-900">
        {value}
      </p>
    </div>
  );
}