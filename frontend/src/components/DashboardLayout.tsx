import { ReactNode } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';

const DashboardLayout = ({ children }: { children: ReactNode }) => (
  <SidebarProvider>
    <div className="min-h-screen flex w-full relative">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-mint-glow/60 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-t from-muted/40 to-transparent rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-grid opacity-40" />
      </div>

      <AppSidebar />

      <div className="flex-1 flex flex-col relative z-10">
        <header className="h-14 flex items-center border-b border-border/50 bg-background/60 backdrop-blur-sm px-4 sticky top-0 z-20">
          <SidebarTrigger className="mr-4" />
          <span className="font-accent text-muted-foreground text-sm">Smart Retail Analytics</span>
        </header>
        <main className="flex-1 p-4 md:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  </SidebarProvider>
);

export default DashboardLayout;
