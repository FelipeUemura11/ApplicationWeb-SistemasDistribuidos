import { FC, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import CollabFlowLogo from "../Icon/CollabFlowLogo";
import useScrollDirection from "../../hooks/useScrollDirection";
import { FiLogOut } from "react-icons/fi";
import { useAuth } from "../../context/authContext";
import Swal from "sweetalert2";

const Header: FC = () => {
  const scrollDirection = useScrollDirection();
  const [menuOpen, setMenuOpen] = useState(false);
  const { currentUser, logOut: firebaseLogout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleLogout = async () => {
    setMenuOpen(false);
    try {
      await firebaseLogout();
      Swal.fire({
        icon: "success",
        title: "Logout realizado!",
        text: "Você foi desconectado com sucesso.",
        timer: 1500,
        showConfirmButton: false,
        background: "#1E293B",
        color: "#E0E7FF",
      });
      navigate("/login-register");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: "Não foi possível fazer logout.",
        background: "#1E293B",
        color: "#E0E7FF",
      });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 bg-[#1E293B] shadow-md transition-transform duration-300 ${
          scrollDirection === "down" ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <nav className="container mx-auto px-6 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <CollabFlowLogo />
          </Link>

          <ul className="hidden md:flex items-center space-x-8 text-sm font-medium">
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
            {currentUser && (
              <>
                <li>
                  <Link
                    to="/my-account"
                    className="text-blue-100 hover:text-blue-400 transition-colors"
                  >
                    My Account
                  </Link>
                </li>
                {/* <li>
                  <button
                    onClick={handleLogout}
                    className="flex items-center cursor-pointer gap-1 px-3 py-1.5 text-sm bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-200"
                  >
                    <FiLogOut size={16} />
                    Sair
                  </button>
                </li> */}
              </>
            )}
            {!currentUser && (
              <li>
                <Link
                  to="/login-register"
                  className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200"
                >
                  Login
                </Link>
              </li>
            )}
          </ul>

          {currentUser && (
            <button
              className="md:hidden text-blue-100 hover:text-blue-400"
              onClick={() => setMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
          )}
          {!currentUser && (
            <Link
              to="/login-register"
              className="md:hidden px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200"
            >
              Login
            </Link>
          )}
        </nav>
      </header>

      {menuOpen && (
        <div
          className="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-full z-[9999] w-72 bg-[#1E293B] shadow-2xl transform transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } md:hidden`}
      >
        <div className="flex flex-col h-full p-6 space-y-6">
          <div className="mb-4 flex justify-between items-center">
            <Link to="/" onClick={() => setMenuOpen(false)}>
              <CollabFlowLogo />
            </Link>
          </div>

          <hr className="border-blue-700" />

          {currentUser && (
            <>
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
            </>
          )}

          {!currentUser && (
            <Link
              to="/login-register"
              className="text-blue-100 hover:text-blue-400 text-base font-medium"
              onClick={() => setMenuOpen(false)}
            >
              Login / Registrar
            </Link>
          )}

          <button
            onClick={handleLogout}
            className="text-red-400 hover:text-red-300 mt-auto flex items-center w-full py-2 cursor-pointer"
          >
            <FiLogOut size={20} className="inline mr-2" />
            Logout
          </button>

          <div className="pt-6 border-t border-blue-800 text-sm text-blue-500">
            © 2025 CollabFlow
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
