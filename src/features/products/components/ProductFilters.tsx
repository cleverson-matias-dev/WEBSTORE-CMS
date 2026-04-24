import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Filter } from "lucide-react";
import { useDeferredValue, useState } from "react";

export default function ProductFilters({ activeCount, onApply, onClear}: { 
  activeCount: number,
  onApply: (filters: { slug?: string, description?: string }) => void,
  onClear: () => void 
}) {
  // O estado de digitação fica preso aqui dentro. 
  // O componente pai não sabe que o usuário está digitando.
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
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" /> Filtros
          {activeCount > 0 && (
            <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground font-bold">
              {activeCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-blue-50/90 backdrop-blur-sm border-2 border-blue-400 border-dashed shadow-xl" align="end">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium">Filtros Avançados</h4>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={tempFilters.slug}
                onChange={(e) => setTempFilters({ ...tempFilters, slug: e.target.value })}
                className="col-span-2 h-8"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                value={tempFilters.description}
                onChange={(e) => setTempFilters({ ...tempFilters, description: e.target.value })}
                className="col-span-2 h-8"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <Button onClick={handleClear} variant="ghost" size="sm">Limpar</Button>
            <Button onClick={handleApply} size="sm">Aplicar</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}