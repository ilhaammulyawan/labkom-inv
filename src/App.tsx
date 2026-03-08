import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import Dashboard from "./pages/Dashboard";
import InventoryList from "./pages/InventoryList";
import ItemDetail from "./pages/ItemDetail";
import AddItem from "./pages/AddItem";
import Maintenance from "./pages/Maintenance";
import QRPrint from "./pages/QRPrint";
import Reports from "./pages/Reports";
import Guide from "./pages/Guide";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/inventory" element={<InventoryList />} />
            <Route path="/inventory/add" element={<AddItem />} />
            <Route path="/inventory/:id" element={<ItemDetail />} />
            <Route path="/maintenance" element={<Maintenance />} />
            <Route path="/qr-print" element={<QRPrint />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/guide" element={<Guide />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
