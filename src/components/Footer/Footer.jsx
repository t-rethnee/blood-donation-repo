import { Facebook, Twitter, Instagram, Linkedin, Heart } from "lucide-react";
import { Link } from "react-router";

const Footer = () => {
  return (
    <footer className="bg-red-900 text-gray-200 py-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* About */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Heart className="h-8 w-8 text-red-400" />
            <span className="text-2xl font-bold text-red-300">RedAid</span>
          </div>
          <p className="text-gray-300 leading-relaxed">
            RedAid is dedicated to saving lives by connecting blood donors and recipients across Bangladesh. Together, we make a difference!
          </p>
        </div>

        {/* Useful Links */}
        <div>
          <h3 className="text-red-400 font-semibold text-xl mb-4">Useful Links</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="hover:text-red-300 transition-colors duration-200">Home</Link>
            </li>
            <li>
              <Link to="/donation-requests" className="hover:text-red-300 transition-colors duration-200">Donation Requests</Link>
            </li>
            <li>
              <Link to="/blogs" className="hover:text-red-300 transition-colors duration-200">Blog</Link>
            </li>
            <li>
              <Link to="/funding" className="hover:text-red-300 transition-colors duration-200">Funding</Link>
            </li>
            
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-red-400 font-semibold text-xl mb-4">Contact Us</h3>
          <ul className="space-y-3 text-gray-300">
            <li>Phone: +880 1234 567 890</li>
            <li>Email: support@redaid.com</li>
            <li>Address: 123 RedAid St, Dhaka, Bangladesh</li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-red-400 font-semibold text-xl mb-4">Follow Us</h3>
          <div className="flex space-x-6 text-gray-300">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-red-300 transition-colors duration-200"
              aria-label="Facebook"
            >
              <Facebook className="h-6 w-6" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-red-300 transition-colors duration-200"
              aria-label="Twitter"
            >
              <Twitter className="h-6 w-6" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-red-300 transition-colors duration-200"
              aria-label="Instagram"
            >
              <Instagram className="h-6 w-6" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-red-300 transition-colors duration-200"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-12 border-t border-red-700 pt-6 text-center text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} RedAid. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
