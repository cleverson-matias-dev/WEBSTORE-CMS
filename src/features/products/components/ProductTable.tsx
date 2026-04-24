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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import type { ProductOutputDTO } from "@/api/gen/catalog/model";
import StatusBadge from "./StatusBadge";

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

function ProductInfo({
  product,
  onEdit,
}: {
  product: ProductOutputDTO;
  onEdit: () => void;
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex flex-col cursor-pointer group" onClick={onEdit}>
            <span className="font-semibold text-slate-900 truncate group-hover:underline">
              {product.name}
            </span>
            <span className="text-[11px] text-muted-foreground font-mono truncate">
              /{product.slug}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="right"
          className="max-w-xs bg-slate-900 text-white p-3 shadow-xl"
        >
          <p className="font-bold border-b border-slate-700 pb-1 mb-1">
            {product.name}
          </p>
          <p className="text-xs">{product.description || "Sem descrição."}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function ActionMenu({
  product,
  onEdit,
}: {
  product: ProductOutputDTO;
  onEdit: () => void;
}) {
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
