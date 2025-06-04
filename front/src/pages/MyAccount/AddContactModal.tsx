/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { handleSearch } from "../../services/searchUserService";
import { sendFriendRequest } from "../../services/sendFriendRequest";

import Swal from "sweetalert2";

interface Props {
    currentUser: any; 
    setShowModal: (show: boolean) => void;
}

export default function AddContactModal({ currentUser, setShowModal }: Props) {
  const [searchUser, setSearchUser] = useState("");
  const [results, setResults] = useState<any[]>([]);

  const onSearchInputChange = async (value: string) => {
    setSearchUser(value);
    const res = await handleSearch(value);
    setResults(res);
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/70 flex items-center justify-center z-[200] backdrop-blur-sm transition-opacity duration-300"
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
                    onClick={async () => {
                      if (currentUser?.uid && user.uid !== currentUser.uid) {
                        const success = await sendFriendRequest(
                          currentUser.uid,
                          user.uid,
                          currentUser.displayName || "Usuário"
                        );
                        if (success) {
                          Swal.fire({
                            icon: "success",
                            title: "Pedido enviado!",
                            text: `Pedido de amizade enviado para ${user.displayName}.`,
                            background: "#1E293B",
                            color: "#E0E7FF",
                          });
                        }
                      }
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
    </>
  );
}
