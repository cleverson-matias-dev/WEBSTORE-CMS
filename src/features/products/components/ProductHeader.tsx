import { Plus, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductHeaderProps {
  onExport?: () => void;
  onNewProduct?: () => void;
}

export function ProductHeader({ onExport, onNewProduct }: ProductHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Produtos
        </h1>
        <p className="text-muted-foreground text-sm">
          Gerencie seu catálogo, SKUs e estoque de forma centralizada.
        </p>
      </div>
      
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          onClick={onExport}
          className="border-slate-200"
        >
          <Download className="mr-2 h-4 w-4" /> 
          Exportar
        </Button>
        
        <Button 
          onClick={onNewProduct}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="mr-2 h-4 w-4" /> 
          Novo Produto
        </Button>
      </div>
    </div>
  );
}
