import { FC } from 'react';

const Home: FC = () => {
  return (
    <div className="space-y-8">
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Bem-vindo
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Uma plataforma moderna
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Recursos
          </h3>
          <p className="text-gray-600">
            Explore nossos recursos incríveis
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Serviços
          </h3>
          <p className="text-gray-600">
            Conheça nossos serviços
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Contato
          </h3>
          <p className="text-gray-600">
            Entre em contato conosco
          </p>
        </div>
      </section>
    </div>
  )
}

export default Home;