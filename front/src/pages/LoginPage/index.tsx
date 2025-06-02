import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import LoadingModal from "../../components/LoadingModal/index.tsx";
import loginImage from "../../assets/images/loginPage.jpg";
import cadastroImage from "../../assets/images/loginPage.jpg";
import Login from "../../components/Login/index";
import Cadastro from "../../components/Cadastro/index.tsx";

export default function LoginPage() {
  const { currentUser } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  if (currentUser) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="relative flex h-screen w-full overflow-x-hidden ">
      <LoadingModal visible={loading} />
      <div
        className={`relative w-full md:w-1/2 flex justify-center items-center transition-transform duration-700 ${
          isLogin ? "translate-x-0" : "-translate-x-full md:-translate-x-0"
        }`}
      >
        <div className={`w-full h-full flex justify-center items-center ${isLogin ? 'opacity-100 z-10' : 'opacity-0 z-0 md:opacity-100'}`}>
          <Login setIsLogin={setIsLogin} setLoading={setLoading} />
        </div>
      </div>
      <div
        className={`hidden md:block relative w-1/2 h-full transition-transform duration-700 ${
          isLogin ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div
          className={`absolute inset-0 ${
            isLogin ? "bg-gradient-to-r" : "bg-gradient-to-l"
          } from-[#0F172A] via-[#0f172a80] to-transparent opacity-100 z-0`}
        ></div>
        <img
          src={isLogin ? loginImage : cadastroImage}
          alt="Imagem de fundo da página de login"
          className={`w-full h-full object-cover object-center`}
        />
      </div>
      <div
        className={`absolute top-0 left-0 md:left-auto md:right-0 w-full md:w-1/2 h-full flex justify-center items-center transition-transform duration-700 ${
          isLogin
            ? "translate-x-full md:translate-x-full opacity-0 md:opacity-100 pointer-events-none md:pointer-events-auto"
            : "translate-x-0 opacity-100 z-10"
        }`}
      >
         <div className={`w-full h-full flex justify-center items-center ${!isLogin ? 'opacity-100 z-10' : 'opacity-0 z-0 md:opacity-100'}`}>
          <Cadastro setIsLogin={setIsLogin} setLoading={setLoading} />
        </div>
      </div>
    </div>
  );
}