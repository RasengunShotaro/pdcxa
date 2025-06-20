import { AppSidebar } from "@/components/elements/app-sidebar";
import { SiteHeader } from "@/components/elements/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        <div className="flex flex-1">
          <AppSidebar />
          <SidebarInset>
            <div className="flex-1 p-4 flex justify-center">{children}</div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
