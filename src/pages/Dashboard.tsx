import { useMemo } from "react";
import { format, subMonths, startOfMonth, endOfMonth, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { LogOut, Wallet } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTransactions } from "@/hooks/useTransactions";
import MetricCards from "@/components/MetricCards";
import ExpenseDonut from "@/components/ExpenseDonut";
import MonthlyBarChart from "@/components/MonthlyBarChart";
import RecentTransactions from "@/components/RecentTransactions";
import AddTransactionFAB from "@/components/AddTransactionFAB";

export default function Dashboard() {
  const { signOut } = useAuth();
  const { transactionsQuery, categoriesQuery, addTransaction, deleteTransaction } = useTransactions();

  const transactions = transactionsQuery.data ?? [];
  const categories = categoriesQuery.data ?? [];

  const now = new Date();
  const currentMonthStart = startOfMonth(now);
  const currentMonthEnd = endOfMonth(now);

  const { totalIncome, totalExpense, balance } = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((s, t) => s + Number(t.amount), 0);
    const expense = transactions
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + Number(t.amount), 0);
    return { totalIncome: income, totalExpense: expense, balance: income - expense };
  }, [transactions]);

  const donutData = useMemo(() => {
    const monthExpenses = transactions.filter(
      (t) => t.type === "expense" && new Date(t.date) >= currentMonthStart && new Date(t.date) <= currentMonthEnd
    );
    const map = new Map<string, { name: string; value: number; color: string }>();
    monthExpenses.forEach((t) => {
      const catName = t.categories?.name || "Outros";
      const catColor = t.categories?.color || "#94A3B8";
      const existing = map.get(catName);
      if (existing) existing.value += Number(t.amount);
      else map.set(catName, { name: catName, value: Number(t.amount), color: catColor });
    });
    return Array.from(map.values()).sort((a, b) => b.value - a.value);
  }, [transactions, currentMonthStart, currentMonthEnd]);

  const donutTotal = donutData.reduce((s, d) => s + d.value, 0);

  const barData = useMemo(() => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const monthDate = subMonths(now, i);
      const start = startOfMonth(monthDate);
      const end = endOfMonth(monthDate);
      const label = format(monthDate, "MMM", { locale: ptBR });
      const monthTxs = transactions.filter((t) => {
        const d = new Date(t.date);
        return d >= start && d <= end;
      });
      months.push({
        month: label.charAt(0).toUpperCase() + label.slice(1),
        income: monthTxs.filter((t) => t.type === "income").reduce((s, t) => s + Number(t.amount), 0),
        expense: monthTxs.filter((t) => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0),
      });
    }
    return months;
  }, [transactions, now]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Wallet className="w-4 h-4 text-primary" />
            </div>
            <span className="text-lg font-bold text-foreground tracking-tight">FinanceApp</span>
          </div>
          <button
            onClick={signOut}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-lg hover:bg-secondary"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="container py-6 space-y-6 pb-24">
        <MetricCards totalIncome={totalIncome} totalExpense={totalExpense} balance={balance} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ExpenseDonut data={donutData} total={donutTotal} />
          <MonthlyBarChart data={barData} />
        </div>

        <RecentTransactions transactions={transactions} onDelete={(id) => deleteTransaction.mutate(id)} />
      </main>

      <AddTransactionFAB
        categories={categories}
        onAdd={(tx) => addTransaction.mutate(tx)}
        loading={addTransaction.isPending}
      />
    </div>
  );
}
