import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

export default function Home() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="w-full">
        <Header />
        <div>Main</div>
      </div>
    </div>
  );
}
