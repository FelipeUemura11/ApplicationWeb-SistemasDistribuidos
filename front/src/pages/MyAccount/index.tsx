import { FC, useState } from "react";
import {
  FaUserCircle,
  FaEdit,
  FaSignOutAlt,
  FaCopy,
  FaUserPlus,
} from "react-icons/fa";
import { useAuth } from "../../context/authContext";

const MyAccount: FC = () => {
  const { currentUser } = useAuth();
  const userCode = "CFX-8429";
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(userCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="mt-10 flex justify-center items-center min-h-screen bg-gradient-to-br from-[#0F172A] to-[#1E293B] px-4">
      <div className="bg-[#1E293B] border border-blue-800 text-center text-blue-100 p-8 rounded-2xl shadow-xl w-full max-w-md">
        {/* Avatar */}
        <div className="flex justify-center mb-4">
          {currentUser?.photoURL ? (
            <img
              src={currentUser.photoURL}
              alt="Avatar"
              className="w-24 h-24 rounded-full border-4 border-blue-700 shadow-lg"
            />
          ) : (
            <FaUserCircle className="text-blue-500" size={80} />
          )}
        </div>

        {/* Nome e email */}
        <h2 className="text-2xl font-semibold mb-1">{currentUser?.displayName}</h2>
        <p className="text-blue-300 text-sm mb-4">{currentUser?.email}</p>

        {/* Código do usuário */}
        <div className="bg-[#0F172A] border border-blue-700 rounded-lg p-3 mb-6 flex items-center justify-between">
          <span className="text-sm font-mono text-blue-300">{userCode}</span>
          <button
            onClick={handleCopy}
            className="text-blue-400 cursor-pointer hover:text-blue-200 transition"
            title="Copiar código"
          >
            <FaCopy />
          </button>
        </div>
        {copied && (
          <div className="flex items-center justify-center gap-2 text-green-400 bg-green-900/30 border border-green-700 px-4 py-2 rounded-lg text-sm mb-6 shadow-md transition-opacity">
            <svg
              className="w-4 h-4 text-green-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
            Código copiado com sucesso!
          </div>
        )}

        {/* Ações */}
        <div className="flex flex-col gap-4">
          <button className="flex items-center justify-center cursor-pointer gap-2 bg-[#3B82F6] hover:bg-[#1E40AF] text-white font-medium py-2 px-4 rounded-lg transition-all">
            <FaEdit /> Editar Perfil
          </button>

          <button className="flex items-center justify-center cursor-pointer gap-2 bg-[#3B82F6] hover:bg-[#1E40AF] text-white font-medium py-2 px-4 rounded-lg transition-all">
            <FaUserPlus /> Adicionar Contato
          </button>

          <button className="flex items-center justify-center cursor-pointer gap-2 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-all">
            <FaSignOutAlt /> Sair da Conta
          </button>
        </div>
      </div>
    </section>
  );
};

export default MyAccount;
