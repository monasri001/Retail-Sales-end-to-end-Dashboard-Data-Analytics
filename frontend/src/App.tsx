import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import SalesAnalytics from "./pages/SalesAnalytics";
import Products from "./pages/Products";
import Customers from "./pages/Customers";
import Forecast from "./pages/Forecast";
import AIInsights from "./pages/AIInsights";
import Alerts from "./pages/Alerts";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/sales" element={<SalesAnalytics />} />
          <Route path="/products" element={<Products />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/forecast" element={<Forecast />} />
          <Route path="/ai-insights" element={<AIInsights />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
