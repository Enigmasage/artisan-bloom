import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import ProtectedRoute from "@/routes/ProtectedRoute";

// Public Pages
import Index from "./pages/Index";
import Products from "./pages/public/Products";
import ProductDetail from "./pages/public/ProductDetail";
import Artisans from "./pages/public/Artisans";
import ArtisanDetail from "./pages/public/ArtisanDetail";
import About from "./pages/public/About";
import Awareness from "./pages/public/Awareness";
import Login from "./pages/public/Login";
import Register from "./pages/public/Register";

// Customer Pages
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import Cart from "./pages/customer/Cart";
import Wishlist from "./pages/customer/Wishlist";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/artisans" element={<Artisans />} />
              <Route path="/artisans/:id" element={<ArtisanDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/awareness" element={<Awareness />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Customer Routes */}
              <Route path="/customer/dashboard" element={<ProtectedRoute allowedRoles={["customer"]}><CustomerDashboard /></ProtectedRoute>} />
              <Route path="/customer/cart" element={<Cart />} />
              <Route path="/customer/wishlist" element={<Wishlist />} />

              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
