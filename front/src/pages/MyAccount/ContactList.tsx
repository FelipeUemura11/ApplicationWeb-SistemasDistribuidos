/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { fetchContacts } from "../../services/fetchContacts";

export default function ContactList({ currentUser }: { currentUser: any }) {
  const [contacts, setContacts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Contatos filtrados
  const filteredContacts = contacts.filter((contact) => {
    const name = contact.name || contact.displayName || "";
    const code = contact.userCode || "";

    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  useEffect(() => {
    const loadContacts = async () => {
      if (currentUser?.uid) {
        const contactList = await fetchContacts();
        setContacts(contactList);

        console.log("Contatos carregados:", contactList);
      }
    };

    loadContacts();
  }, [currentUser?.uid]);

  return (
    <>
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
            className="w-[96%] pl-10 py-2 rounded-lg bg-[#0F172A] border border-blue-700 text-blue-100 placeholder:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <ul className="space-y-2 max-h-52 overflow-y-auto custom-scrollbar px-2">
          {filteredContacts.length > 0 ? (
            filteredContacts.map((contact, index) => (
              <li
                key={index}
                className="p-3 rounded-lg bg-[#0F172A] border border-blue-700 hover:bg-blue-800/30 transition"
              >
                <p className="font-medium text-blue-100">
                  {contact.displayName}
                </p>
                <p className="text-sm text-blue-400">{contact.email}</p>
              </li>
            ))
          ) : (
            <li className="text-sm text-blue-400">
              Nenhum contato encontrado.
            </li>
          )}
        </ul>
      </div>
    </>
  );
}
