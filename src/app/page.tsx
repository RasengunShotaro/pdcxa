import { MainContent } from "@/components/elements/MainContent";
import { AppSidebar as Sidebar } from "@/components/elements/Sidebar";
import { Header } from "@/components/elements/TopBar";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex pt-16">
        <div className="flex-none">
          <Sidebar />
        </div>
        <div className="flex-1 p-6 overflow-auto">
          <MainContent />
        </div>
      </div>
    </div>
  );
}
