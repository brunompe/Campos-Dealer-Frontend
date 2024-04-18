import { BsBoxSeam, BsCart2 } from "react-icons/bs";
import { GoPeople } from "react-icons/go";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex justify-center items-center h-[500px] gap-10">
      <Link to="/customers">
        <div className="h-60 w-60 bg-[#09090B] font-bold border border-opacity-80 flex flex-col justify-center items-center border-[#A1A1AA]">
          <span>Clientes</span>
          <div className="text-9xl py-5 flex justify-center items-center hover:text-white">
            <GoPeople />
          </div>
        </div>
      </Link>
      <Link to="/products">
        <div className="h-60 w-60 bg-[#09090B] font-bold border border-opacity-80 flex flex-col justify-center items-center border-[#A1A1AA]">
          <span>Produtos</span>
          <div className="text-9xl py-5 flex justify-center items-center hover:text-white">
            <BsBoxSeam />
          </div>
        </div>
      </Link>
      <Link to="/sales">
        <div className="h-60 w-60 bg-[#09090B] font-bold border border-opacity-80 flex flex-col justify-center items-center border-[#A1A1AA]">
          <span>Vendas</span>
          <div className="text-9xl py-5 flex justify-center items-center hover:text-white">
            <BsCart2 />
          </div>
        </div>
      </Link>
    </div>
  );
}
