import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tables } from "@/integrations/supabase/types";

interface AddTransactionFABProps {
  categories: Tables<"categories">[];
  onAdd: (tx: { type: string; amount: number; description: string; category_id: string; date: string }) => void;
  loading: boolean;
}

export default function AddTransactionFAB({ categories, onAdd, loading }: AddTransactionFABProps) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !categoryId) return;
    onAdd({
      type,
      amount: parseFloat(amount),
      description,
      category_id: categoryId,
      date,
    });
    setAmount("");
    setDescription("");
    setCategoryId("");
    setDate(new Date().toISOString().split("T")[0]);
    setOpen(false);
  };

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg glow-primary hover:scale-105 transition-transform"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Modal overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-md glass-card p-6 m-4 animate-scale-in">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-foreground">Nova Transação</h3>
              <button onClick={() => setOpen(false)} className="p-1 rounded-lg hover:bg-secondary">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Type toggle */}
              <div className="flex rounded-lg overflow-hidden border border-border">
                <button
                  type="button"
                  onClick={() => setType("expense")}
                  className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                    type === "expense" ? "bg-destructive text-destructive-foreground" : "bg-secondary text-muted-foreground"
                  }`}
                >
                  Despesa
                </button>
                <button
                  type="button"
                  onClick={() => setType("income")}
                  className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                    type === "income" ? "bg-success text-success-foreground" : "bg-secondary text-muted-foreground"
                  }`}
                >
                  Receita
                </button>
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Valor (R$)</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0,00"
                  className="bg-secondary border-border focus:border-primary focus:ring-primary/20 text-foreground text-lg font-semibold placeholder:text-muted-foreground"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Categoria</Label>
                <Select value={categoryId} onValueChange={setCategoryId} required>
                  <SelectTrigger className="bg-secondary border-border focus:border-primary focus:ring-primary/20 text-foreground">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id} className="text-foreground focus:bg-secondary">
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                          {cat.name}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Descrição</Label>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Opcional"
                  className="bg-secondary border-border focus:border-primary focus:ring-primary/20 text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Data</Label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="bg-secondary border-border focus:border-primary focus:ring-primary/20 text-foreground"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={loading || !amount || !categoryId}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-11 glow-primary"
              >
                {loading ? "Salvando..." : "Adicionar"}
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
