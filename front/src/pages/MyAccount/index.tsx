/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useState } from "react";
import { useAuth } from "../../context/authContext";

import ContactList from "./ContactList";
import FriendRequests from "./FriendRequests";
import AccountHeader from "./AccountHeader";
import AddContactModal from "./AddContactModal";

const MyAccount: FC = () => {
  const [showModal, setShowModal] = useState(false);
  
  const { currentUser} = useAuth();


  return (
    <section className="py-10 mt-24 flex justify-center items-center min-h-screen bg-gradient-to-br from-[#0F172A] to-[#1E293B] px-4">
      <div className="bg-[rgb(30,41,59)] border border-blue-800 text-center text-blue-100 p-8 rounded-2xl shadow-xl w-full max-w-md">
        { /* Cabeçalho da Conta */}
        <AccountHeader currentUser={currentUser} setShowModal={setShowModal} />

        {/* Contatos */}
        <ContactList currentUser={currentUser} />

        {/* Pedidos de Amizade Recebidos */}
        <FriendRequests currentUser={currentUser} />
      </div>

      {showModal && (
        <AddContactModal currentUser={currentUser} setShowModal={setShowModal} />
      )}
    </section>
  );
};

export default MyAccount;
