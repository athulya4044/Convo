import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import Home from "./pages/index";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Auth from "./pages/auth";
import ForgotPassword from "./pages/forgotPassword";
import ResetPassword from "./pages/resetPassword";
import { AppContext } from "./utils/store/appContext";
import Dashboard from "./pages/dashboard";
import "./App.css";
import { Toaster } from "./components/ui/toaster";
import Tutorial from "./pages/tutorial";

const App = () => {
  const { isLoggedIn } = useContext(AppContext);

  return (
    <>
      {isLoggedIn ? (
        // Show only the Dashboard without Header and Footer when logged in
        <Routes>
          <Route path="/learning-hub" element={<Tutorial />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<Navigate replace to="/dashboard" />} />
        </Routes>
      ) : (
        // Show Header, Footer, and other routes for non-logged-in views
        <>
          <Header />
          <main className="my-6 w-[100vw] min-h-[70vh] h-auto flex justify-center items-center">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route
                path="/reset-password/:token"
                element={<ResetPassword />}
              />
              <Route path="*" element={<Navigate replace to="/auth" />} />
            </Routes>
          </main>
          <Toaster />
          <Footer />
        </>
      )}
    </>
  );
};

export default App;
