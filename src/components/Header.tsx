import { Input } from "@/components/ui/input";
import { CiSearch } from "react-icons/ci";

export default function Header() {
  return (
    <>
      <header className="w-full py-10">
        <div className="flex justify-end items-center pr-20">
          <Input
            type="search"
            placeholder="Search..."
            className="w-[25%] rounded-lg bg-[#09090B] pl-4 "
          />
          <div className="text-4xl px-2 hover:text-white">
            <CiSearch />
          </div>
        </div>
      </header>
    </>
  );
}
