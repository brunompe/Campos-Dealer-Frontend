import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Customer } from "@/services/api/customer";
import { useEffect, useState } from "react";
import { Resolver, useForm } from "react-hook-form";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import Swal from "sweetalert2";

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

type FormValues = {
  name: string;
  city: string;
  id?: number;
};

const resolver: Resolver<FormValues> = async (values) => ({
  values: values.name ? values : {},
  errors: !values.name
    ? { name: { type: "required", message: "Nome é obrigatório." } }
    : {},
});

export default function Customers() {
  const [customerData, setCustomerData] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const fetchCustomerData = async () => {
    const customers = await Customer.getCustomers();
    setCustomerData(customers.dados);
  };

  useEffect(() => {
    fetchCustomerData();
  }, []);

  const openAddCustomerDrawer = () => {
    setSelectedCustomer(null);
    setIsDrawerOpen(true);
  };

  const openEditCustomerDrawer = (customer) => {
    setSelectedCustomer(customer);
    setIsDrawerOpen(true);
  };

  const handleDeleteCustomer = async (id) => {
    Swal.fire({
      title: "Você quer Deletar esse Cliente?",
      text: "Essa ação não pode ser desfeita!",
      icon: "error",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, pode deletar!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await Customer.deleteCustomer(id);
        Swal.fire({
          title: "Deletado!",
          text: "Cliente deletado com sucesso!",
          icon: "success",
        });
      }
      fetchCustomerData();
    });
  };

  return (
    <div className="w-full h-[550px] flex flex-col justify-center items-center">
      <div className="flex justify-between items-center w-[80%]">
        <h1 className="text-3xl text-white font-bold">Clientes</h1>
        <Button
          variant="secondary"
          onClick={openAddCustomerDrawer}
          className="my-5"
        >
          Adicionar Cliente
        </Button>
      </div>

      <ScrollArea className="w-[80%] bg-[#09090B] rounded p-4">
        <Table>
          <TableHeader className="font-bold text-xl">
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Cidade</TableHead>
              <TableHead>Editar</TableHead>
              <TableHead>Remover</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-lg">
            {customerData.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium">{customer.id}</TableCell>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.city}</TableCell>
                <TableCell className="w-20 text-xl">
                  <div className="flex items-center justify-center">
                    <button
                      onClick={() => openEditCustomerDrawer(customer)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FaRegEdit />
                    </button>
                  </div>
                </TableCell>
                <TableCell className="w-20 text-xl">
                  <div className="flex items-center justify-center">
                    <button
                      onClick={() => handleDeleteCustomer(customer.id)}
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
              {selectedCustomer ? "Editar Cliente" : "Adicionar Cliente"}
            </DrawerTitle>
            <DrawerDescription>
              {selectedCustomer
                ? "Edite os dados do cliente"
                : "Adicione um novo cliente"}
            </DrawerDescription>
          </DrawerHeader>
          <AddCustomerForm
            className="px-4"
            setIsDrawerOpen={setIsDrawerOpen}
            selectedCustomer={selectedCustomer}
            refreshCustomerData={fetchCustomerData}
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

function AddCustomerForm({
  className,
  setIsDrawerOpen,
  selectedCustomer,
  refreshCustomerData,
}: {
  className: string;
  setIsDrawerOpen: (open: boolean) => void;
  selectedCustomer: FormValues | null;
  refreshCustomerData: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormValues>({ resolver });

  useEffect(() => {
    if (selectedCustomer) {
      setValue("name", selectedCustomer.name);
      setValue("city", selectedCustomer.city);
      setValue("id", selectedCustomer.id);
    }
  }, [selectedCustomer, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    if (data.id) {
      await Customer.updateCustomer(data);
    } else {
      await Customer.createCustomer(data);
    }
    refreshCustomerData();
    setIsDrawerOpen(false);
  });

  return (
    <form
      onSubmit={onSubmit}
      className={cn("grid items-start gap-4", className)}
    >
      <div className="grid gap-2">
        <Label htmlFor="name">Nome</Label>
        <Input
          {...register("name")}
          type="text"
          id="name"
          placeholder="Nome do cliente"
          defaultValue={selectedCustomer?.name}
        />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="city">Cidade</Label>
        <Input
          {...register("city")}
          id="city"
          placeholder="Cidade do cliente"
          defaultValue={selectedCustomer?.city}
        />
        {errors.city && <p className="text-red-500">{errors.city.message}</p>}
      </div>
      <Button type="submit">
        {selectedCustomer ? "Salvar Alterações" : "Criar Cliente"}
      </Button>
    </form>
  );
}
