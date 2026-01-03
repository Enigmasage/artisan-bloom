import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import OrderStatusBadge from "@/components/common/OrderStatusBadge";
import PaymentStatusBadge from "@/components/common/PaymentStatusBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, Eye, Truck, Package, CheckCircle } from "lucide-react";
import { mockOrders, Order, getOrdersBySeller } from "@/data/orders";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const SellerOrders = () => {
  const [orders, setOrders] = useState<Order[]>(() =>
    getOrdersBySeller(mockOrders, "seller1")
  );
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { toast } = useToast();

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const updateOrderStatus = (orderId: string, newStatus: Order["status"]) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId
          ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
          : order
      )
    );
    toast({
      title: "Order Updated",
      description: `Order ${orderId} status changed to ${newStatus}`,
    });
  };

  const getStatusActions = (order: Order) => {
    switch (order.status) {
      case "pending":
        return (
          <Button
            size="sm"
            onClick={() => updateOrderStatus(order.id, "confirmed")}
            className="gap-1"
          >
            <Package className="h-3 w-3" />
            Confirm
          </Button>
        );
      case "confirmed":
        return (
          <Button
            size="sm"
            onClick={() => updateOrderStatus(order.id, "dispatched")}
            className="gap-1"
          >
            <Truck className="h-3 w-3" />
            Dispatch
          </Button>
        );
      case "dispatched":
        return (
          <Button
            size="sm"
            onClick={() => updateOrderStatus(order.id, "delivered")}
            className="gap-1"
          >
            <CheckCircle className="h-3 w-3" />
            Mark Delivered
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-foreground">
            Orders Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Track and manage your customer orders
          </p>
        </div>

        {/* Filters */}
        <Card className="heritage-card mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by order ID or customer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="dispatched">Dispatched</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card className="heritage-card">
          <CardHeader>
            <CardTitle className="text-lg font-display">
              All Orders ({filteredOrders.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.customerName}</div>
                        <div className="text-sm text-muted-foreground">
                          {order.customerEmail}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <img
                          src={order.products[0].image}
                          alt=""
                          className="w-10 h-10 rounded object-cover"
                        />
                        <span className="text-sm">
                          {order.products.length} item(s)
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      ₹{order.totalAmount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <OrderStatusBadge status={order.status} />
                    </TableCell>
                    <TableCell>
                      <PaymentStatusBadge status={order.paymentStatus} />
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {getStatusActions(order)}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Order Detail Dialog */}
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="font-display">
                Order Details - {selectedOrder?.id}
              </DialogTitle>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Customer Info</h4>
                    <p>{selectedOrder.customerName}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedOrder.customerEmail}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Delivery Details</h4>
                    <Badge variant="outline" className="mb-2">
                      {selectedOrder.deliveryMethod === "self_pickup"
                        ? "Self Pickup"
                        : "Seller Delivery"}
                    </Badge>
                    {selectedOrder.openBoxDelivery && (
                      <Badge variant="outline" className="ml-2 bg-blue-50">
                        Open Box Delivery
                      </Badge>
                    )}
                    {selectedOrder.shippingAddress && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {selectedOrder.shippingAddress}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Products</h4>
                  <div className="space-y-2">
                    {selectedOrder.products.map((product) => (
                      <div
                        key={product.productId}
                        className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg"
                      >
                        <img
                          src={product.image}
                          alt={product.productName}
                          className="w-16 h-16 rounded object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-medium">{product.productName}</p>
                          <p className="text-sm text-muted-foreground">
                            Qty: {product.quantity} × ₹{product.price}
                          </p>
                        </div>
                        <p className="font-medium">
                          ₹{(product.quantity * product.price).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="flex gap-4">
                    <OrderStatusBadge status={selectedOrder.status} />
                    <PaymentStatusBadge status={selectedOrder.paymentStatus} />
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Total Amount</p>
                    <p className="text-2xl font-bold font-display">
                      ₹{selectedOrder.totalAmount.toLocaleString()}
                    </p>
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

export default SellerOrders;
