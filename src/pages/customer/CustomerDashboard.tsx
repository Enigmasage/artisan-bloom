import React from "react";
import { Link } from "react-router-dom";
import { User, Package, Heart, ShoppingCart, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

const CustomerDashboard = () => {
  const { user, logout } = useAuth();
  const { totalItems, wishlist } = useCart();

  const menuItems = [
    { icon: Package, label: "My Orders", path: "/customer/orders", count: 3 },
    { icon: Heart, label: "Wishlist", path: "/customer/wishlist", count: wishlist.length },
    { icon: ShoppingCart, label: "Cart", path: "/customer/cart", count: totalItems },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="container">
          <div className="bg-heritage-maroon text-heritage-cream rounded-2xl p-8 mb-8">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-heritage-gold/20 flex items-center justify-center">
                <User className="h-8 w-8 text-heritage-gold" />
              </div>
              <div>
                <h1 className="font-heading text-2xl font-bold">Welcome, {user?.name}!</h1>
                <p className="text-heritage-cream/80">{user?.email}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3 mb-8">
            {menuItems.map((item) => (
              <Link key={item.path} to={item.path} className="heritage-card p-6 flex items-center gap-4 hover:border-primary transition-colors">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{item.label}</h3>
                  <p className="text-sm text-muted-foreground">{item.count} items</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="flex gap-4">
            <Link to="/products"><Button variant="heritage">Continue Shopping</Button></Link>
            <Button variant="outline" onClick={logout} className="gap-2"><LogOut className="h-4 w-4" />Logout</Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CustomerDashboard;
