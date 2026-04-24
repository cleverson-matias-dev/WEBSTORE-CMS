import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetFooter 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import type { ProductOutputDTO } from "@/api/gen/catalog/model";

interface ProductSheetProps {
  product: ProductOutputDTO | null;
  onClose: () => void;
}

export function ProductSheet({ product, onClose }: ProductSheetProps) {
  // O Sheet abre se houver um produto selecionado
  const isOpen = !!product;

  const handleSave = () => {
    // Aqui entrará sua lógica de mutation futuramente
    alert(`As alterações para "${product?.name}" foram salvas (simulação)`);
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Editar Dados Básicos</SheetTitle>
          <SheetDescription>
            Ajuste preços e estoque das variações de{" "}
            <span className="font-bold text-slate-900">{product?.name}</span>
          </SheetDescription>
        </SheetHeader>

        <div className="py-6 space-y-6">
          {product?.skus.map((sku) => (
            <div 
              key={sku.id} 
              className="p-4 border rounded-xl bg-slate-50/50 space-y-4"
            >
              <div className="flex justify-between items-center">
                <Badge variant="secondary" className="font-mono text-[10px]">
                  {sku?.sku_code || "SEM SKU"}
                </Badge>
                <span className="text-[10px] text-muted-foreground uppercase">
                  ID: {sku.id}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`price-${sku.id}`} className="text-xs">
                    Preço (R$)
                  </Label>
                  <Input 
                    id={`price-${sku.id}`} 
                    type="number" 
                    defaultValue={sku.price} 
                    step="0.01" 
                    className="bg-white" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`stock-${sku.id}`} className="text-xs">
                    Estoque
                  </Label>
                  <Input 
                    id={`stock-${sku.id}`} 
                    type="number" 
                    defaultValue={sku.quantity} 
                    className="bg-white" 
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <SheetFooter className="gap-2 sm:gap-0">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Cancelar
          </Button>
          <Button className="flex-1" onClick={handleSave}>
            Salvar Alterações
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
