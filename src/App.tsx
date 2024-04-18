import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Home from "./pages/Home";

export default function App() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="w-full">
        <Header />
        <Home />
      </div>
    </div>
  );
}
