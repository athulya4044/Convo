import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { auth } from "@/assets/images";
import { Link } from "react-router-dom";
import axios from "axios"; 

function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); 

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.post("http://localhost:4000/api/users/login", {
        email,
        password,
      });
      navigate("/"); 
    } catch (err) {
      console.error("Error during login:", err);
      setError("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      await axios.post("http://localhost:4000/api/users/register", {
        name,
        email,
        password,
      });
      navigate("/"); 
    } catch (err) {
      console.error("Error during signup:", err);
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full flex items-center justify-center p-4">
      <Card className="w-full md:max-w-[60vw]">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold my-2">
            Welcome to <span className="text-primary">Convo</span>!
          </CardTitle>
          <CardDescription className="my-2">
            Sign in to your account or create a new one
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col-reverse lg:flex-row gap-8">
          <div className="flex-1">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                {error && <p className="text-red-500">{error}</p>}
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full flex items-center justify-center gap-1"
                    disabled={loading}
                  >
                    {loading ? "Logging in..." : "Login"}
                    <ArrowRight strokeWidth={1} />
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                {error && <p className="text-red-500">{error}</p>}
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="m@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? "Signing up..." : "Create Account"}
                    <ArrowRight strokeWidth={1} />
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <img className="w-full" src={auth} alt="image of authentication" />
          </div>
        </CardContent>
        <CardFooter>
          <CardDescription className="w-full text-center">
            Forgot password ? No worries,{" "}
            <Link
              to={"/forgot-password"}
              className="cursor-pointer underline text-primary"
            >
              click here
            </Link>
          </CardDescription>
        </CardFooter>
      </Card>
    </section>
  );
}

export default Auth;
