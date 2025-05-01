import { FC } from 'react';
import { Link } from 'react-router-dom';

const Footer: FC = () => {
  return (
    <footer className="bg-gradient-to-r from-black to-gray-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Coluna 1 - Sobre */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">
              Sobre Nós
            </h4>
            <p className="text-gray-400">
              Uma plataforma moderna construída com as melhores tecnologias.
            </p>
          </div>

          {/* Coluna 2 - Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">
              Links Rápidos
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                  Sobre
                </Link>
              </li>
              <li>
                <Link to="*" className="text-gray-400 hover:text-white transition-colors">
                  NotFound
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 3 - Contato */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">
              Contato
            </h4>
            <div className="space-y-2 text-gray-400">
              <p className="flex items-center">
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                  felipe@gmail.com
              </p>
              <p className="flex items-center">
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                (41) 7777-7777
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Meu Site. Todos os direitos reservados...</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;