import { FC } from 'react';
import { Link } from 'react-router-dom';
import CollabFlowLogo from '../Icon/CollabFlowLogo';
import useScrollDirection from '../../hooks/useScrollDirection';

const Header: FC = () => {
  const scrollDirection = useScrollDirection();

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 bg-[#1E293B] shadow-md transition-transform duration-300 ${
        scrollDirection === 'down' ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      <nav className="container mx-auto px-10 py-1.5 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-2">
            <CollabFlowLogo />
          </Link>
        </div>

        {/* Navegação */}
        <ul className="flex space-x-8 text-sm font-medium">
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
      </nav>
    </header>
  );
};

export default Header;
