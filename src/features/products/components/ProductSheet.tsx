import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Box, Package, DollarSign } from "lucide-react";
import type { ProductOutputDTO } from "@/api/gen/catalog/model";

interface ProductSheetProps {
  product: ProductOutputDTO | null;
  onClose: () => void;
}

export function ProductSheet({ product, onClose }: ProductSheetProps) {
  const isOpen = !!product;

  const handleSave = () => {
    alert(`As alterações para "${product?.name}" foram salvas (simulação)`);
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      {/* Aumentado para md (aprox. 450px a 500px) para acomodar a grade melhor */}
      <SheetContent className="sm:max-w-xl overflow-y-auto p-0 flex flex-col gap-0 border-l border-slate-200">
        
        {/* Header com Padding mais robusto */}
        <SheetHeader className="p-8 pb-6 bg-slate-50/50">
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <Package className="h-5 w-5" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Editor de Catálogo</span>
          </div>
          <SheetTitle className="text-2xl font-bold text-slate-900">Editar Dados Básicos</SheetTitle>
          <SheetDescription className="text-slate-500 text-sm leading-relaxed">
            Ajuste preços, estoque e dimensões das variações de{" "}
            <span className="font-bold text-slate-900 underline decoration-blue-500/30">
              {product?.name}
            </span>
          </SheetDescription>
        </SheetHeader>

        <Separator />

        {/* Área de conteúdo com Padding Lateral p-8 */}
        <div className="flex-1 px-8 py-6 space-y-8">
          {product?.skus.map((sku, index) => (
            <div key={sku.id} className="relative group">
              {/* Cabeçalho da Variante: Thumb + SKU Info */}
              <div className="flex items-start gap-4 mb-4">
                {/* Thumbnail Placeholder */}
                <div className="h-16 w-16 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center text-slate-400 group-hover:border-blue-200 group-hover:bg-blue-50 transition-colors shrink-0">
                  <Package className="h-6 w-6 mb-1 opacity-50" />
                  <span className="text-[8px] font-bold uppercase">Sem Foto</span>
                </div>

                <div className="flex flex-col gap-1 justify-center h-16">
                  <div className="flex items-center gap-2">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-[9px] font-bold text-white">
                      {index + 1}
                    </div>
                    <Badge variant="outline" className="font-mono text-[11px] bg-white border-slate-200 shadow-sm px-2 py-0">
                      {sku?.sku_code || "SEM SKU"}
                    </Badge>
                  </div>
                  
                  {/* ID posicionado logo abaixo do SKU Code */}
                  <span className="text-[10px] text-slate-400 font-medium uppercase tracking-tight ml-7">
                    ID: <span className="font-mono">{sku.id}</span>
                  </span>
                </div>
              </div>

              {/* Grid de Inputs */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-5 p-5 border rounded-2xl bg-white shadow-sm group-hover:border-blue-200 transition-colors">
                {/* Preço */}
                <div className="space-y-2">
                  <Label htmlFor={`price-${sku.id}`} className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                    <DollarSign className="h-3 w-3" /> Preço (R$)
                  </Label>
                  <Input 
                    id={`price-${sku.id}`} 
                    type="number" 
                    defaultValue={sku.price} 
                    step="0.01" 
                    className="h-10 focus-visible:ring-blue-500 border-slate-200" 
                  />
                </div>

                {/* Estoque */}
                <div className="space-y-2">
                  <Label htmlFor={`stock-${sku.id}`} className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                    <Box className="h-3 w-3" /> Estoque
                  </Label>
                  <Input 
                    id={`stock-${sku.id}`} 
                    type="number" 
                    defaultValue={sku.quantity} 
                    className="h-10 focus-visible:ring-blue-500 border-slate-200" 
                  />
                </div>

                {/* Dimensões */}
                <div className="col-span-2 space-y-2 pt-2 border-t border-slate-50">
                  <Label htmlFor={`dim-${sku.id}`} className="text-xs font-bold text-slate-600">
                    Dimensões (Ex: 20x15x10 cm)
                  </Label>
                  <Input 
                    id={`dim-${sku.id}`} 
                    placeholder="Comprimento x Largura x Altura"
                    className="h-10 focus-visible:ring-blue-500 border-slate-200"
                    defaultValue={sku.dimensions || ""} 
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer fixo com Padding p-8 */}
        <Separator />
        <SheetFooter className="p-8 bg-slate-50/50 gap-3 sm:gap-0">
          <Button variant="ghost" className="flex-1 text-slate-500 hover:bg-slate-100 h-11" onClick={onClose}>
            Cancelar
          </Button>
          <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-11 shadow-md shadow-blue-200" onClick={handleSave}>
            Salvar Alterações
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
