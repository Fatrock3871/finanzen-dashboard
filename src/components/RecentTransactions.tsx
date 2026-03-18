import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Trash2 } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

type Transaction = Tables<"transactions"> & { categories?: Tables<"categories"> | null };

interface RecentTransactionsProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

function formatCurrency(v: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);
}

export default function RecentTransactions({ transactions, onDelete }: RecentTransactionsProps) {
  const recent = transactions.slice(0, 10);

  return (
    <div className="glass-card p-6 animate-fade-in">
      <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-4">
        Transações Recentes
      </h3>
      {recent.length === 0 ? (
        <p className="text-muted-foreground text-sm text-center py-8">Nenhuma transação registrada</p>
      ) : (
        <div className="space-y-2">
          {recent.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition-colors group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-semibold"
                  style={{
                    backgroundColor: tx.categories?.color ? `${tx.categories.color}20` : "hsl(var(--muted))",
                    color: tx.categories?.color || "hsl(var(--muted-foreground))",
                  }}
                >
                  {tx.categories?.name?.charAt(0) || "?"}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {tx.description || tx.categories?.name || "Sem descrição"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(tx.date), "dd MMM yyyy", { locale: ptBR })}
                    {tx.categories?.name ? ` · ${tx.categories.name}` : ""}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`text-sm font-semibold ${tx.type === "income" ? "text-success" : "text-destructive"}`}>
                  {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount)}
                </span>
                <button
                  onClick={() => onDelete(tx.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-destructive/20"
                >
                  <Trash2 className="w-3.5 h-3.5 text-destructive" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
