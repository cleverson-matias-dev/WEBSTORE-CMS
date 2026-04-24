import { useState, useDeferredValue } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Filter, X } from "lucide-react";

interface ProductFiltersProps {
  activeCount: number;
  onApply: (filters: { slug?: string; description?: string }) => void;
  onClear: () => void;
}

export default function ProductFilters({
  activeCount,
  onApply,
  onClear,
}: ProductFiltersProps) {
  const [tempFilters, setTempFilters] = useState({ slug: "", description: "" });
  const [isOpen, setIsOpen] = useState(false);
  const deferredFilters = useDeferredValue(tempFilters);

  const handleApply = () => {
    onApply(deferredFilters);
    setIsOpen(false);
  };

  const handleClear = () => {
    setTempFilters({ slug: "", description: "" });
    onClear();
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-9 border-slate-200 hover:bg-slate-50 hover:text-slate-900 transition-colors"
        >
          <Filter className="mr-2 h-4 w-4 text-slate-500" />
          <span className="font-medium">Filtros</span>
          {activeCount > 0 && (
            <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] text-white font-bold shadow-sm">
              {activeCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent 
        className="w-80 p-0 bg-white border border-slate-200 shadow-xl rounded-xl overflow-hidden" 
        align="end"
      >
        {/* Header do Popover */}
        <div className="px-4 py-3 border-b bg-slate-50/50 flex items-center justify-between">
          <h4 className="font-semibold text-sm text-slate-900">Filtros Avançados</h4>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 rounded-md text-slate-400"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Corpo do Popover */}
        <div className="p-4 space-y-4">
          <div className="space-y-3">
            <div className="grid gap-1.5">
              <Label htmlFor="slug" className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Slug do Produto
              </Label>
              <Input
                id="slug"
                placeholder="ex: camiseta-algodao"
                value={tempFilters.slug}
                onChange={(e) => setTempFilters({ ...tempFilters, slug: e.target.value })}
                className="h-9 text-sm border-slate-200 focus-visible:ring-blue-500"
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="description" className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Descrição
              </Label>
              <Input
                id="description"
                placeholder="Buscar no texto..."
                value={tempFilters.description}
                onChange={(e) => setTempFilters({ ...tempFilters, description: e.target.value })}
                className="h-9 text-sm border-slate-200 focus-visible:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Footer do Popover */}
        <div className="px-4 py-3 bg-slate-50/50 border-t flex justify-end gap-2">
          <Button 
            onClick={handleClear} 
            variant="ghost" 
            size="sm"
            className="text-slate-500 hover:text-slate-900"
          >
            Limpar
          </Button>
          <Button 
            onClick={handleApply} 
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 font-medium"
          >
            Aplicar Filtros
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
