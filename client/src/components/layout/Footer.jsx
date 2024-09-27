import { Facebook, Twitter, Github } from 'lucide-react'; // Example icons

const Footer = () => {
  return (
    <footer className="bg-primary text-gray-300">
      <div className="container mx-auto py-8 px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-bold text-white">About Convo</h3>
            <p className="mt-4 text-gray-400">
              Convo is a collaborative learning platform that brings students together.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-white">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="/features" className="hover:text-white">Features</a></li>
              <li><a href="/pricing" className="hover:text-white">Pricing</a></li>
              <li><a href="/about" className="hover:text-white">About Us</a></li>
              <li><a href="/contact" className="hover:text-white">Contact</a></li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-bold text-white">Follow Us</h3>
            <div className="mt-4 flex space-x-4">
              <a href="https://facebook.com" aria-label="Facebook">
                <Facebook className="w-6 h-6 text-gray-300 hover:text-white" />
              </a>
              <a href="https://twitter.com" aria-label="Twitter">
                <Twitter className="w-6 h-6 text-gray-300 hover:text-white" />
              </a>
              <a href="https://github.com" aria-label="Github">
                <Github className="w-6 h-6 text-gray-300 hover:text-white" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-gray-700 pt-4 text-center">
          <p>&copy; 2024 Convo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
