import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { MoreHorizontal, Plus, Filter, Download, ArrowUpDown, Search } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import type { ProductOutputDTO } from "@/api/gen/catalog/model";
import { useListProducts } from "@/api/gen/catalog/produtos/produtos";


export default function ProductsListing() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [editingProduct, setEditingProduct] = useState<ProductOutputDTO | null>(null);

  const {data: products, error, isLoading } = useListProducts();

  if(error) return <>erro!!!</>
  if(isLoading) return <>isLoading</>

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
          <Input placeholder="Buscar por nome ou SKU..." className="pl-10" />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" /> Filtros
          </Button>
          <Separator orientation="vertical" className="h-8 mx-2" />
          {selectedItems.length > 0 && (
            <div className="flex gap-2 animate-in fade-in slide-in-from-left-2">
              <Button variant="secondary" size="sm">Editar Selecionados</Button>
              <Button variant="destructive" size="sm">Excluir ({selectedItems.length})</Button>
            </div>
          )}
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead className="w-12.5">
                  <Checkbox 
                    onCheckedChange={(checked) => {
                      if (checked && products?.items) {
                        setSelectedItems(products.items.map((p) => p.id as string));
                      } else {
                        setSelectedItems([]);
                      }
                    }} 
                    checked={products?.items && selectedItems.length === products.items.length}
                  />
                </TableHead>
                <TableHead className="w-20">Imagem</TableHead>
                <TableHead>
                  <div className="flex items-center gap-1 cursor-pointer hover:text-primary">
                    Produto <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead>SKU Base</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Estoque Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Exibe 5 linhas de Skeleton durante o carregamento
                Array.from({ length: 5 }).map((_, index) => (
                  <TableSkeleton key={index} />
                ))
              ) : (
                products?.items?.map((product) => {
                  const firstSku = product.skus[0]
                  const totalVariants = product.skus.length;
                  const totalStock = product.skus.reduce((acc, curr) => acc + curr.quantity, 0);

                  return (
                    <TableRow key={product.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell>
                        <Checkbox 
                          checked={selectedItems.includes(product.id)}
                          onCheckedChange={(checked) => {
                            setSelectedItems((prev) => 
                              checked ? [...prev, product.id] : prev.filter((id) => id !== product.id)
                            );
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <img src={product?.images[0]?.url} alt={product.name} className="w-10 h-10 rounded-md border object-cover" />
                      </TableCell>
                      <TableCell 
                        className="font-medium text-slate-900 cursor-pointer hover:underline"
                        onClick={() => setEditingProduct(product)}
                      >
                        {product.name}
                      </TableCell>
                      <TableCell className="cursor-pointer" onClick={() => setEditingProduct(product)}>
                        <div className="flex flex-col">
                          <span className="font-mono text-xs text-muted-foreground uppercase font-bold">
                            {firstSku?.sku_code || "SEM SKU"}
                          </span>
                          {totalVariants > 1 && (
                            <span className="text-[10px] font-bold text-blue-600 mt-0.5">
                              +{totalVariants - 1} variantes
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-normal text-slate-600">
                          {product.category.name}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className={totalStock < 20 ? "text-orange-600 font-bold" : "font-semibold"}>
                            {totalStock} un.
                          </span>
                          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                            Soma SKUs
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status="ativo" />
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Opções</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => setEditingProduct(product)}>
                              Editar Dados Básicos
                            </DropdownMenuItem>
                            <DropdownMenuItem>Ver SKUs ({totalVariants})</DropdownMenuItem>
                            <DropdownMenuItem>Duplicar</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">Desativar</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
        <div className="p-4 border-t flex items-center justify-between text-sm text-muted-foreground">
          {isLoading ? (
             <Skeleton className="h-4 w-40" />
          ) : (
            `Mostrando ${products?.items.length} de 450 produtos`
          )}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>Anterior</Button>
            <Button variant="outline" size="sm" disabled={isLoading}>Próximo</Button>
          </div>
        </div>
      </div>

      {/* Editor Sheet */}
      <Sheet open={!!editingProduct} onOpenChange={(open) => !open && setEditingProduct(null)}>
        <SheetContent className="sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Editar Dados Básicos</SheetTitle>
            <SheetDescription>
              Ajuste preços e estoque das variações de{" "}
              <span className="font-bold text-slate-900">{editingProduct?.name}</span>
            </SheetDescription>
          </SheetHeader>
          <div className="py-6 space-y-6">
            {editingProduct?.skus.map((sku) => (
              <div key={sku.id} className="p-4 border rounded-xl bg-slate-50/50 space-y-4">
                <div className="flex justify-between items-center">
                  <Badge variant="secondary" className="font-mono text-[10px]">{sku?.sku_code}</Badge>
                  <span className="text-[10px] text-muted-foreground uppercase">ID: {sku.id}</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`price-${sku.id}`} className="text-xs">Preço (R$)</Label>
                    <Input id={`price-${sku.id}`} type="number" defaultValue={sku.price} step="0.01" className="bg-white" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`stock-${sku.id}`} className="text-xs">Estoque</Label>
                    <Input id={`stock-${sku.id}`} type="number" defaultValue={sku.quantity} className="bg-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <SheetFooter className="gap-2 sm:gap-0">
            <Button variant="outline" className="flex-1" onClick={() => setEditingProduct(null)}>Cancelar</Button>
            <Button 
              className="flex-1" 
              onClick={() => {
                alert("As alterações foram salvas (simulação)");
                setEditingProduct(null);
              }}
            >
              Salvar Alterações
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}

/**
 * Componentes Auxiliares
 */

function TableSkeleton() {
  return (
    <TableRow>
      <TableCell><Skeleton className="h-4 w-4" /></TableCell>
      <TableCell><Skeleton className="h-10 w-10 rounded-md" /></TableCell>
      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
      <TableCell><Skeleton className="h-5 w-20 rounded-full" /></TableCell>
      <TableCell>
        <div className="space-y-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-3 w-16" />
        </div>
      </TableCell>
      <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
      <TableCell className="text-right"><Skeleton className="ml-auto h-8 w-8 rounded-md" /></TableCell>
    </TableRow>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Ativo: "bg-green-100 text-green-700 border-green-200",
    "Baixo Estoque": "bg-orange-100 text-orange-700 border-orange-200",
    Inativo: "bg-slate-100 text-slate-700 border-slate-200",
  };
  return (
    <Badge className={`${styles[status] || styles["Inativo"]} hover:${styles[status]} font-medium border shadow-none whitespace-nowrap`}>
      {status}
    </Badge>
  );
}
