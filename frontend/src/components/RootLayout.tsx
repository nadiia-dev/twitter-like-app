import AppSidebar from "./AppSidebar";
import { SidebarProvider, SidebarTrigger } from "./ui/sidebar";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full">
          <div className="w-full h-16 px-4 flex items-center justify-between border-b bg-white shadow-sm">
            <SidebarTrigger />
          </div>
          <Outlet />
        </main>
      </SidebarProvider>
    </div>
  );
};

export default RootLayout;
