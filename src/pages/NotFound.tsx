import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white p-4 text-center">
      <div className="relative mb-6">
        <h1 className="text-[120px] font-black text-slate-100 select-none leading-none">404</h1>
        <FileQuestion className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 text-primary" />
      </div>
      
      <h2 className="mb-2 text-2xl font-semibold text-slate-900">
        Página não encontrada
      </h2>
      <p className="mb-8 max-w-sm text-muted-foreground">
        O endereço que você tentou acessar não existe ou foi movido.
      </p>

      <div className="flex gap-4">
        <Button variant="outline" onClick={() => navigate(-1)}>
          Voltar
        </Button>
        <Button onClick={() => navigate("/")}>
          Ir para o Início
        </Button>
      </div>
    </div>
  );
}
