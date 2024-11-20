/* eslint-disable react/prop-types */
import { useContext, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, X } from "lucide-react";
import axios from "axios";
import { AppContext } from "@/utils/store/appContext";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_API_KEY);

export default function Payment({ isOpen, setIsOpen, setShowSuccessModal }) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="h-[95vh] overflow-y-auto sm:max-w-[425px] md:max-w-[700px] lg:max-w-[75vw]">
        <Button
          onClick={setIsOpen}
          variant="ghost"
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 hover:bg-transparent focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
        <DialogHeader>
          <DialogTitle className="text-center text-3xl font-bold text-gray-900">
            Upgrade to Convo Premium
          </DialogTitle>
          <DialogDescription className="text-center">
            Choose your plan and enjoy premium features
          </DialogDescription>
        </DialogHeader>
        <ConvoPaymentPage
          setIsOpen={setIsOpen}
          setShowSuccessModal={setShowSuccessModal}
        />
      </DialogContent>
    </Dialog>
  );
}

const ConvoPaymentPage = ({ setIsOpen, setShowSuccessModal }) => {
  const [selectedPlan, setSelectedPlan] = useState("monthly");

  return (
    <div className="w-full container mx-auto px-6 py-4">
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <SubscriptionCard
          title="Monthly Plan"
          price="$9.99"
          description="Billed monthly"
          isSelected={selectedPlan === "monthly"}
          onClick={() => setSelectedPlan("monthly")}
          isPopular
        />
        <SubscriptionCard
          title="Annual Plan"
          price="$6.99"
          description="per month, billed annually"
          isSelected={selectedPlan === "annual"}
          onClick={() => setSelectedPlan("annual")}
          isBestValue
        />
      </div>

      <Elements stripe={stripePromise}>
        <CheckoutForm
          selectedPlan={selectedPlan}
          setIsOpen={setIsOpen}
          setShowSuccessModal={setShowSuccessModal}
        />
      </Elements>
    </div>
  );
};

const SubscriptionCard = ({
  title,
  price,
  description,
  isSelected,
  onClick,
  isBestValue,
  isPopular,
}) => (
  <Card
    className={`cursor-pointer transition-all ${
      isSelected ? "ring-2 ring-primary" : "hover:shadow-lg"
    }`}
    onClick={onClick}
  >
    <CardHeader>
      <CardTitle className="flex justify-between items-center">
        {title}
        {isBestValue && (
          <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">
            Best Value
          </span>
        )}
        {isPopular && (
          <span className="bg-secondary text-primary text-xs font-semibold px-2.5 py-0.5 rounded">
            Popular
          </span>
        )}
      </CardTitle>
      <CardDescription>
        <span className="text-2xl font-bold">{price}</span> {description}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <ul className="list-disc list-inside">
        <li>Video Calling</li>
        <li>Unlimited group chats</li>
        <li>Advanced AI assistant</li>
        <li>Priority support</li>
      </ul>
    </CardContent>
    <CardFooter>
      <Button variant={isSelected ? "default" : "outline"} className="w-full">
        {isSelected ? "Selected" : "Select Plan"}
      </Button>
    </CardFooter>
  </Card>
);

const CheckoutForm = ({ selectedPlan, setIsOpen, setShowSuccessModal }) => {
  const _ctx = useContext(AppContext);
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);

    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
      billing_details: {
        name,
        email,
      },
    });

    if (error) {
      setLoading(false);
      toast({
        title: "Payment failed",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    try {
      // Send payment method and other details to your server
      const response = await axios.post(
        "http://localhost:4000/api/users/payment",
        {
          paymentMethodId: paymentMethod.id,
          email,
          plan: selectedPlan,
        }
      );

      if (response.data.success) {
        console.log("success");

        _ctx.login({
          email: _ctx.email,
          streamToken: _ctx.streamToken,
          userType: "premium",
        });
        setLoading(false);
        setIsOpen();
        setShowSuccessModal();
      }
    } catch (serverError) {
      console.error("Server error:", serverError);
      setLoading(false);
      setIsOpen();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="John Doe"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="john@example.com"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="card-element">Credit or debit card</Label>
        <div className="p-3 border rounded-md">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#424770",
                  "::placeholder": {
                    color: "#aab7c4",
                  },
                },
                invalid: {
                  color: "#9e2146",
                },
              },
            }}
          />
        </div>
      </div>
      <Button type="submit" disabled={!stripe || loading} className="w-full">
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          `Pay ${selectedPlan === "monthly" ? "$9.99" : "$83.88"} and Upgrade`
        )}
      </Button>
    </form>
  );
};
