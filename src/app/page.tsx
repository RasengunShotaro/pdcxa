import { TopBar } from "@/components/elements/TopBar";
import { AppSidebar as Sidebar } from "@/components/elements/Sidebar";
import { MainContent } from "@/components/elements/MainContent";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* トップバー */}
      <TopBar />
      
      <div className="flex pt-16"> {/* pt-16でトップバーの高さ分を確保 */}
        {/* サイドバー */}
        <div className="flex-none">
          <Sidebar />
        </div>
        
        {/* メインコンテンツエリア */}
        <div className="flex-1 p-6 overflow-auto">
          <MainContent />
        </div>
      </div>
    </div>
  );
}
