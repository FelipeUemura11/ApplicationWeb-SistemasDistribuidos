const CollabFlowLogo = () => {
  return (
    <svg
      className="w-56 h-14"
      viewBox="0 0 400 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <style>
        {`
          .text { font-family: 'Segoe UI', sans-serif; font-weight: 600; font-size: 32px; fill: #3B82F6; }
          .symbol { fill: #2563EB; }
          .dot { fill: #60A5FA; }
        `}
      </style>

      {/* Ícone de fluxo interligado */}
      <circle cx="30" cy="30" r="10" className="symbol" />
      <circle cx="50" cy="50" r="10" className="symbol" />
      <circle cx="30" cy="50" r="4" className="dot" />
      <path
        d="M30 30 Q40 40 50 50"
        stroke="#60A5FA"
        strokeWidth="2"
        fill="none"
      />

      {/* Nome da marca */}
      <text x="80" y="55" className="text">CollabFlow</text>
    </svg>
  );
};

export default CollabFlowLogo;
