import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Outlet } from "react-router-dom";

export default function App() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="w-full">
        <Header />
        <Outlet />
      </div>
    </div>
  );
}
