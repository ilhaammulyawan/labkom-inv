import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/AppLayout";
import Dashboard from "./pages/Dashboard";
import InventoryList from "./pages/InventoryList";
import ItemDetail from "./pages/ItemDetail";
import AddItem from "./pages/AddItem";
import Maintenance from "./pages/Maintenance";
import QRPrint from "./pages/QRPrint";
import ScanQR from "./pages/ScanQR";
import Reports from "./pages/Reports";
import Guide from "./pages/Guide";
import SettingsPage from "./pages/SettingsPage";
import Login from "./pages/Login";
import PublicItemDetail from "./pages/PublicItemDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoutes() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/inventory" element={<InventoryList />} />
        <Route path="/inventory/add" element={<AddItem />} />
        <Route path="/inventory/:id" element={<ItemDetail />} />
        <Route path="/maintenance" element={<Maintenance />} />
        <Route path="/scan-qr" element={<ScanQR />} />
        <Route path="/qr-print" element={<QRPrint />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/guide" element={<Guide />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppLayout>
  );
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/item/:id" element={<PublicItemDetail />} />
      <Route path="/*" element={<ProtectedRoutes />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
