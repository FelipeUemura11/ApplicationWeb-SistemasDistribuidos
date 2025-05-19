import { FC } from "react";
import { FaUsers, FaTasks, FaCalendarAlt, FaComments } from "react-icons/fa";

const About: FC = () => {
  return (
    <section className="min-h-screen bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-blue-100 pt-36 pb-16 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-blue-400 mb-4">
          Sobre o CollabFlow
        </h1>
        <p className="text-blue-300 mb-12 text-lg leading-relaxed max-w-3xl mx-auto">
          O <span className="text-blue-200 font-semibold">CollabFlow</span> é
          uma plataforma colaborativa que une comunicação em tempo real, gestão
          de tarefas e agendas compartilhadas para times modernos. Projetado
          para produtividade, fluidez e colaboração contínua.
        </p>

        <div className="grid gap-10 sm:grid-cols-1 md:grid-cols-2 text-left">
          {/* Card: Chat */}
          <div className="bg-[#1E293B] border border-blue-800 rounded-2xl p-6 shadow-lg flex items-start gap-4 hover:shadow-blue-900 transition-shadow duration-300">
            <FaComments className="text-blue-400 text-3xl mt-1" />
            <div>
              <h2 className="text-xl font-semibold text-blue-100 mb-2">
                Chat em Tempo Real
              </h2>
              <p className="text-blue-300 text-sm leading-relaxed">
                Converse com sua equipe de forma instantânea em canais
                organizados por grupos, tópicos ou projetos.
              </p>
            </div>
          </div>

          {/* Card: Tarefas */}
          <div className="bg-[#1E293B] border border-blue-800 rounded-2xl p-6 shadow-lg flex items-start gap-4 hover:shadow-blue-900 transition-shadow duration-300">
            <FaTasks className="text-blue-400 text-3xl mt-1" />
            <div>
              <h2 className="text-xl font-semibold text-blue-100 mb-2">
                Tarefas Compartilhadas
              </h2>
              <p className="text-blue-300 text-sm leading-relaxed">
                Organize, atribua e monitore tarefas com sua equipe. Acompanhe o
                progresso em tempo real com facilidade.
              </p>
            </div>
          </div>

          {/* Card: Agenda */}
          <div className="bg-[#1E293B] border border-blue-800 rounded-2xl p-6 shadow-lg flex items-start gap-4 hover:shadow-blue-900 transition-shadow duration-300">
            <FaCalendarAlt className="text-blue-400 text-3xl mt-1" />
            <div>
              <h2 className="text-xl font-semibold text-blue-100 mb-2">
                Agenda Colaborativa
              </h2>
              <p className="text-blue-300 text-sm leading-relaxed">
                Marque eventos, compromissos e prazos em uma agenda acessível
                por todo o grupo. Sincronização garantida.
              </p>
            </div>
          </div>

          {/* Card: Contatos */}
          <div className="bg-[#1E293B] border border-blue-800 rounded-2xl p-6 shadow-lg flex items-start gap-4 hover:shadow-blue-900 transition-shadow duration-300">
            <FaUsers className="text-blue-400 text-3xl mt-1" />
            <div>
              <h2 className="text-xl font-semibold text-blue-100 mb-2">
                Conexão via Código ou E-mail
              </h2>
              <p className="text-blue-300 text-sm leading-relaxed">
                Adicione colegas rapidamente usando um código exclusivo ou
                endereço de e-mail. Simples, seguro e eficaz.
              </p>
            </div>
          </div>
        </div>

        <p className="text-blue-500 text-xs mt-16">
          © 2025 CollabFlow. Plataforma colaborativa para equipes que valorizam
          eficiência e comunicação.
        </p>
      </div>
    </section>
  );
};

export default About;
