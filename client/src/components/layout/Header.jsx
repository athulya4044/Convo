import { useState } from "react";
import { Button } from "../ui/button";
import { Menu, X } from "lucide-react";
import { logoConvo } from "../../assets/images";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMobileMenu = () => setMobileMenuOpen(!isMobileMenuOpen);
  const goToAuth = () => navigate("/auth");

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between p-6">
        {/* logo */}
        <div className="text-2xl font-bold text-primary">
          <Link to={"/"} className="flex items-center justify-start gap-3">
            <img
              className="w-[50px] object-contain"
              src={logoConvo}
              alt="Convo logo"
            />
            CONVO
          </Link>
        </div>

        {/* desktop nav */}
        <div className="md:flex items-center justify-between gap-10">
          <nav className="hidden md:flex gap-10 text-primary">
            <Link
              to={"/"}
              className="border-transparent border-b-2 border-solid hover:border-primary hover:text-gray-900 ease-in-out duration-200"
            >
              Home
            </Link>
          </nav>
          <Button className="hidden md:block" onClick={goToAuth}>
            Get Started
          </Button>
        </div>

        {/* mobile nav */}
        <div className="md:hidden">
          <button onClick={toggleMobileMenu} aria-label="Toggle Menu">
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-900" />
            ) : (
              <Menu className="w-6 h-6 text-gray-900" />
            )}
          </button>
        </div>
      </div>

      <div
        className={`transform transition-all ease-in-out duration-300 md:hidden bg-white shadow-md ${
          isMobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <nav className="flex flex-col items-center space-y-4 py-4 text-gray-700">
          <hr className="w-full h-[1px] bg-gray-200 border-none" />

          <Link
            to={"/"}
            className="hover:text-gray-900 ease-in-out duration-200"
          >
            Home
          </Link>
          <Button onClick={goToAuth}>Get Started</Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
