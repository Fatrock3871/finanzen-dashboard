import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface ExpenseDonutProps {
  data: { name: string; value: number; color: string }[];
  total: number;
}

export default function ExpenseDonut({ data, total }: ExpenseDonutProps) {
  const topCategory = data.length > 0 ? data.reduce((a, b) => (a.value > b.value ? a : b)) : null;
  const topPercent = topCategory && total > 0 ? Math.round((topCategory.value / total) * 100) : 0;

  const formatCurrency = (v: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

  if (data.length === 0) {
    return (
      <div className="glass-card p-6 animate-fade-in">
        <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-4">
          Despesas por Categoria
        </h3>
        <div className="flex items-center justify-center h-52 text-muted-foreground text-sm">
          Sem despesas neste mês
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 animate-fade-in">
      <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-4">
        Despesas por Categoria
      </h3>
      <div className="relative h-56">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={90}
              paddingAngle={3}
              dataKey="value"
              animationBegin={0}
              animationDuration={600}
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              contentStyle={{
                backgroundColor: "hsl(240 5% 8%)",
                border: "1px solid hsl(240 4% 16%)",
                borderRadius: "8px",
                color: "white",
                fontSize: "13px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-bold text-foreground">{topPercent}%</span>
          <span className="text-xs text-muted-foreground">{topCategory?.name}</span>
        </div>
      </div>
      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-4 justify-center">
        {data.map((entry) => (
          <div key={entry.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
            {entry.name}
          </div>
        ))}
      </div>
    </div>
  );
}
