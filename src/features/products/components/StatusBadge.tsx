import { Badge } from "@/components/ui/badge";

export default function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    ativo: "bg-green-100 text-green-700 border-green-200",
    "baixo estoque": "bg-orange-100 text-orange-700 border-orange-200",
    inativo: "bg-slate-100 text-slate-700 border-slate-200",
  };
  const key = status.toLowerCase();
  return (
    <Badge className={`${styles[key] || styles.inativo} font-medium border shadow-none whitespace-nowrap`}>
      {status}
    </Badge>
  );
}