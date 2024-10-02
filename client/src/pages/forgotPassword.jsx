import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowRight, CircleCheck, X, CircleAlert } from "lucide-react";
import { forgotPass } from "@/assets/images";
import { Link } from "react-router-dom";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      let res = await axios.get(
        `http://localhost:4000/api/users/forgot-password/${email}`
      );
      // error handling
      if (res.data.error) {
        setError(res.data.error);
        return;
      }
      setMessage(res.data.message);
    } catch (err) {
      console.error("Error during signup:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full flex items-center justify-center p-4">
      <Card className="w-full md:max-w-[60vw]">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold my-2">
            Forgot Your <span className="text-primary">Password</span> ?
          </CardTitle>
          <CardDescription className="my-2">
            Enter your email address and we&apos;ll send you a link to reset
            your password
          </CardDescription>
        </CardHeader>
        {message && (
          // dismissable alert
          <Alert className="mx-auto w-[95%] my-5 flex-col justify-center items-center bg-green-50 text-green-500">
            <div className="flex justify-between items-start">
              <div className="mb-2 flex justify-start items-center gap-2">
                <CircleCheck size={16} color="#22c55e" />
                <AlertTitle>Email Sent</AlertTitle>
              </div>
              <X
                className="cursor-pointer"
                size={16}
                color="#22c55e"
                onClick={() => setMessage("")}
              />
            </div>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
        {error && (
          <Alert
            className="mx-auto w-[95%] my-5 flex-col justify-center items-center"
            variant="destructive"
          >
            <div className="mb-2 flex justify-start items-center gap-2">
              <CircleAlert size={16} color="#ef4444" />
              <AlertTitle>Email Not Found</AlertTitle>
            </div>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <CardContent className="flex flex-col gap-8">
          <div className="flex-1 flex items-center justify-center">
            <img
              src={forgotPass}
              className="w-full md:max-w-[20vw]"
              alt="image of forgot password"
            />
          </div>
          <div className="flex-1">
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Your Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <Button
                type="submit"
                className="w-full flex items-center justify-center gap-1"
                onClick={handleSubmit}
              >
                {loading ? "Sending..." : "Send Reset Link"}
                {!loading && <ArrowRight strokeWidth={1} />}
              </Button>
            </form>
          </div>
        </CardContent>
        <CardFooter>
          <CardDescription className="w-full text-center">
            Have your Password?{" "}
            <Link to="/auth" className="cursor-pointer underline text-primary">
              Back to login
            </Link>
          </CardDescription>
        </CardFooter>
      </Card>
    </section>
  );
}
