import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Product } from "@/services/api/products";

type FormValues = {
  value: string;
  description: string;
  id?: number;
};

const resolver: Resolver<FormValues> = async (values) => ({
  values: values.value ? values : {},
  errors: !values.value
    ? { value: { type: "required", message: "Valor é obrigatório." } }
    : {},
});

export default function Products() {
  const [productData, setProductData] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const fetchProductData = async () => {
    const products = await Product.getProducts();
    setProductData(products.dados);
  };

  useEffect(() => {
    fetchProductData();
  }, []);

  const openAddProductDrawer = () => {
    setSelectedProduct(null);
    setIsDrawerOpen(true);
  };

  const openEditProductDrawer = (product) => {
    setSelectedProduct(product);
    setIsDrawerOpen(true);
  };

  const handleDeleteProduct = async (id) => {
    Swal.fire({
      title: "Você quer Deletar esse produto?",
      text: "Essa ação não pode ser desfeita!",
      icon: "error",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, pode deletar!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await Product.deleteProduct(id);
        Swal.fire({
          title: "Deletado!",
          text: "Produto deletado com sucesso!",
          icon: "success",
        });
      }
      fetchProductData();
    });
  };

  return (
    <div className="w-full h-[550px] flex flex-col justify-center items-center">
      <div className="flex justify-between items-center w-[80%]">
        <h1 className="text-3xl text-white font-bold">Produtos</h1>
        <Button
          variant="secondary"
          onClick={openAddProductDrawer}
          className="my-5"
        >
          Adicionar Produto
        </Button>
      </div>

      <ScrollArea className="w-[80%] bg-[#09090B] rounded p-4">
        <Table>
          <TableHeader className="font-bold text-xl">
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Editar</TableHead>
              <TableHead>Remover</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-lg">
            {productData.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.id}</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>R$ {product.value}</TableCell>
                <TableCell className="w-20 text-xl">
                  <div className="flex items-center justify-center">
                    <button
                      onClick={() => openEditProductDrawer(product)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FaRegEdit />
                    </button>
                  </div>
                </TableCell>
                <TableCell className="w-20 text-xl">
                  <div className="flex items-center justify-center">
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
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
              {selectedProduct ? "Editar Produto" : "Adicionar Produto"}
            </DrawerTitle>
            <DrawerDescription>
              {selectedProduct
                ? "Edite os dados do produto"
                : "Adicione um novo produto"}
            </DrawerDescription>
          </DrawerHeader>
          <AddProductForm
            className="px-4"
            setIsDrawerOpen={setIsDrawerOpen}
            selectedProduct={selectedProduct}
            refreshProductData={fetchProductData}
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

function AddProductForm({
  className,
  setIsDrawerOpen,
  selectedProduct,
  refreshProductData,
}: {
  className: string;
  setIsDrawerOpen: (open: boolean) => void;
  selectedProduct: FormValues | null;
  refreshProductData: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormValues>({ resolver });

  useEffect(() => {
    if (selectedProduct) {
      setValue("description", selectedProduct.description);
      setValue("value", selectedProduct.value);
      setValue("id", selectedProduct.id);
    }
  }, [selectedProduct, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    if (data.id) {
      await Product.updateProduct(data);
    } else {
      await Product.createProduct(data);
    }
    refreshProductData();
    setIsDrawerOpen(false);
  });

  return (
    <form
      onSubmit={onSubmit}
      className={cn("grid items-start gap-4", className)}
    >
      <div className="grid gap-2">
        <Label htmlFor="description">Descrição</Label>
        <Input
          {...register("description")}
          type="text"
          id="description"
          placeholder="Descrição do produto"
          defaultValue={selectedProduct?.description}
        />
        {errors.description && (
          <p className="text-red-500">{errors.description.message}</p>
        )}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="value">Preço</Label>
        <Input
          {...register("value")}
          id="value"
          placeholder="Preço do produto"
          defaultValue={selectedProduct?.value}
        />
        {errors.value && (
          <p className="text-red-500">{errors?.value?.message}</p>
        )}
      </div>
      <Button type="submit">
        {selectedProduct ? "Salvar Alterações" : "Criar produto"}
      </Button>
    </form>
  );
}
