import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton-custom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import type { ProductOutputDTO } from "@/api/gen/catalog/model";
import StatusBadge from "./StatusBadge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export type PaginationProps = {
  current: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
};

interface ProductTableProps {
  products: ProductOutputDTO[] | undefined;
  isLoading: boolean;
  selectedItems: string[];
  onSelectItems: (ids: string[]) => void;
  onEdit: (product: ProductOutputDTO) => void;
  pagination: PaginationProps;
}

export function ProductTable({
  products,
  isLoading,
  selectedItems,
  onSelectItems,
  onEdit,
  pagination,
}: ProductTableProps) {
  const totalPages = Math.ceil(pagination.total / pagination.pageSize);

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
        : selectedItems.filter((id) => id !== productId)
    );
  };

  return (
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-slate-50/60">
            <TableRow>
              <TableHead className="w-14 px-6">
                <Checkbox
                  onCheckedChange={handleSelectAll}
                  checked={
                    products?.length
                      ? selectedItems.length === products.length
                      : false
                  }
                />
              </TableHead>
              <TableHead className="w-24 px-4 py-4">Imagem</TableHead>
              <TableHead className="px-4">
                <div className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
                  Produto <ArrowUpDown className="h-3.5 w-3.5" />
                </div>
              </TableHead>
              <TableHead className="px-4">SKU Base</TableHead>
              <TableHead className="px-4">Categoria</TableHead>
              <TableHead className="px-4">Estoque Total</TableHead>
              <TableHead className="px-4">Status</TableHead>
              <TableHead className="text-right px-6">Ações</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => <TableSkeleton key={i} />)
            ) : (
              products?.map((product) => {
                const totalStock = product.skus.reduce(
                  (acc, curr) => acc + curr.quantity,
                  0
                );
                const status = getProductStatus(product, totalStock);

                return (
                  <TableRow
                    key={product.id}
                    className="hover:bg-slate-50/40 transition-colors group"
                  >
                    <TableCell className="px-6 py-4">
                      <Checkbox
                        checked={selectedItems.includes(product.id)}
                        onCheckedChange={(checked) =>
                          handleSelectItem(product.id, !!checked)
                        }
                      />
                    </TableCell>

                    <TableCell className="px-4 py-4">
                      <ProductImage
                        src={product.images?.[0]?.url}
                        alt={product.name}
                      />
                    </TableCell>

                    <TableCell className="px-4 py-4 max-w-xs">
                      <ProductInfo
                        product={product}
                        onEdit={() => onEdit(product)}
                      />
                    </TableCell>

                    <TableCell
                      className="px-4 py-4 cursor-pointer"
                      onClick={() => onEdit(product)}
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="font-mono text-xs text-slate-600 uppercase font-bold tracking-tight">
                          {product.skus[0]?.sku_code || "SEM SKU"}
                        </span>
                        {product.skus.length > 1 && (
                          <span className="text-[10px] font-bold text-blue-600">
                            +{product.skus.length - 1} variantes
                          </span>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="px-4 py-4">
                      <Badge
                        variant="secondary"
                        className="font-medium bg-slate-100 text-slate-600 border-none"
                      >
                        {product.category.name}
                      </Badge>
                    </TableCell>

                    <TableCell className="px-4 py-4">
                      <div className="flex flex-col">
                        <span
                          className={
                            totalStock < 20
                              ? "text-orange-600 font-bold"
                              : "text-slate-700 font-semibold"
                          }
                        >
                          {totalStock} un.
                        </span>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-tighter">
                          Soma SKUs
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="px-4 py-4">
                      <StatusBadge status={status} />
                    </TableCell>

                    <TableCell className="text-right px-6 py-4">
                      <ActionMenu
                        product={product}
                        onEdit={() => onEdit(product)}
                      />
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <div className="px-6 py-4 border-t flex items-center justify-between text-sm text-muted-foreground bg-slate-50/30">
        <div>
          {isLoading ? (
            <Skeleton className="h-4 w-40" />
          ) : (
            `Mostrando ${products?.length || 0} de ${pagination.total} produtos`
          )}
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs">
            Página <strong>{pagination.current}</strong> de {totalPages || 1}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.current === 1 || isLoading}
              onClick={() => pagination.onPageChange(pagination.current - 1)}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.current >= totalPages || isLoading}
              onClick={() => pagination.onPageChange(pagination.current + 1)}
            >
              Próximo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Componentes Auxiliares ---

function ProductImage({ src, alt }: { src?: string; alt: string }) {
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

// 1. Atualização do Componente ProductInfo
function ProductInfo({ 
  product, 
  onEdit 
}: { 
  product: ProductOutputDTO; 
  onEdit: () => void; 
}) {
  const MAX_NAME = 30;
  const MAX_DESC = 60;

  const truncate = (text: string | undefined, limit: number) => {
    if (!text) return "";
    return text.length > limit ? text.substring(0, limit) + "..." : text;
  };

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          {/* Adicionei inline-block para o trigger ocupar apenas o espaço do texto */}
          <div 
            className="flex flex-col cursor-pointer group w-fit max-w-70" 
            onClick={onEdit}
          >
            <span className="font-semibold text-slate-900 group-hover:text-blue-600 group-hover:underline decoration-blue-600/30 underline-offset-4 transition-colors">
              {truncate(product.name, MAX_NAME)}
            </span>
            
            {product.description && (
              <p className="text-[12px] text-slate-500 mt-0.5 font-normal leading-tight">
                {truncate(product.description, MAX_DESC)}
              </p>
            )}
          </div>
        </TooltipTrigger>
        
        <TooltipContent 
          side="right" 
          align="start" // Alinha o topo do tooltip com o topo do texto
          sideOffset={8} // Reduz a distância lateral (padrão costuma ser maior)
          className="max-w-xs bg-slate-900 text-white p-3 shadow-2xl border-none rounded-lg animate-in fade-in slide-in-from-left-1"
        >
          <div className="space-y-1.5">
            <p className="font-bold text-sm leading-none border-b border-white/10 pb-1.5 mb-1.5">
              {product.name}
            </p>
            <p className="text-xs text-slate-300 leading-relaxed">
              {product.description || "Sem descrição disponível."}
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}




function ActionMenu({ product, onEdit }: { product: ProductOutputDTO; onEdit: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="h-8 w-8 p-0 hover:bg-slate-100 rounded-md transition-colors"
        >
          <MoreHorizontal className="h-4 w-4 text-slate-500" />
        </Button>
      </DropdownMenuTrigger>
      
      {/* Estilização aplicada aqui para combinar com o Popover de Filtros */}
      <DropdownMenuContent 
        align="end" 
        className="w-56 p-0 bg-white border border-slate-200 shadow-xl rounded-xl overflow-hidden"
      >
        {/* Cabeçalho do Menu (seguindo o padrão do filtro) */}
        <div className="px-4 py-2.5 border-b bg-slate-50/50">
          <p className="font-semibold text-xs text-slate-900 uppercase tracking-wider">
            Ações do Produto
          </p>
        </div>

        <div className="p-1">
          <DropdownMenuLabel className="text-[10px] font-bold text-slate-400 uppercase px-3 py-2">
            Gerenciamento
          </DropdownMenuLabel>
          
          <DropdownMenuItem 
            onClick={onEdit}
            className="cursor-pointer px-3 py-2 text-sm text-slate-700 focus:bg-slate-50 focus:text-blue-600 gap-2"
          >
            Editar Dados Básicos
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            className="cursor-pointer px-3 py-2 text-sm text-slate-700 focus:bg-slate-50 focus:text-blue-600 gap-2"
          >
            Ver SKUs ({product.skus.length})
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            className="cursor-pointer px-3 py-2 text-sm text-slate-700 focus:bg-slate-50 focus:text-blue-600 gap-2"
          >
            Duplicar
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-slate-100" />
          
          <DropdownMenuItem 
            className="cursor-pointer px-3 py-2 text-sm text-red-600 focus:bg-red-50 focus:text-red-700 gap-2"
          >
            Desativar Produto
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


function TableSkeleton() {
  return (
    <TableRow>
      <TableCell className="px-6 py-4">
        <Skeleton className="h-4 w-4" />
      </TableCell>
      <TableCell className="px-4 py-4">
        <Skeleton className="h-10 w-10 rounded-md" />
      </TableCell>
      <TableCell className="px-4 py-4">
        <Skeleton className="h-4 w-32" />
      </TableCell>
      <TableCell className="px-4 py-4">
        <Skeleton className="h-4 w-24" />
      </TableCell>
      <TableCell className="px-4 py-4">
        <Skeleton className="h-5 w-20 rounded-full" />
      </TableCell>
      <TableCell className="px-4 py-4">
        <div className="space-y-1">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-3 w-16" />
        </div>
      </TableCell>
      <TableCell className="px-4 py-4">
        <Skeleton className="h-6 w-20 rounded-full" />
      </TableCell>
      <TableCell className="text-right px-6 py-4">
        <Skeleton className="ml-auto h-8 w-8 rounded-md" />
      </TableCell>
    </TableRow>
  );
}

function getProductStatus(product: ProductOutputDTO, totalStock: number) {
  if (product.skus.length === 0 || totalStock === 0) return "inativo";
  const hasLowStock = product.skus.some(
    (sku) => sku.quantity > 0 && sku.quantity <= 10
  );
  return hasLowStock ? "baixo estoque" : "ativo";
}
