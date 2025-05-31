import { FC, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import CollabFlowLogo from "../Icon/CollabFlowLogo";
import useScrollDirection from "../../hooks/useScrollDirection";
import { FiLogOut } from "react-icons/fi";


const Header: FC = () => {
  const scrollDirection = useScrollDirection();
  const [menuOpen, setMenuOpen] = useState(false);

  // Fecha o menu ao pressionar ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      {/* HEADER FIXO */}
      <header
        className={`fixed top-0 left-0 w-full z-50 bg-[#1E293B] shadow-md transition-transform duration-300 ${
          scrollDirection === "down" ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <nav className="container mx-auto px-6 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <CollabFlowLogo />
          </Link>

          {/* Menu desktop */}
          <ul className="hidden md:flex space-x-8 text-sm font-medium">
            <li>
              <Link
                to="/"
                className="text-blue-100 hover:text-blue-400 transition-colors"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="text-blue-100 hover:text-blue-400 transition-colors"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="/my-account"
                className="text-blue-100 hover:text-blue-400 transition-colors"
              >
                My Account
              </Link>
            </li>
          </ul>

          <button
            className="md:hidden text-blue-100 hover:text-blue-400"
            onClick={() => setMenuOpen(true)}
          >
            <Menu size={24} />
          </button>
        </nav>
      </header>

      {/* OVERLAY (para fechar ao clicar fora) */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* MENU MOBILE - ESQUERDO */}
      <div
        className={`fixed top-0 left-0 h-full z-[9999] w-72 bg-[#1E293B] shadow-2xl transform transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } md:hidden`}
      >
        <div className="flex flex-col h-full p-6 space-y-6">
          <div className="mb-4">
            <Link to="/" onClick={() => setMenuOpen(false)}>
              <CollabFlowLogo />
            </Link>
          </div>

          <hr className="border-blue-700" />

          <nav className="flex flex-col space-y-4 text-base font-medium">
            <Link
              to="/"
              className="text-blue-100 hover:text-blue-400"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-blue-100 hover:text-blue-400"
              onClick={() => setMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/my-account"
              className="text-blue-100 hover:text-blue-400"
              onClick={() => setMenuOpen(false)}
            >
              My Account
            </Link>
          </nav>

          <Link
              to="/login-register"
              className="text-blue-100 hover:text-blue-400 mt-auto flex items-center"
              onClick={() => setMenuOpen(false)}
            >
              <FiLogOut size={20} className="inline mr-2" />
              Logout
            </Link>

          <div className=" pt-6 border-t border-blue-800 text-sm text-blue-500">
            © 2025 CollabFlow
          </div>

          <button
            className="absolute top-4 right-4 text-blue-300 hover:text-white"
            onClick={() => setMenuOpen(false)}
          >
            <X size={24} />
          </button>
        </div>
      </div>
    </>
  );
};

export default Header;
