import React, { FC } from 'react';
import { Link } from 'react-router-dom';

const Home: FC = () => {
  return (
    <section className="flex justify-center items-center min-h-screen px-4 py-6 relative overflow-hidden">
      <div
                className="text-center p-6 rounded-lg bg-[#1E293B]"
                style={{
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)',
                  position: 'relative',
                }}
      
      >
        <h2 className="text-3xl font-bold text-[#F8FAFC] mb-6"> Bem-vindo ao App </h2>
        <div className="flex flex-col space-y-3">
          <Link to="/tarefa" className="bg-[#3B82F6] hover:bg-[#1E40AF] text-[#F8FAFC] font-bold py-2 px-4 rounded">Criar Tarefa</Link>
          <Link to="/about" className="bg-[#3B82F6] hover:bg-[#1E40AF] text-[#F8FAFC] font-bold py-2 px-4 rounded">Sobre o App</Link>
          <Link to="*" className="bg-[#3B82F6] hover:bg-[#1E40AF] text-[#F8FAFC] font-bold py-2 px-4 rounded">NotFound</Link>
        </div>
      </div>
    </section>
  )
}

export default Home;