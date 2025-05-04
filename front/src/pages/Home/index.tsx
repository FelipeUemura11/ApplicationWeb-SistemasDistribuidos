import React, { FC } from 'react';
import { Link } from 'react-router-dom';

const Home: FC = () => {
  return (
    <section className="flex justify-center items-center min-h-screen px-4 py-6 relative overflow-hidden">
      <div
                className="text-center p-6 rounded-lg"
                style={{
                  background: 'linear-gradient(to bottom, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.7))',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)',
                  position: 'relative',
                }}
      
      >
        <h2 className="text-3xl font-bold text-white mb-6"> Bem-vindo ao App </h2>
        <div className="flex flex-col space-y-3">
          <Link to="/tarefa" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">Criar Tarefa</Link>
          <Link to="/about" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">Sobre o App</Link>
          <Link to="*" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">NotFound</Link>
        </div>
      </div>
    </section>
  )
}

export default Home;