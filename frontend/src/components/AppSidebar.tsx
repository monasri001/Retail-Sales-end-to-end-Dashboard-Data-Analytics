import {
  LayoutDashboard, TrendingUp, Package, Users,
  LineChart, Brain, Bell, Download
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { exportData } from '@/lib/api';
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

const items = [
  { title: 'Dashboard', url: '/', icon: LayoutDashboard },
  { title: 'Sales Analytics', url: '/sales', icon: TrendingUp },
  { title: 'Products', url: '/products', icon: Package },
  { title: 'Customers', url: '/customers', icon: Users },
  { title: 'Forecast', url: '/forecast', icon: LineChart },
  { title: 'AI Insights', url: '/ai-insights', icon: Brain },
  { title: 'Alerts', url: '/alerts', icon: Bell },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';

  return (
    <Sidebar collapsible="icon" className="glass-sidebar border-r-0">
      <SidebarContent className="pt-6">
        <div className={`px-4 mb-6 ${collapsed ? 'px-2' : ''}`}>
          {!collapsed && (
            <h1 className="font-heading text-lg tracking-tight">
              <span className="text-primary">Retail</span>
              <span className="text-foreground">IQ</span>
            </h1>
          )}
          {collapsed && (
            <span className="font-heading text-lg text-primary block text-center">R</span>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="font-label text-xs text-muted-foreground uppercase tracking-widest">
            {!collapsed && 'Menu'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === '/'}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-accent hover:text-accent-foreground"
                      activeClassName="bg-accent text-accent-foreground font-semibold"
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto px-3 pb-6">
          <button onClick={exportData} className="btn-primary w-full flex items-center justify-center gap-2 text-xs">
            <Download className="h-4 w-4" />
            {!collapsed && 'Export Data'}
          </button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
