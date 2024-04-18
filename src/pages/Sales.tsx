import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import dayjs from "dayjs";
import ptBR from "dayjs/locale/pt-br";
import customParseFormat from "dayjs/plugin/customParseFormat";
import Swal from "sweetalert2";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { Resolver, useForm } from "react-hook-form";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Customer } from "@/services/api/customer";
import { Product } from "@/services/api/products";
import { Sale } from "@/services/api/sale";

dayjs.extend(customParseFormat);
dayjs.locale(ptBR);

type FormValues = {
  id?: number;
  productPrice: number;
  quantity: number;
  totalPrice: number;
  saleDate: Date;
  customerId?: number;
  productId?: number;
};

const resolver: Resolver<FormValues> = async (values) => ({
  values: values.productPrice ? values : {},
  errors: !values.productPrice
    ? {
        productPrice: {
          type: "required",
          message: "Valor do produto é obrigatório.",
        },
      }
    : {},
});

export default function Sales() {
  const [saleData, setSaleData] = useState([]);
  const [selectedSale, setSelectedSale] = useState<FormValues | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);

  const fetchSaleData = async () => {
    const sales = await Sale.getSales();
    setSaleData(sales.dados);
  };

  const fetchProductData = async () => {
    const products = await Product.getProducts();
    setProducts(products.dados);
  };

  const fetchCustomerData = async () => {
    const customers = await Customer.getCustomers();
    setCustomers(customers.dados);
  };

  useEffect(() => {
    fetchSaleData();
    fetchProductData();
    fetchCustomerData();
  }, []);

  const openAddSaleDrawer = () => {
    setSelectedSale(null);
    setIsDrawerOpen(true);
  };

  const openEditSaleDrawer = (sale) => {
    setSelectedSale(sale);
    setIsDrawerOpen(true);
  };

  const handleDeleteSale = async (id) => {
    Swal.fire({
      title: "Você quer deletar essa venda?",
      text: "Essa ação não pode ser desfeita!",
      icon: "error",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, pode deletar!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await Sale.deleteSale(id);
        Swal.fire({
          title: "Deletado!",
          text: "Venda deletada com sucesso!",
          icon: "success",
        });
      }
      fetchSaleData();
    });
  };

  return (
    <div className="w-full h-[550px] flex flex-col justify-center items-center">
      <div className="flex justify-between items-center w-[80%]">
        <h1 className="text-3xl text-white font-bold">Vendas</h1>
        <Button
          variant="secondary"
          onClick={openAddSaleDrawer}
          className="my-5"
        >
          Adicionar Venda
        </Button>
      </div>
      <ScrollArea className="w-[80%] bg-[#09090B] rounded p-4">
        <Table>
          <TableHeader className="font-bold text-xl">
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead>Preço do Produto </TableHead>
              <TableHead>Quantidade</TableHead>
              <TableHead>Preço Total</TableHead>
              <TableHead>Data da Venda</TableHead>
              <TableHead>Editar</TableHead>
              <TableHead>Remover</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-lg">
            {saleData.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell className="font-medium">{sale.id}</TableCell>
                <TableCell>R$ {sale.productPrice}</TableCell>
                <TableCell>{sale.quantity}</TableCell>
                <TableCell>R$ {sale.totalPrice}</TableCell>
                <TableCell>
                  {dayjs(sale.saleDate).format("DD/MM/YYYY HH:mm")}
                </TableCell>
                <TableCell className="w-20 text-xl">
                  <div className="flex items-center justify-center">
                    <button
                      onClick={() => openEditSaleDrawer(sale)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FaRegEdit />
                    </button>
                  </div>
                </TableCell>
                <TableCell className="w-20 text-xl">
                  <div className="flex items-center justify-center">
                    <button
                      onClick={() => handleDeleteSale(sale.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <MdDeleteOutline />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>
              {selectedSale ? "Editar Venda" : "Adicionar Venda"}
            </DrawerTitle>
            <DrawerDescription>
              {selectedSale
                ? "Edite os dados da venda"
                : "Adicione uma nova venda"}
            </DrawerDescription>
          </DrawerHeader>
          <AddSaleForm
            className="px-4"
            setIsDrawerOpen={setIsDrawerOpen}
            selectedSale={selectedSale}
            refreshSaleData={fetchSaleData}
            products={products}
            customers={customers}
          />
          <DrawerFooter className="pt-2">
            <DrawerClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

function AddSaleForm({
  className,
  setIsDrawerOpen,
  selectedSale,
  refreshSaleData,
  products,
  customers,
}: {
  className: string;
  setIsDrawerOpen: (open: boolean) => void;
  selectedSale: FormValues | null;
  refreshSaleData: () => void;
  products: Product[];
  customers: Customer[];
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormValues>({ resolver });
  const productId = watch("productId");

  useEffect(() => {
    if (productId) {
      const selectedProduct = products.find(
        (product) => product.id === productId
      );

      if (selectedProduct) {
        setValue("productPrice", selectedProduct.productPrice);
      }
    }
  }, [productId, products, setValue]);

  useEffect(() => {
    if (selectedSale) {
      setValue("productPrice", selectedSale.productPrice);
      setValue("quantity", selectedSale.quantity);
      setValue("id", selectedSale.id);
      setValue("totalPrice", selectedSale.totalPrice);
      setValue("customerId", selectedSale.customerId);
      setValue("productId", selectedSale.productId);
    }
  }, [selectedSale, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    if (data.id) {
      const correctData = {
        id: data.id,
        customerId: +data.customerId,
        productId: +data.productId,
        quantity: +data.quantity,
      };
      await Sale.updateSale(data);
    } else {
      const correctData = {
        customerId: +data.customerId,
        productId: +data.productId,
        quantity: +data.quantity,
        productPrice: +data.productPrice,
      };
      await Sale.createSale(correctData);
    }
    refreshSaleData();
    setIsDrawerOpen(false);
  });

  return (
    <form
      onSubmit={onSubmit}
      className={cn("grid items-start gap-4", className)}
    >
      <div className="grid gap-2">
        <Label htmlFor="customerId">Cliente</Label>
        <select
          {...register("customerId")}
          id="customerId"
          defaultValue={selectedSale?.customerId}
        >
          <option value="">Selecione um cliente</option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name}
            </option>
          ))}
        </select>
        {errors.customerId && (
          <p className="text-red-500">{errors.customerId?.message}</p>
        )}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="productId">Produto</Label>
        <select
          {...register("productId")}
          id="productId"
          defaultValue={selectedSale?.productId}
          className="border text-black"
        >
          <option value="">Selecione um produto</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.description}
            </option>
          ))}
        </select>
        {errors.productId && (
          <p className="text-red-500">{errors.productId?.message}</p>
        )}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="productPrice">Preço do Produto</Label>
        <Input
          {...register("productPrice")}
          id="productPrice"
          placeholder="Preço do Produto"
          defaultValue={selectedSale?.productPrice}
        />
        {errors.productPrice && (
          <p className="text-red-500">{errors.productPrice.message}</p>
        )}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="quantity">Quantidade</Label>
        <Input
          {...register("quantity")}
          id="quantity"
          placeholder="Quantidade"
          defaultValue={selectedSale?.quantity}
        />
        {errors.quantity && (
          <p className="text-red-500">{errors.quantity?.message}</p>
        )}
      </div>
      <Button type="submit">
        {selectedSale ? "Salvar Alterações" : "Criar Venda"}
      </Button>
    </form>
  );
}
