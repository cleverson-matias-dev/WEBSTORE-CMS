import { useState, useDeferredValue, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import type { ListProductsParams, ProductOutputDTO } from "@/api/gen/catalog/model";
import { useListProducts } from "@/api/gen/catalog/produtos/produtos";

import { ProductSheet } from "./components/ProductSheet";
import { ProductTable } from "./components/ProductTable";
import ProductFilters from "./components/ProductFilters";
import { ErrorState } from "./components/ErrorState";
import { ProductHeader } from "./components/ProductHeader";

type SearchFilters = Pick<ListProductsParams, "name" | "description" | "slug">;

export default function ProductsListing() {
  const [searchParams, setSearchParams] = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null); // Referência para performance máxima
  
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page")) || 1);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [editingProduct, setEditingProduct] = useState<ProductOutputDTO | null>(null);
  
  const [searchTherm, setSearchTherm] = useState<SearchFilters>({
    name: searchParams.get("name") || "",
    description: searchParams.get("description") || "",
    slug: searchParams.get("slug") || ""
  });

  const deferredSearch = useDeferredValue(searchTherm);

  // Sincronização Estado -> URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (deferredSearch.name) params.set("name", deferredSearch.name);
    if (deferredSearch.description) params.set("description", deferredSearch.description);
    if (deferredSearch.slug) params.set("slug", deferredSearch.slug);
    if (currentPage > 1) params.set("page", String(currentPage));
    setSearchParams(params, { replace: true });
  }, [deferredSearch, currentPage, setSearchParams]);

  const { data: products, error, isLoading, refetch } = useListProducts({
    name: deferredSearch?.name,
    description: deferredSearch?.description,
    slug: deferredSearch?.slug,
    page: currentPage,
    limit: 10
  });

  // Dispara a busca real
  const handleApplyNameSearch = () => {
    const value = inputRef.current?.value || "";
    setSearchTherm(prev => ({ ...prev, name: value }));
    setCurrentPage(1);
  };

  const removeFilter = (key: keyof ListProductsParams) => {
    setSearchTherm(prev => ({ ...prev, [key]: "" }));
    if (key === "name" && inputRef.current) {
      inputRef.current.value = ""; // Limpa o valor físico do input
    }
    setCurrentPage(1);
  };

  const handleClearAll = () => {
    setSearchTherm({ name: "", slug: "", description: "" });
    if (inputRef.current) inputRef.current.value = ""; // Limpa o valor físico do input
    setCurrentPage(1);
  };

  const activeFilters = Object.entries(searchTherm).filter(([, value]) => value && value.length > 0);

  if (error) return <div className="p-6"><ErrorState onRetry={() => refetch()} /></div>;

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      <ProductHeader onNewProduct={() => alert("Novo Produto")} />

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          
          <Input 
            ref={inputRef}
            defaultValue={searchTherm.name} // Valor inicial vindo da URL
            onKeyUp={(e) => e.key === 'Enter' && handleApplyNameSearch()} 
            placeholder="Buscar por nome (Enter)..." 
            className="pl-10 pr-10"
          />

          {/* Botão de limpar manual */}
          <button 
            onClick={() => removeFilter("name")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            {activeFilters.map(([key, value]) => (
              <Badge key={key} variant="secondary" className="pl-3 pr-1 py-1 gap-1 border-blue-200 bg-blue-50 text-blue-700">
                <span className="font-bold">{key}:</span> {value}
                <button onClick={() => removeFilter(key as keyof ListProductsParams)}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            <Button variant="link" size="sm" onClick={handleClearAll} className="text-xs">
              Limpar tudo
            </Button>
          </div>
        )}

        <div className="flex items-center gap-2">
          <ProductFilters 
            activeCount={activeFilters.length} 
            onApply={(advanced) => {
              if (advanced.slug !== undefined && inputRef.current) {
                inputRef.current.value = advanced.slug;
              }
              setSearchTherm(old => ({ ...old, ...advanced }));
              setCurrentPage(1);
            }} 
            onClear={() => {
              setSearchTherm(old => ({ ...old, slug: "", description: "" }));
              setCurrentPage(1);
            }}
          />
          <Separator orientation="vertical" className="h-8 mx-2 hidden md:block" />
          {selectedItems.length > 0 && (
            <div className="flex gap-2">
              <Button variant="destructive" size="sm">Excluir ({selectedItems.length})</Button>
            </div>
          )}
        </div>
      </div>

      <ProductTable 
        products={products?.items} 
        isLoading={isLoading} 
        selectedItems={selectedItems}
        onSelectItems={setSelectedItems}
        onEdit={setEditingProduct}
        pagination={{
          current: currentPage,
          total: products?.total || 0,
          pageSize: 10,
          onPageChange: setCurrentPage
        }}
      />

      <ProductSheet product={editingProduct} onClose={() => setEditingProduct(null)} />
    </div>
  );
}
