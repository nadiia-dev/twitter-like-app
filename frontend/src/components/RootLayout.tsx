import AppSidebar from "./AppSidebar";
import { SidebarProvider, SidebarTrigger } from "./ui/sidebar";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
};

export default RootLayout;
