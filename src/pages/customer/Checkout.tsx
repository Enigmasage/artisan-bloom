import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import {
  MapPin,
  Truck,
  Store,
  CreditCard,
  Banknote,
  Smartphone,
  Package,
  ShieldCheck,
} from "lucide-react";

const Checkout = () => {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();

  const [deliveryMethod, setDeliveryMethod] = useState<"self_pickup" | "seller_delivery">("seller_delivery");
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "cash">("upi");
  const [openBoxDelivery, setOpenBoxDelivery] = useState(false);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  if (items.length === 0) {
    navigate("/customer/cart");
    return null;
  }

  const deliveryCharge = deliveryMethod === "seller_delivery" ? 50 : 0;
  const finalTotal = totalPrice + deliveryCharge;

  const handlePlaceOrder = () => {
    setIsProcessing(true);
    
    // Simulate order processing
    setTimeout(() => {
      clearCart();
      navigate("/order/success", {
        state: {
          orderId: `ORD${Date.now().toString().slice(-6)}`,
          totalAmount: finalTotal,
          deliveryMethod,
          paymentMethod,
        },
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-display font-bold text-foreground mb-8">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Method */}
            <Card className="heritage-card">
              <CardHeader>
                <CardTitle className="text-lg font-display flex items-center gap-2">
                  <Truck className="h-5 w-5 text-primary" />
                  Delivery Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={deliveryMethod}
                  onValueChange={(val) => setDeliveryMethod(val as "self_pickup" | "seller_delivery")}
                  className="space-y-4"
                >
                  <div className="flex items-start space-x-3 p-4 rounded-lg border border-border hover:border-primary transition-colors cursor-pointer">
                    <RadioGroupItem value="seller_delivery" id="seller_delivery" className="mt-1" />
                    <Label htmlFor="seller_delivery" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2 font-medium">
                        <Truck className="h-4 w-4" />
                        Seller Delivery
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Product will be delivered to your address by the artisan. Delivery charge: ₹50
                      </p>
                    </Label>
                  </div>

                  <div className="flex items-start space-x-3 p-4 rounded-lg border border-border hover:border-primary transition-colors cursor-pointer">
                    <RadioGroupItem value="self_pickup" id="self_pickup" className="mt-1" />
                    <Label htmlFor="self_pickup" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2 font-medium">
                        <Store className="h-4 w-4" />
                        Self Pickup
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Collect your order directly from Banasthali Vidyapith campus. Free of charge!
                      </p>
                    </Label>
                  </div>
                </RadioGroup>

                {deliveryMethod === "seller_delivery" && (
                  <div className="mt-6 space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="openbox"
                        checked={openBoxDelivery}
                        onCheckedChange={(checked) => setOpenBoxDelivery(checked as boolean)}
                      />
                      <Label htmlFor="openbox" className="flex items-center gap-2 cursor-pointer">
                        <Package className="h-4 w-4 text-accent" />
                        Open Box Delivery
                        <span className="text-xs text-muted-foreground">(Inspect before accepting)</span>
                      </Label>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address" className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Delivery Address
                      </Label>
                      <Textarea
                        id="address"
                        placeholder="Enter your complete address including city, state and PIN code"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card className="heritage-card">
              <CardHeader>
                <CardTitle className="text-lg font-display flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={(val) => setPaymentMethod(val as "upi" | "cash")}
                  className="space-y-4"
                >
                  <div className="flex items-start space-x-3 p-4 rounded-lg border border-border hover:border-primary transition-colors cursor-pointer">
                    <RadioGroupItem value="upi" id="upi" className="mt-1" />
                    <Label htmlFor="upi" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2 font-medium">
                        <Smartphone className="h-4 w-4" />
                        UPI Payment
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Pay using Google Pay, PhonePe, Paytm or any UPI app
                      </p>
                    </Label>
                  </div>

                  <div className="flex items-start space-x-3 p-4 rounded-lg border border-border hover:border-primary transition-colors cursor-pointer">
                    <RadioGroupItem value="cash" id="cash" className="mt-1" />
                    <Label htmlFor="cash" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2 font-medium">
                        <Banknote className="h-4 w-4" />
                        Cash on {deliveryMethod === "self_pickup" ? "Pickup" : "Delivery"}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Pay with cash when you {deliveryMethod === "self_pickup" ? "collect your order" : "receive your delivery"}
                      </p>
                    </Label>
                  </div>
                </RadioGroup>

                {paymentMethod === "upi" && (
                  <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border">
                    <div className="flex items-center gap-2 text-sm font-medium mb-2">
                      <ShieldCheck className="h-4 w-4 text-green-600" />
                      Secure UPI Payment
                    </div>
                    <p className="text-sm text-muted-foreground">
                      You will receive a UPI payment request after placing the order. 
                      Complete the payment within 24 hours to confirm your order.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <Card className="heritage-card sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg font-display">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items */}
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex gap-3">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{item.product.name}</h4>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                        <p className="text-sm font-medium text-primary">
                          ₹{(item.product.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Pricing */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery</span>
                    <span>{deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-display font-bold text-lg">
                    <span>Total</span>
                    <span className="text-primary">₹{finalTotal.toLocaleString()}</span>
                  </div>
                </div>

                <Button
                  variant="hero"
                  className="w-full"
                  onClick={handlePlaceOrder}
                  disabled={isProcessing || (deliveryMethod === "seller_delivery" && !address)}
                >
                  {isProcessing ? "Processing..." : "Place Order"}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  By placing this order, you agree to our Terms of Service and support local artisans.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;