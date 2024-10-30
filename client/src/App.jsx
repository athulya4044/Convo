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


const App = () => {
  const { isLoggedIn } = useContext(AppContext);
  return (
    <>
      <Header />
      <main className="my-6 w-[100vw] min-h-[70vh] h-auto flex justify-center items-center">
        <Routes>
          <Route path="/" element={<Home />} />
          {!isLoggedIn && <Route path="/auth" element={<Auth />} />}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          {isLoggedIn && <Route path="/dashboard" element={<Dashboard />} />}
          <Route path="*" element={<Navigate replace to={"/auth"} />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
};

export default App;
