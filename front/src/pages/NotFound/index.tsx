import { FC } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const NotFound: FC = () => {
  return (
    <section className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#0F172A] to-[#1E293B] px-4">
      <div className="text-center max-w-lg p-8 bg-[#1E293B] rounded-2xl shadow-xl border border-blue-800">
        <h1 className="text-7xl md:text-8xl font-extrabold text-blue-400 mb-4 tracking-widest">
          404
        </h1>

        <h2 className="text-2xl md:text-3xl font-semibold text-blue-100 mb-3">
          Página não encontrada
        </h2>

        <p className="text-blue-300 mb-6">
          O caminho que você tentou acessar não existe ou foi movido. Mas não se
          preocupe — você pode voltar à segurança da página inicial.
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#3B82F6] hover:bg-[#1E40AF] text-white font-medium rounded-lg transition-all shadow-md"
        >
          <FaArrowLeft className="text-white" />
          Voltar ao início
        </Link>
      </div>
    </section>
  );
};

export default NotFound;
