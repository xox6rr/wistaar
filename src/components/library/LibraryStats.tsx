import { BookOpen, CheckCircle, TrendingUp, Clock } from "lucide-react";

interface LibraryStatsProps {
  totalBooks: number;
  completedBooks: number;
  inProgressBooks: number;
  purchasedCount: number;
}

export default function LibraryStats({ totalBooks, completedBooks, inProgressBooks, purchasedCount }: LibraryStatsProps) {
  if (totalBooks === 0 && purchasedCount === 0) return null;

  const stats = [
    { icon: BookOpen, label: "Total Books", value: totalBooks + purchasedCount, color: "text-primary" },
    { icon: TrendingUp, label: "In Progress", value: inProgressBooks, color: "text-amber-500" },
    { icon: CheckCircle, label: "Completed", value: completedBooks, color: "text-emerald-500" },
    { icon: Clock, label: "Purchased", value: purchasedCount, color: "text-blue-500" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-card border border-border rounded-lg p-4 flex items-center gap-3">
          <div className={`p-2 rounded-md bg-muted ${stat.color}`}>
            <stat.icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-display font-medium text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
