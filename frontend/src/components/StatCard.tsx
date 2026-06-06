interface Props {
  title: string;
  value: string;
}

export default function StatCard({
  title,
  value,
}: Props) {
  return (
    <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
      <p className="text-slate-400">
        {title}
      </p>

      <h3 className="text-4xl font-bold mt-2">
        {value}
      </h3>
    </div>
  );
}