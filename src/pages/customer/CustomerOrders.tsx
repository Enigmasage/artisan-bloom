import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrderStatusBadge from "@/components/common/OrderStatusBadge";
import PaymentStatusBadge from "@/components/common/PaymentStatusBadge";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Store,
  ArrowLeft,
  Eye,
  XCircle,
} from "lucide-react";
import { mockOrders, Order } from "@/data/orders";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const CustomerOrders = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  // Filter orders for current customer (mock: show all for demo)
  const customerOrders = mockOrders;

  const filteredOrders = activeTab === "all" 
    ? customerOrders 
    : customerOrders.filter(order => order.status === activeTab);

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "confirmed":
        return <Package className="h-4 w-4" />;
      case "dispatched":
        return <Truck className="h-4 w-4" />;
      case "delivered":
        return <CheckCircle2 className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getProgressWidth = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "25%";
      case "confirmed":
        return "50%";
      case "dispatched":
        return "75%";
      case "delivered":
        return "100%";
      default:
        return "0%";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/customer/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">
              My Orders
            </h1>
            <p className="text-muted-foreground">Track and manage your orders</p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="dispatched">In Transit</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <Card className="heritage-card">
            <CardContent className="py-12 text-center">
              <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-display font-semibold mb-2">No orders found</h3>
              <p className="text-muted-foreground mb-6">
                {activeTab === "all" 
                  ? "You haven't placed any orders yet." 
                  : `No ${activeTab} orders found.`}
              </p>
              <Link to="/products">
                <Button variant="heritage">Start Shopping</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="heritage-card">
                <CardContent className="pt-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Order Info */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-display font-semibold text-lg">
                            Order #{order.id}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <OrderStatusBadge status={order.status} />
                          <PaymentStatusBadge status={order.paymentStatus} />
                        </div>
                      </div>

                      {/* Products */}
                      <div className="flex gap-3 mb-4 overflow-x-auto">
                        {order.products.map((product, idx) => (
                          <div key={idx} className="flex-shrink-0">
                            <img
                              src={product.image}
                              alt={product.productName}
                              className="w-20 h-20 rounded-lg object-cover border border-border"
                            />
                          </div>
                        ))}
                        <div className="flex flex-col justify-center">
                          <p className="text-sm font-medium">
                            {order.products.length} item{order.products.length > 1 ? "s" : ""}
                          </p>
                          <p className="text-lg font-display font-bold text-primary">
                            ₹{order.totalAmount.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      {order.status !== "cancelled" && (
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Pending
                            </span>
                            <span className="flex items-center gap-1">
                              <Package className="h-3 w-3" />
                              Confirmed
                            </span>
                            <span className="flex items-center gap-1">
                              <Truck className="h-3 w-3" />
                              Dispatched
                            </span>
                            <span className="flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              Delivered
                            </span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                              style={{ width: getProgressWidth(order.status) }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Delivery Info */}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {order.deliveryMethod === "self_pickup" ? (
                          <span className="flex items-center gap-1">
                            <Store className="h-4 w-4" />
                            Self Pickup
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {order.shippingAddress?.split(",")[0] || "Home Delivery"}
                          </span>
                        )}
                        {order.openBoxDelivery && (
                          <Badge variant="outline" className="text-xs">
                            Open Box Delivery
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex lg:flex-col gap-2 lg:justify-start">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <Eye className="h-4 w-4" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Order Detail Dialog */}
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-display">
                Order #{selectedOrder?.id}
              </DialogTitle>
            </DialogHeader>

            {selectedOrder && (
              <div className="space-y-6">
                {/* Status */}
                <div className="flex gap-2">
                  <OrderStatusBadge status={selectedOrder.status} />
                  <PaymentStatusBadge status={selectedOrder.paymentStatus} />
                </div>

                {/* Products */}
                <div>
                  <h4 className="font-semibold mb-3">Products</h4>
                  <div className="space-y-3">
                    {selectedOrder.products.map((product, idx) => (
                      <div key={idx} className="flex gap-4 p-3 rounded-lg bg-muted/50">
                        <img
                          src={product.image}
                          alt={product.productName}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h5 className="font-medium">{product.productName}</h5>
                          <p className="text-sm text-muted-foreground">
                            Qty: {product.quantity} × ₹{product.price.toLocaleString()}
                          </p>
                        </div>
                        <div className="font-medium">
                          ₹{(product.quantity * product.price).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Details */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Seller</p>
                    <p className="font-medium">{selectedOrder.sellerName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Payment Method</p>
                    <p className="font-medium capitalize">{selectedOrder.paymentMethod}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Delivery Method</p>
                    <p className="font-medium">
                      {selectedOrder.deliveryMethod === "self_pickup"
                        ? "Self Pickup"
                        : "Seller Delivery"}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Order Date</p>
                    <p className="font-medium">
                      {new Date(selectedOrder.createdAt).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                </div>

                {/* Delivery Details for Seller Delivery */}
                {selectedOrder.deliveryMethod === "seller_delivery" && (
                  <div className="p-4 rounded-lg bg-muted/50 border border-border space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      Delivery Details
                    </h4>
                    {selectedOrder.shippingAddress && (
                      <div>
                        <p className="text-sm text-muted-foreground">Address</p>
                        <p className="font-medium">{selectedOrder.shippingAddress}</p>
                      </div>
                    )}
                    {selectedOrder.customerPhone && (
                      <div>
                        <p className="text-sm text-muted-foreground">Phone Number</p>
                        <p className="font-medium">{selectedOrder.customerPhone}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Total */}
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-display">Total Amount</span>
                    <span className="text-2xl font-display font-bold text-primary">
                      ₹{selectedOrder.totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>

      <Footer />
    </div>
  );
};

export default CustomerOrders;