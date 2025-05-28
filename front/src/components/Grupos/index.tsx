export default function Grupos() {
  return (
    <div className="w-full h-full md:w-1/5 min-w-[180px] max-w-xs py-4 flex-shrink-0 flex flex-col items-center md:items-start bg-[#0F172A] md:border-r border-blue-800 shadow-md md:bg-transparent md:shadow-none mx-auto md:mx-0">
      <h2 className="font-bold text-lg text-blue-200 px-4 mb-4 w-full text-center md:text-left">
        Grupos
      </h2>

      <div className="overflow-y-auto pr-2 max-h-[calc(100vh-100px)] w-full">
        <ul className="space-y-3 px-2 flex flex-col items-center md:items-start">
          {[...Array(7)].map((_, i) => (
            <li
              key={i}
              className="flex items-center gap-3 px-3 py-3 bg-[#1E293B] hover:bg-blue-800/30 border border-blue-900 rounded-lg transition shadow-sm w-full max-w-xs md:bg-transparent md:border-none md:shadow-none"
            >
              <div className="w-10 h-10 bg-blue-500 rounded-md flex-shrink-0" />
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-blue-100 truncate">
                  Nome do Grupo
                </p>
                <p className="text-xs text-blue-400 truncate">
                  Descrição do grupo
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
