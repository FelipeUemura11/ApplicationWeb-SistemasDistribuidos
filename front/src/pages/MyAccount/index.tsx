import { FC, useState } from "react";
import {
  FaUserCircle,
  FaEdit,
  FaSignOutAlt,
  FaCopy,
  FaUserPlus,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/authContext";
import Swal from "sweetalert2";
import { handleSearch } from "../../services/searchUserService";

const MyAccount: FC = () => {
  // Mock para visualização
  const [contacts, setContacts] = useState([
    { id: 1, name: "Alice Oliveira", userCode: "ALC-1234" },
    { id: 2, name: "Bruno Lima", userCode: "BRN-5678" },
    { id: 3, name: "Carla Mendes", userCode: "CRL-4321" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  // Contatos filtrados
  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.userCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [showModal, setShowModal] = useState(false);
  const [searchUser, setSearchUser] = useState("");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [results, setResults] = useState<any[]>([]);
  const { currentUser, logOut: firebaseLogout } = useAuth();
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const onSearchInputChange = async (value: string) => {
    setSearchUser(value);
    const res = await handleSearch(value);
    setResults(res);
  };

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
    <section className="py-10 mt-24 flex justify-center items-center min-h-screen bg-gradient-to-br from-[#0F172A] to-[#1E293B] px-4">
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
          <button className="flex items-center justify-center cursor-pointer gap-2 bg-[#3B82F6] hover:bg-[#1E40AF] text-white font-medium py-2 px-4 rounded-lg transition-all">
            <FaEdit /> Editar Perfil
          </button>

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

        {/* Contatos */}
        <div className="text-left mt-6">
          <h3 className="text-lg font-semibold text-blue-300 mb-3 ml-2">
            Seus Contatos
          </h3>

          {/* Barra de busca */}
          <div className="relative mb-4 flex justify-center items-center">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18a7.5 7.5 0 006.15-3.35z"
                />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Buscar por nome ou código..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-[93%] pl-10 pr-5 mr-3 py-2 rounded-lg bg-[#0F172A] border border-blue-700 text-blue-100 placeholder:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <ul className="space-y-2 max-h-52 overflow-y-auto custom-scrollbar px-2">
            {filteredContacts.length > 0 ? (
              filteredContacts.map((contact) => (
                <li
                  key={contact.id}
                  className="p-3 rounded-lg bg-[#0F172A] border border-blue-700 hover:bg-blue-800/30 transition"
                >
                  <p className="font-medium text-blue-100">{contact.name}</p>
                  <p className="text-sm text-blue-400">{contact.userCode}</p>
                </li>
              ))
            ) : (
              <li className="text-sm text-blue-400">
                Nenhum contato encontrado.
              </li>
            )}
          </ul>
        </div>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setShowModal(false)} 
        >
          <div
            className="bg-[#1E293B] text-blue-100 w-full max-w-md rounded-2xl p-6 shadow-2xl border border-blue-700 relative transform transition-all duration-300 scale-95 animate-fadeIn"
            onClick={(e) => e.stopPropagation()} // <- impede o clique de propagar para o fundo
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-4 text-blue-400 hover:text-red-400 text-2xl font-bold transition-transform duration-200 hover:scale-110"
              aria-label="Fechar"
            >
              &times;
            </button>

            <h2 className="text-xl font-semibold mb-5 text-center tracking-wide">
              Adicionar Contato
            </h2>

            {/* Campo de busca com ícone */}
            <div className="relative mb-5">
              <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <svg
                  className="w-5 h-5 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18a7.5 7.5 0 006.15-3.35z"
                  />
                </svg>
              </span>
              <input
                type="text"
                value={searchUser}
                onChange={(e) => onSearchInputChange(e.target.value)}
                placeholder="Buscar por código ou e-mail"
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#0F172A] border border-blue-600 placeholder:text-blue-400 text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              />
            </div>

            {/* Resultados */}
            <ul className="space-y-3 max-h-52 overflow-y-auto custom-scrollbar">
              {results.length > 0 ? (
                results.map((user) => (
                  <li
                    key={user.uid}
                    className="bg-[#0F172A] border border-blue-700 p-3 rounded-lg flex justify-between items-center hover:bg-blue-800/30 transition-colors duration-200"
                  >
                    <div>
                      <p className="font-medium">{user.displayName}</p>
                      <p className="text-sm text-blue-400">{user.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        // lógica de envio de pedido de amizade
                      }}
                      className="text-sm bg-[#3B82F6] hover:bg-[#2563EB] text-white px-4 py-1.5 rounded-md transition-all duration-200 cursor-pointer"
                    >
                      Enviar pedido
                    </button>
                  </li>
                ))
              ) : (
                <p className="text-blue-400 text-sm text-center">
                  Nenhum usuário encontrado.
                </p>
              )}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
};

export default MyAccount;
