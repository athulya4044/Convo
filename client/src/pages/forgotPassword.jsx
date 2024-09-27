import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowRight } from "lucide-react";
import { forgotPass } from "@/assets/images";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const handleSubmit = () => {};

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
                />
              </div>
              <Button
                type="submit"
                className="w-full flex items-center justify-center gap-1"
                onClick={handleSubmit}
              >
                Send Reset Link
                <ArrowRight strokeWidth={1} />
              </Button>
            </form>
          </div>
        </CardContent>
        <CardFooter>
          <CardDescription className="w-full text-center">
            Remembered your password ?{" "}
            <Link to="/auth" className="cursor-pointer underline text-primary">
              Back to login
            </Link>
          </CardDescription>
        </CardFooter>
      </Card>
    </section>
  );
}
