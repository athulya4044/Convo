import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  ArrowRight,
  CircleCheck,
  X,
  CircleAlert,
  Eye,
  EyeOff,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [updatePassword, setUpdatePassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const token = new URLSearchParams(location.search).get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      let res = await axios.post(
        `http://localhost:4000/api/users/reset-password`,
        { token, password }
      );
      // error handling
      if (res.data.error) {
        setError(res.data.error);
        return;
      }
      setMessage(res.data.message);
      setUpdatePassword(true);
    } catch (err) {
      console.error("Error during password reset:", err);
      setError(err.response?.data?.error || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full flex items-center justify-center p-4">
      <Card className="w-full md:max-w-[60vw]">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold my-2">
            Reset Your <span className="text-primary">Password</span>
          </CardTitle>
          <CardDescription className="my-2">
            Enter your new password to reset your account
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
            <AlertDescription>
              Invalid Password Reset Link. Please check the URL and try again
            </AlertDescription>
          </Alert>
        )}
        <CardContent className="flex flex-col gap-8">
          <div className="flex-1">
            {!updatePassword && (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your new password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your new password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full flex items-center justify-center gap-1"
                >
                  {loading ? "Resetting..." : "Reset Password"}
                  {!loading && <ArrowRight strokeWidth={1} />}
                </Button>
              </form>
            )}
            {updatePassword && (
              <Button
                className="w-full flex items-center justify-center gap-1"
                onClick={() => navigate("/auth")}
              >
                Go To Login
                <ArrowRight strokeWidth={1} />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
