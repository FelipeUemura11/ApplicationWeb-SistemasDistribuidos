import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { FaTasks, FaInfoCircle, FaExclamationTriangle } from 'react-icons/fa';

const Home: FC = () => {
  return (
    <section className=" mt-8 flex justify-center items-center min-h-screen px-4 py-6 bg-gradient-to-br from-[#0F172A] to-[#1E293B]">
      <div className="bg-[#1E293B] border border-blue-800 shadow-xl rounded-2xl p-10 w-full max-w-md text-center">
        <h1 className="text-4xl font-bold text-blue-100 mb-6">
          Bem-vindo ao <span className="text-blue-400">CollabFlow</span>
        </h1>
        <p className="text-blue-300 text-sm mb-10">
          Colabore em tempo real com sua equipe — crie tarefas, compartilhe ideias e agende com facilidade.
        </p>
        
        <div className="flex flex-col gap-4">
          <Link to="/tarefa" className="flex items-center justify-center gap-2 bg-[#3B82F6] hover:bg-[#1E40AF] text-white font-semibold py-2 px-4 rounded-lg transition-all">
            <FaTasks className="text-white" /> Criar Tarefa
          </Link>

          <Link to="/about" className="flex items-center justify-center gap-2 bg-[#3B82F6] hover:bg-[#1E40AF] text-white font-semibold py-2 px-4 rounded-lg transition-all">
            <FaInfoCircle className="text-white" /> Sobre o App
          </Link>

          <Link to="*" className="flex items-center justify-center gap-2 bg-[#3B82F6] hover:bg-[#1E40AF] text-white font-semibold py-2 px-4 rounded-lg transition-all">
            <FaExclamationTriangle className="text-white" /> Not Found
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Home;
