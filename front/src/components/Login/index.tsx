import { useEffect, useState } from "react";
import Swal from "sweetalert2";

import Divider from "../LoginPageComponents/Divider";
import LoginInput from "../LoginPageComponents/LoginInput";
import PasswordInput from "../LoginPageComponents/PasswordInput";

import BackgroundImage from "../../assets/images/loginPage.jpg";

export default function Login({
  setIsLogin,
  setLoading,
}: {
  setIsLogin: (value: boolean) => void;
  setLoading: (value: boolean) => void;
}) {
  const [bgImage, setBgImage] = useState(BackgroundImage);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setBgImage("");
      } else {
        setBgImage(BackgroundImage);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function loginUsuario(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      Swal.fire({
        icon: "success",
        title: "Login realizado com sucesso!",
        text: "Bem-vindo de volta!",
        didOpen: () => {
          const swalPopup = document.querySelector(".swal2-popup");
          if (swalPopup) {
            (swalPopup as HTMLElement).style.zIndex = "9999";
          }
        },
      });
      setLoading(false);
    }, 2000);
  }

  return (
    <div
      id="formulario"
      className="min-h-screen h-[100%] overflow-y-auto scrollbar-hide w-[100%]"
      style={{
        backgroundImage: bgImage ? `url(${bgImage})` : "none",
        scrollbarWidth: "none", // Firefox
        msOverflowStyle: "none", // Edge
      }}
    >
      <div className="w-[95%] md:w-[70%] bg-[#0F172A]  rounded-lg h-fit md:bg-transparent p-[20px] md:p-0 mx-auto flex flex-col transition-opacity duration-500 mt-[110px] mb-[20px]">
        <h1 className="text-center text-[30px] font-medium mb-[10px] text-gray-300">Login</h1>
        <p className="text-gray-300 mt-[20px] text-[14px] font-medium">
          Acesse sua conta e comece a colaborar com sua equipe em tempo real, com organização, agilidade e segurança.
        </p>
        <div className="flex flex-col mb-[30px] mt-[30px]">
          <LoginInput
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex flex-col mb-[20px]">
          <PasswordInput
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            esqueciSenha={false}
            label="Senha"
          />
        </div>
        <button
          onClick={loginUsuario}
          className="cursor-pointer bg-[#3B82F6] hover:bg-[#1E40AF] w-full h-[45px] rounded-md text-white font-medium mt-[20px] text-[17px] transition-all duration-200 hover:opacity-80 mb-[10px]"
        >
          Entrar
        </button>
        <Divider texto="Ou Crie sua Conta" />
        <button
          className="cursor-pointer bg-[#dadada] w-full h-[45px] rounded-md text-[#333] font-medium text-[17px] transition-all duration-200 hover:opacity-80 mt-[10px]"
          onClick={() => setIsLogin(false)}
        >
          Cadastro
        </button>
      </div>
    </div>
  );
}
