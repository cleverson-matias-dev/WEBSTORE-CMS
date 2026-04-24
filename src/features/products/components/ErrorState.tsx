import { AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({ 
  title = "Ops! Algo deu errado", 
  description = "Não conseguimos carregar as informações agora. Por favor, tente novamente em instantes.",
  onRetry 
}: ErrorStateProps) {
  return (
    <div className="flex min-h-100 w-full flex-col items-center justify-center rounded-xl border border-dashed bg-white p-8 text-center animate-in fade-in zoom-in-95">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
        <AlertCircle className="h-10 w-10 text-destructive" />
      </div>
      
      <h2 className="mt-6 text-xl font-semibold tracking-tight text-slate-900">
        {title}
      </h2>
      
      <p className="mt-2 max-w-87.5 text-sm text-muted-foreground">
        {description}
      </p>

      {onRetry && (
        <Button 
          variant="outline" 
          onClick={onRetry} 
          className="mt-8 gap-2 border-slate-200 hover:bg-slate-50"
        >
          <RefreshCcw className="h-4 w-4" />
          Tentar novamente
        </Button>
      )}
    </div>
  );
}
