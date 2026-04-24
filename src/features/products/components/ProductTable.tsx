import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import type { ProductOutputDTO } from "@/api/gen/catalog/model";
import StatusBadge from "./StatusBadge";

interface ProductTableProps {
  products: ProductOutputDTO[] | undefined;
  isLoading: boolean;
  selectedItems: string[];
  onSelectItems: (ids: string[]) => void;
  onEdit: (product: ProductOutputDTO) => void;
  totalProducts?: number;
  limit?: number;
}

export function ProductTable({ 
  products, 
  isLoading, 
  selectedItems, 
  onSelectItems, 
  onEdit,
  totalProducts,
  limit 
}: ProductTableProps) {
  
  const handleSelectAll = (checked: boolean) => {
    if (checked && products) {
      onSelectItems(products.map((p) => p.id as string));
    } else {
      onSelectItems([]);
    }
  };

  const handleSelectItem = (productId: string, checked: boolean) => {
    onSelectItems(
      checked 
        ? [...selectedItems, productId] 
        : selectedItems.filter(id => id !== productId)
    );
  };

  return (
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="w-12.5">
                <Checkbox 
                  onCheckedChange={handleSelectAll}
                  checked={products?.length ? selectedItems.length === products.length : false}
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
              Array.from({ length: 5 }).map((_, i) => <TableSkeleton key={i} />)
            ) : (
              products?.map((product) => {
                const totalStock = product.skus.reduce((acc, curr) => acc + curr.quantity, 0);
                const status = getProductStatus(product, totalStock);

                return (
                  <TableRow key={product.id} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell>
                      <Checkbox 
                        checked={selectedItems.includes(product.id)} 
                        onCheckedChange={(checked) => handleSelectItem(product.id, !!checked)}
                      />
                    </TableCell>
                    <TableCell>
                      <ProductImage src={product.images?.[0]?.url} alt={product.name} />
                    </TableCell>
                    <TableCell className="max-w-75">
                      <ProductInfo product={product} onEdit={() => onEdit(product)} />
                    </TableCell>
                    <TableCell onClick={() => onEdit(product)} className="cursor-pointer">
                      <div className="flex flex-col">
                        <span className="font-mono text-xs text-muted-foreground uppercase font-bold">
                          {product.skus[0]?.sku_code || "SEM SKU"}
                        </span>
                        {product.skus.length > 1 && (
                          <span className="text-[10px] font-bold text-blue-600 mt-0.5">
                            +{product.skus.length - 1} variantes
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
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Soma SKUs</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <ActionMenu product={product} onEdit={() => onEdit(product)} />
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
          totalProducts ? `Mostrando ${limit && limit < totalProducts ? limit : totalProducts} de ${totalProducts} produtos` : "Nenhum produto encontrado"
        )}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>Anterior</Button>
          <Button variant="outline" size="sm" disabled={isLoading}>Próximo</Button>
        </div>
      </div>
    </div>
  );
}

// --- Subcomponentes auxiliares (mantidos no mesmo arquivo por serem exclusivos da tabela) ---

function ProductImage({ src, alt }: { src?: string, alt: string }) {
  return (
    <div className="w-10 h-10 rounded-md border bg-slate-100 flex items-center justify-center overflow-hidden">
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <span className="text-xs">📦</span>
      )}
    </div>
  );
}

function ProductInfo({ product, onEdit }: { product: ProductOutputDTO, onEdit: () => void }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex flex-col cursor-pointer group" onClick={onEdit}>
            <span className="font-semibold text-slate-900 truncate group-hover:underline">{product.name}</span>
            <span className="text-[11px] text-muted-foreground font-mono truncate">/{product.slug}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="right" className="max-w-xs bg-slate-900 text-white p-3 shadow-xl">
          <p className="font-bold border-b border-slate-700 pb-1 mb-1">{product.name}</p>
          <p className="text-xs">{product.description || "Sem descrição."}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function ActionMenu({ product, onEdit }: { product: ProductOutputDTO, onEdit: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Opções</DropdownMenuLabel>
        <DropdownMenuItem onClick={onEdit}>Editar Dados Básicos</DropdownMenuItem>
        <DropdownMenuItem>Ver SKUs ({product.skus.length})</DropdownMenuItem>
        <DropdownMenuItem>Duplicar</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-600">Desativar</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}



function TableSkeleton() {
  return (
    <TableRow>
      <TableCell><Skeleton className="h-4 w-4" /></TableCell>
      <TableCell><Skeleton className="h-10 w-10 rounded-md" /></TableCell>
      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
      <TableCell><Skeleton className="h-5 w-20 rounded-full" /></TableCell>
      <TableCell><div className="space-y-1"><Skeleton className="h-4 w-12" /><Skeleton className="h-3 w-16" /></div></TableCell>
      <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
      <TableCell className="text-right"><Skeleton className="ml-auto h-8 w-8 rounded-md" /></TableCell>
    </TableRow>
  );
}

function getProductStatus(product: ProductOutputDTO, totalStock: number) {
  if (product.skus.length === 0 || totalStock === 0) return "inativo";
  const hasLowStock = product.skus.some(sku => sku.quantity > 0 && sku.quantity <= 10);
  return hasLowStock ? "baixo estoque" : "ativo";
}
