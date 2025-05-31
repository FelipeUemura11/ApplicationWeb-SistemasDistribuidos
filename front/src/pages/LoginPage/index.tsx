import { useState } from "react";

import LoadingModal from "../../components/LoadingModal/index.tsx";

import loginImage from "../../assets/images/loginPage.jpg";
import cadastroImage from "../../assets/images/loginPage.jpg";
import Login from "../../components/Login/index";
import Cadastro from "../../components/Cadastro/index.tsx";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  return (
    <div className="relative flex h-screen w-full overflow-x-hidden ">
      <LoadingModal visible={loading} />
      {/* Área do Formulário - Sempre à Esquerda */}
      <div
        className={`relative w-full md:w-1/2 flex justify-center transition-transform duration-700 ${
          isLogin ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Formulário de Login */}
        {isLogin && <Login setIsLogin={setIsLogin} setLoading={setLoading} />}
      </div>

      {/* Imagem - Sempre Movendo Conforme o Estado */}
      <div
        className={`hidden md:block relative w-1/2 h-full transition-transform duration-700 ${
          isLogin ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div
          className={`absolute inset-0 ${
            isLogin ? "bg-gradient-to-r" : "bg-gradient-to-l"
          } from-[#0F172A] to-transparent opacity-100`}
        ></div>
        <img
          src={isLogin ? loginImage : cadastroImage}
          alt="Imagem"
          className={`w-full h-full object-cover object-top`}
        />
      </div>

      {/* Formulário de Cadastro - Sempre à Direita */}
      <div
        className={`absolute top-0 right-0  w-full md:w-1/2 h-full flex justify-center transition-transform duration-700 ${
          isLogin
            ? "translate-x-full opacity-0 pointer-events-none"
            : "translate-x-0 opacity-100"
        }`}
      >
        <Cadastro setIsLogin={setIsLogin} setLoading={setLoading} />
      </div>
    </div>
  );
}