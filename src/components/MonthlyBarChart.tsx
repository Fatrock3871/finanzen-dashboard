import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface MonthlyBarChartProps {
  data: { month: string; income: number; expense: number }[];
}

export default function MonthlyBarChart({ data }: MonthlyBarChartProps) {
  const formatCurrency = (v: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", notation: "compact" }).format(v);

  return (
    <div className="glass-card p-6 animate-fade-in">
      <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-4">
        Receita x Despesa (6 meses)
      </h3>
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-52 text-muted-foreground text-sm">
          Sem dados disponíveis
        </div>
      ) : (
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 4% 16%)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: "hsl(215 16% 57%)", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "hsl(215 16% 57%)", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={formatCurrency} width={60} />
              <Tooltip
                formatter={(value: number) =>
                  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)
                }
                contentStyle={{
                  backgroundColor: "hsl(240 5% 8%)",
                  border: "1px solid hsl(240 4% 16%)",
                  borderRadius: "8px",
                  color: "white",
                  fontSize: "13px",
                }}
              />
              <Bar dataKey="income" name="Receita" fill="hsl(160 84% 39%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" name="Despesa" fill="hsl(350 89% 60%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
      <div className="flex gap-4 mt-3 justify-center">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <div className="w-2.5 h-2.5 rounded-full bg-success" /> Receita
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <div className="w-2.5 h-2.5 rounded-full bg-destructive" /> Despesa
        </div>
      </div>
    </div>
  );
}
