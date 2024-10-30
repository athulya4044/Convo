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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { forgotPass } from "@/assets/images";
import { Link } from "react-router-dom";
import axios from "axios";
import { PhoneInput } from "@/components/ui/phone-input";
import { isValidPhoneNumber } from "react-phone-number-input";
import OTP from "@/components/OTP";

export default function ForgotPassword() {
  const [otpPage, setOtpPage] = useState(false);
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Reset form on tab change
  const resetForm = () => {
    setEmail("");
    setPhoneNumber("");
    setError("");
    setMessage("");
    setOtpPage(false);
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.get(
        `http://localhost:4000/api/users/forgot-password/${email}`
      );

      if (res.data.error) {
        setError(res.data.error);
        return;
      }
      setMessage(res.data.message);
    } catch (err) {
      console.error("Error during email reset:", err);
      setError("Unable to send reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!isValidPhoneNumber(phoneNumber)) {
      setError("Invalid phone number. Please enter a valid phone number.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(`http://localhost:4000/api/users/send-otp`, {
        phoneNumber,
      });

      if (res.data.error) {
        setError(res.data.error);
        return;
      }
      setMessage(res.data.message);
      setOtpPage(true);
    } catch (err) {
      console.error("Error during phone reset:", err);
      setError("Unable to send reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full flex items-center justify-center p-4">
      <Card className="w-full md:max-w-[60vw]">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold my-2">
            {!otpPage && (
              <>
                Forgot Your <span className="text-primary">Password</span>?
              </>
            )}
            {otpPage && (
              <>
                Enter <span className="text-primary">OTP</span>
              </>
            )}
          </CardTitle>
          <CardDescription className="my-2">
            {otpPage
              ? "We've sent a 6-digit code to your phone. Please enter it below."
              : "Choose an option to reset your password"}
          </CardDescription>
        </CardHeader>
        {message && (
          <Alert className="mx-auto w-[95%] my-5 flex-col justify-center items-center bg-green-50 text-green-500">
            <div className="flex justify-between items-start">
              <div className="mb-2 flex justify-start items-center gap-2">
                <CircleCheck size={16} color="#22c55e" />
                <AlertTitle>Success</AlertTitle>
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
              <AlertTitle>Error</AlertTitle>
            </div>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {otpPage && (
          <OTP
            phoneNumber={phoneNumber}
            setError={setError}
            setLoading={setLoading}
            cancelAction={resetForm}
          />
        )}
        {!otpPage && (
          <>
            <CardContent className="flex flex-col gap-8">
              <div className="flex-1 flex items-center justify-center">
                <img
                  src={forgotPass}
                  className="w-full md:max-w-[20vw]"
                  alt="forgot password"
                />
              </div>
              <div className="flex-1">
                <Tabs
                  defaultValue="email"
                  className="w-full"
                  onValueChange={resetForm}
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="email">Reset via Email</TabsTrigger>
                    <TabsTrigger value="phone">Reset via Phone</TabsTrigger>
                  </TabsList>

                  <TabsContent value="email">
                    <form onSubmit={handleEmailSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Your Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="m@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full flex items-center justify-center gap-1"
                        disabled={loading}
                      >
                        {loading ? "Sending..." : "Send Reset Link"}
                        {!loading && <ArrowRight strokeWidth={1} />}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="phone">
                    <form onSubmit={handlePhoneSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="phoneNumber">Your Phone Number</Label>
                        <PhoneInput
                          id="phoneNumber"
                          placeholder="+X XXX-XXX-XXXX"
                          value={phoneNumber}
                          onChange={(value) => setPhoneNumber(value)}
                          required
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full flex items-center justify-center gap-1"
                        disabled={loading}
                      >
                        {loading ? "Sending..." : "Send OTP"}
                        {!loading && <ArrowRight strokeWidth={1} />}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </div>
            </CardContent>
            <CardFooter>
              <CardDescription className="w-full text-center">
                Remember your password?{" "}
                <Link
                  to="/auth"
                  className="cursor-pointer underline text-primary"
                >
                  Back to login
                </Link>
              </CardDescription>
            </CardFooter>
          </>
        )}
      </Card>
    </section>
  );
}
