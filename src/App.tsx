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
import ImportExcel from "./pages/ImportExcel";
import Maintenance from "./pages/Maintenance";
import QRPrint from "./pages/QRPrint";
import ScanQR from "./pages/ScanQR";
import ManageCategories from "./pages/ManageCategories";
import ManageRooms from "./pages/ManageRooms";
import Reports from "./pages/Reports";
import Guide from "./pages/Guide";
import SettingsPage from "./pages/SettingsPage";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import PublicItemDetail from "./pages/PublicItemDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoutes() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

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
        <Route path="/categories" element={<ManageCategories />} />
        <Route path="/rooms" element={<ManageRooms />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppLayout>
  );
}

function AppRoutes() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/item/:id" element={<PublicItemDetail />} />
      <Route path="/*" element={<ProtectedRoutes />} />
    </Routes>
  );
}

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <AppRoutes />
            </AuthProvider>
          </BrowserRouter>
        </>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
