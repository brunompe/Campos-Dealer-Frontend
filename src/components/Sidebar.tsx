import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BsBoxSeam, BsCart2 } from "react-icons/bs";
import { GoPeople } from "react-icons/go";
import { IoHomeOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="bg-[#09090B] w-[5%] min-h-screen border-r border-opacity-80 border-[#A1A1AA]">
      <nav className="flex flex-col justify-center items-center py-10">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link to="/">
                <div className="text-4xl text-black py-5 mb-10 bg-white rounded-full w-14 h-14 flex justify-center items-center">
                  <IoHomeOutline />
                </div>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Home</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link to="/customers">
                <div className="text-4xl py-5 hover:text-white">
                  <GoPeople />
                </div>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Clientes</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link to="/products">
                <div className="text-4xl py-5 hover:text-white">
                  <BsBoxSeam />
                </div>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Produtos</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link to="/sales">
                <div className="text-4xl py-5 hover:text-white">
                  <BsCart2 />
                </div>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Vendas</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </nav>
    </aside>
  );
}
