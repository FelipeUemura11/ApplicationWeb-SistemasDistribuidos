import { FC } from 'react';
import { Link } from 'react-router-dom';
const Header: FC = () => {
  return (
    <header className="bg-[#3B82F6] shadow-lg">
      <nav className="container mx-auto px-5 py-5">
        <div className="flex items-center justify-between">
          <ul className="flex space-x-10">
            <li>
              <Link
                  to="/"
                  className="text-[#F8FAFC] hover:text-blue-100 transition-colors font-medium">
                  Home
              </Link>
            </li>
            <li>
              <Link
                  to="/about"
                  className="text-[#F8FAFC] hover:text-blue-100 transition-colors font-medium">
                  About
              </Link>
            </li>
            <li>
              <Link
                  to="*"
                  className="text-[#F8FAFC] hover:text-blue-100 transition-colors font-medium">
                  NotFound
              </Link>
            </li>
            
          </ul>
        </div>
      </nav>
    </header>
  )
}

export default Header;