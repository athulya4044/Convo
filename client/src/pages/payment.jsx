/* eslint-disable react/prop-types */
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
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
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_API_KEY);

const ConvoPaymentPage = () => {
  const [selectedPlan, setSelectedPlan] = useState("monthly");

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <header className="text-center mb-8">
        <img
          src="/placeholder.svg?height=50&width=50"
          alt="Convo Logo"
          className="mx-auto mb-4"
        />
        <h1 className="text-3xl font-bold text-gray-900">
          Upgrade to Convo Premium
        </h1>
      </header>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <SubscriptionCard
          title="Monthly Plan"
          price="$9.99"
          description="Billed monthly"
          isSelected={selectedPlan === "monthly"}
          onClick={() => setSelectedPlan("monthly")}
        />
        <SubscriptionCard
          title="Annual Plan"
          price="$5.99"
          description="per month, billed annually"
          isSelected={selectedPlan === "annual"}
          onClick={() => setSelectedPlan("annual")}
          isBestValue
        />
      </div>

      <Elements stripe={stripePromise}>
        <CheckoutForm selectedPlan={selectedPlan} />
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
      </CardTitle>
      <CardDescription>
        <span className="text-2xl font-bold">{price}</span> {description}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <ul className="list-disc list-inside">
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

const CheckoutForm = ({ selectedPlan }) => {
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

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
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
    } else {
      // Here you would typically send the paymentMethod.id to your server
      console.log("PaymentMethod:", paymentMethod);

      // Simulating a server response
      setTimeout(() => {
        setLoading(false);
        toast({
          title: "Payment successful",
          description: `You've been upgraded to Convo Premium (${selectedPlan} plan)!`,
        });
      }, 2000);
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
          `Pay ${selectedPlan === "monthly" ? "$9.99" : "$71.88"} and Upgrade`
        )}
      </Button>
    </form>
  );
};

export default ConvoPaymentPage;
