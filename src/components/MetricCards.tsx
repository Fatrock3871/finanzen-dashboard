import { TrendingUp, TrendingDown, Wallet } from "lucide-react";

interface MetricCardsProps {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

export default function MetricCards({ totalIncome, totalExpense, balance }: MetricCardsProps) {
  const cards = [
    {
      label: "Receita Total",
      value: formatCurrency(totalIncome),
      icon: TrendingUp,
      colorClass: "text-success",
      glowClass: "glow-success",
      bgClass: "bg-success/10",
    },
    {
      label: "Despesa Total",
      value: formatCurrency(totalExpense),
      icon: TrendingDown,
      colorClass: "text-destructive",
      glowClass: "glow-destructive",
      bgClass: "bg-destructive/10",
    },
    {
      label: "Saldo Atual",
      value: formatCurrency(balance),
      icon: Wallet,
      colorClass: balance >= 0 ? "text-success" : "text-destructive",
      glowClass: balance >= 0 ? "glow-success" : "glow-destructive",
      bgClass: balance >= 0 ? "bg-success/10" : "bg-destructive/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="glass-card p-5 hover:scale-[1.02] transition-transform duration-200 animate-fade-in"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {card.label}
            </span>
            <div className={`w-8 h-8 rounded-lg ${card.bgClass} flex items-center justify-center`}>
              <card.icon className={`w-4 h-4 ${card.colorClass}`} />
            </div>
          </div>
          <p className={`text-2xl font-semibold ${card.colorClass}`}>{card.value}</p>
        </div>
      ))}
    </div>
  );
}
