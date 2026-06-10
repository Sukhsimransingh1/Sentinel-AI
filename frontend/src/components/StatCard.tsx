import type { IconType } from "react-icons";

interface Props {
  title: string;
  value: string | number;
  icon: IconType;
  color?: string;
}

export default function StatCard({ title, value, icon: Icon, color = "text-cyan-500" }: Props) {
  return (
    <div className="bg-[#0B1D33] rounded-2xl p-6 border border-slate-800 hover:border-slate-700 transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-sm font-medium mb-2">{title}</p>
          <h3 className="text-3xl font-bold">{value}</h3>
        </div>
        <div className={`w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center ${color}`}>
          <Icon className="text-xl" />
        </div>
      </div>
    </div>
  );
}