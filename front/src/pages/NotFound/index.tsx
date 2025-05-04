// src/pages/NotFound/index.tsx
import { FC } from 'react';
import { Link } from 'react-router-dom'; 

const NotFound: FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center px-4"> 
      <h1 className="text-6xl md:text-8xl font-extrabold text-gray-800 mb-2">
        ERRO : 404
      </h1>

      <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-4">
        Oops! Página não encontrada
      </h2>

      <p className="text-gray-500 max-w-md mb-8">
        Parece que você se perdeu. A página que você está procurando não existe ou foi movida.
      </p>

      <Link
        to="/"
        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
      >
        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        Voltar para a Página Inicial
      </Link>
    </div>
  );
};

export default NotFound;