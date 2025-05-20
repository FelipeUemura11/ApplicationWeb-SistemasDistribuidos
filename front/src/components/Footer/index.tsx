import { FC } from "react";
import { Link } from "react-router-dom";
import { FaEnvelope, FaPhone, FaChevronRight } from "react-icons/fa";

const Footer: FC = () => {
  return (
    <footer className="bg-[#0F172A] text-blue-100 pt-12 pb-6 px-4 border-t border-blue-900">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 text-sm">
        {/* Sobre Nós */}
        <div>
          <h4 className="text-blue-400 font-semibold text-base mb-3">
            Sobre o CollabFlow
          </h4>
          <p className="text-blue-300 leading-relaxed">
            Uma plataforma colaborativa moderna que conecta equipes, organiza
            tarefas e mantém tudo sincronizado em tempo real.
          </p>
        </div>

        {/* Links Rápidos */}
        <div>
          <h4 className="text-blue-400 font-semibold text-base mb-3">
            Links Rápidos
          </h4>
          <ul className="space-y-2">
            <li>
              <Link
                to="/"
                className="flex items-center gap-2 text-blue-300 hover:text-blue-100 transition-colors"
              >
                <FaChevronRight className="text-blue-500" size={12} />
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="flex items-center gap-2 text-blue-300 hover:text-blue-100 transition-colors"
              >
                <FaChevronRight className="text-blue-500" size={12} />
                Sobre
              </Link>
            </li>
            <li>
              <Link
                to="/myaccount"
                className="flex items-center gap-2 text-blue-300 hover:text-blue-100 transition-colors"
              >
                <FaChevronRight className="text-blue-500" size={12} />
                Minha Conta
              </Link>
            </li>
          </ul>
        </div>

        {/* Contato */}
        <div>
          <h4 className="text-blue-400 font-semibold text-base mb-3">
            Contato
          </h4>
          <div className="space-y-2 text-blue-300">
            <p className="flex items-center gap-2">
              <FaEnvelope className="text-blue-500" /> collabflow@gmail.com
            </p>
            <p className="flex items-center gap-2">
              <FaPhone className="text-blue-500" /> (41) 7777-7777
            </p>
          </div>
        </div>
      </div>

      {/* Rodapé inferior */}
      <div className="mt-12 text-center text-blue-500 text-xs">
        &copy; {new Date().getFullYear()} CollabFlow. Todos os direitos
        reservados.
      </div>
    </footer>
  );
};

export default Footer;
