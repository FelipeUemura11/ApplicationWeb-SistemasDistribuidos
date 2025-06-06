/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useAuth } from "../../context/authContext";
import { useNavigate } from "react-router-dom";
import {
  FaUserCircle,
  FaEdit,
  FaSignOutAlt,
  FaCopy,
  FaUserPlus,
} from "react-icons/fa";

import Swal from "sweetalert2";

interface Props {
    currentUser: any;
    setShowModal: (show: boolean) => void;
}

export default function AccountHeader({ currentUser, setShowModal }: Props) {
  const { logOut: firebaseLogout } = useAuth();
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUser?.userCode || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = async () => {
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
      <h2 className="text-2xl font-semibold mb-1">
        {currentUser?.displayName}
      </h2>
      <p className="text-blue-300 text-sm mb-4">{currentUser?.email}</p>

      {/* Código do usuário */}
      <div className="bg-[#0F172A] border border-blue-700 rounded-lg p-3 mb-6 flex items-center justify-between">
        <span className="text-sm font-mono text-blue-300">
          {currentUser?.userCode}
        </span>
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
      <div className="flex flex-col gap-4 mb-8">
        {/* <button className="flex items-center justify-center cursor-pointer gap-2 bg-[#3B82F6] hover:bg-[#1E40AF] text-white font-medium py-2 px-4 rounded-lg transition-all">
          <FaEdit /> Editar Perfil
        </button> */}

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center cursor-pointer gap-2 bg-[#3B82F6] hover:bg-[#1E40AF] text-white font-medium py-2 px-4 rounded-lg transition-all"
        >
          <FaUserPlus /> Adicionar Contato
        </button>

        <button
          onClick={handleLogout}
          className="flex items-center justify-center cursor-pointer gap-2 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-all"
        >
          <FaSignOutAlt /> Sair da Conta
        </button>
      </div>
    </>
  );
}
