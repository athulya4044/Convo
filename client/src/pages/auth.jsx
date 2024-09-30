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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowRight, CircleAlert, CircleCheck, X } from "lucide-react";
import { auth } from "@/assets/images";
import { Link } from "react-router-dom";
import axios from "axios";

function Auth() {
  // converting on form state obj to simplify state management
  const [formState, setFormState] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  // reset UI on tab change, had a bug when an error; persisted even on tab change
  const resetAuthUi = () => {
    setLoading("");
    setError("");
    setFormState({
      email: "",
      password: "",
      name: "",
      confirmPassword: "",
    });
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.post("http://localhost:4000/api/users/login", {
        email: formState.email,
        password: formState.password,
      });

      // go to dashboard
      navigate("/");
    } catch (err) {
      console.error("Error during login:", err);
      setError("Login failed. Please check your credentials !");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formState.password !== formState.confirmPassword) {
      setError("Passwords do not match !");
      setLoading(false);
      return;
    }

    try {
      let res = await axios.post("http://localhost:4000/api/users/register", {
        name: formState.name,
        email: formState.email,
        password: formState.password,
      });

      // same email signup error handling
      if (res.data.error) {
        setError(res.data.error);
        return;
      }

      resetAuthUi();
      setMessage(res.data.message);
    } catch (err) {
      console.error("Error during signup:", err);
      setError("Registration failed. Please try again !");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full flex items-center justify-center p-4">
      <Card className="w-full md:max-w-[60vw]">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold my-2">
            Welcome to <span className="text-primary">Convo</span> !
          </CardTitle>
          <CardDescription className="my-2">
            Sign in to your account or create a new one
          </CardDescription>
        </CardHeader>
        {message && (
          // dismissable alert
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
        <CardContent className="flex flex-col-reverse lg:flex-row gap-8">
          <div className="flex-1">
            <Tabs
              defaultValue="login"
              className="w-full"
              onValueChange={resetAuthUi}
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                {error && (
                  <Alert
                    className="my-5 flex-col justify-center items-center"
                    variant="destructive"
                  >
                    <div className="mb-2 flex justify-start items-center gap-2">
                      <CircleAlert size={16} color="#ef4444" />
                      <AlertTitle>Error</AlertTitle>
                    </div>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      value={formState.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formState.password}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full flex items-center justify-center gap-1"
                    disabled={loading}
                  >
                    {loading ? "Logging in..." : "Login"}
                    {!loading && <ArrowRight strokeWidth={1} />}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                {error && (
                  <Alert
                    className="my-5 flex-col justify-center items-center"
                    variant="destructive"
                  >
                    <div className="mb-2 flex justify-start items-center gap-2">
                      <CircleAlert size={16} color="#ef4444" />
                      <AlertTitle>Error</AlertTitle>
                    </div>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={formState.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      value={formState.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formState.password}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formState.confirmPassword}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Signing up..." : "Create Account"}
                    {!loading && <ArrowRight strokeWidth={1} />}
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
            Forgot password? No worries,{" "}
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
