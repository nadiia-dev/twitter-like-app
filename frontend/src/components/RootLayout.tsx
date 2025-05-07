import ToastComponent from "@/lib/toasts";
import AppSidebar from "./AppSidebar";
import { SidebarProvider, SidebarTrigger } from "./ui/sidebar";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full">
          <div className="w-full h-16 px-4 flex items-center justify-between border-b bg-white shadow-sm">
            <SidebarTrigger />
          </div>
          {children}
        </main>
      </SidebarProvider>
      <ToastComponent />
    </div>
  );
};

export default RootLayout;
