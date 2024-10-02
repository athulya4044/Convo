import { Routes, Route } from "react-router-dom";
import Home from "./pages/index";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Auth from "./pages/auth";
import ForgotPassword from "./pages/forgotPassword";

const App = () => {
  return (
    <>
      <Header />
      <main className="my-6 w-[100vw] min-h-[70vh] h-auto flex justify-center items-center">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
};

export default App;
