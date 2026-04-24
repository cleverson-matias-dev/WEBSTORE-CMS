import { useState, useDeferredValue } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Download, Search, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import type { ListProductsParams, ProductOutputDTO } from "@/api/gen/catalog/model";
import { useListProducts } from "@/api/gen/catalog/produtos/produtos";
type SearchFilters = Pick<ListProductsParams, "name" | "description" | "slug">;
import { ProductSheet } from "./components/ProductSheet";
import { ProductTable } from "./components/ProductTable";
import ProductFilters from "./components/ProductFilters";
import { ErrorState } from "./components/ErrorState";


export default function ProductsListing() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [editingProduct, setEditingProduct] = useState<ProductOutputDTO | null>(null);
  const [searchTherm, setSearchTherm] = useState<SearchFilters>({
    name: "",
    description: "",
    slug: ""
  });
  const deferredSearch = useDeferredValue(searchTherm);

  const {data: products, error, isLoading, refetch } = useListProducts({
    name: deferredSearch?.name,
    description: deferredSearch?.description,
    slug: deferredSearch?.slug
  });

  const removeFilter = (key: keyof ListProductsParams) => {
    setSearchTherm(prev => ({ ...prev, [key]: "" }));
  };

  const activeFilters = Object.entries(searchTherm).filter(([, value]) => value && value.length > 0);

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const value = e.currentTarget.value;
      setSearchTherm({name: value})
    }
  };

  if (error) {
    return (
      <div className="p-6">
        <ErrorState onRetry={() => refetch()} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Produtos</h1>
          <p className="text-muted-foreground text-sm">Gerencie seu catálogo, SKUs e estoque.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Exportar
          </Button>
          <Button className="bg-primary">
            <Plus className="mr-2 h-4 w-4" /> Novo Produto
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border shadow-sm">
        <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              onKeyUp={handleKeyUp}
              placeholder="Buscar por nome..." 
              className="pl-10" 
            />
        </div>

        {/* --- ÁREA DE FILTROS ATIVOS (CHIPS) --- */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center animate-in fade-in slide-in-from-top-1">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider ml-1">
              Filtros ativos:
            </span>
            {activeFilters.map(([key, value]) => (
              <Badge key={key} variant="secondary" className="pl-3 pr-1 py-1 gap-1 border-blue-200 bg-blue-50 text-blue-700">
                <span className="font-bold">{key}:</span> {value}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 ml-1 hover:bg-blue-200 rounded-full"
                  onClick={() => removeFilter(key as keyof ListProductsParams)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
            <Button 
              variant="link" 
              size="sm" 
              onClick={() => setSearchTherm({ name: "", slug: "", description: "" })}
              className="text-muted-foreground text-xs h-auto p-0 ml-2"
            >
              Limpar tudo
            </Button>
          </div>
        )}

        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Popover de Filtros Avançados */}
          <ProductFilters 
            activeCount={activeFilters.length}
            onApply={(advanced) => setSearchTherm(old => ({ ...old, ...advanced }))}
            onClear={() => setSearchTherm(old => ({ ...old, slug: "", description: "" }))}
          />
          
          <Separator orientation="vertical" className="h-8 mx-2 hidden md:block" />

          {selectedItems.length > 0 && (
            <div className="flex gap-2 animate-in fade-in slide-in-from-left-2">
              <Button variant="secondary" size="sm">Editar Selecionados</Button>
              <Button variant="destructive" size="sm">Excluir ({selectedItems.length})</Button>
            </div>
          )}
        </div>
      </div>

      {/* Table Section */}
      <ProductTable 
        products={products?.items}
        isLoading={isLoading}
        selectedItems={selectedItems}
        onSelectItems={setSelectedItems}
        onEdit={setEditingProduct}
        totalProducts={products?.total}
        limit={products?.limit}
      />

      {/* Editor Sheet */}
      <ProductSheet 
        product={editingProduct} 
        onClose={() => setEditingProduct(null)} 
      />

    </div>
  );
}



