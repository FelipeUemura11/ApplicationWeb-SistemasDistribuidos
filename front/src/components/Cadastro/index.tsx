import { useEffect, useState } from "react";
import Swal from "sweetalert2";

import Divider from "../LoginPageComponents/Divider";
import LoginInput from "../LoginPageComponents/LoginInput";
import PasswordInput from "../LoginPageComponents/PasswordInput";
import RegisterInput from "../LoginPageComponents/RegisterInput";

import BackgroundImage from "../../assets/images/loginPage.jpg";

export default function Cadastro({
  setIsLogin,
  setLoading,
}: {
  setIsLogin: (value: boolean) => void;
  setLoading: (value: boolean) => void;
}) {
  const [bgImage, setBgImage] = useState(BackgroundImage);
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

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

  function cadastrarUsuario(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    if (senha !== confirmarSenha) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "As senhas não coincidem!",
        didOpen: () => {
          const swalPopup = document.querySelector(".swal2-popup");
          if (swalPopup) {
            (swalPopup as HTMLElement).style.zIndex = "9999";
          }
        },
      });
      setLoading(false);
      return;
    }

    setTimeout(() => {
      Swal.fire({
        icon: "success",
        title: "Cadastro realizado com sucesso!",
        text: "Você já pode fazer login.",
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
      className="min-h-screen h-full w-full overflow-y-scroll"
      style={{
        scrollbarWidth: "none", // Firefox
        msOverflowStyle: "none", // IE/Edge
        backgroundImage: bgImage ? `url(${bgImage})` : "none",
      }}
    >
      {/* conteúdo */}
      <style>
        {`
      #formulario::-webkit-scrollbar {
        display: none;
      }
    `}
      </style>
      <div className="w-[95%] md:w-[70%] rounded-lg bg-[#0F172A] h-fit md:bg-transparent p-[20px] md:p-0 mx-auto flex flex-col transition-opacity duration-500 mt-[110px] mb-[20px]">
        <h1 className="text-center text-gray-300 text-[30px] font-medium mb-[10px]">
          Cadastro
        </h1>
        <p className="text-gray-300 mt-[20px] font-medium text-[14px]">
          Crie sua conta e comece a colaborar com sua equipe em tempo real, com
          organização, agilidade e segurança.
        </p>

        <div className="flex flex-col mb-[20px] mt-[30px]">
          <RegisterInput
            value={nomeCompleto}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNomeCompleto(e.target.value)
            }
          />
        </div>

        <div className="flex flex-col mb-[20px]">
          <LoginInput
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
          />
        </div>

        <div className="flex flex-col mb-[20px]">
          <PasswordInput
            value={senha}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSenha(e.target.value)
            }
            esqueciSenha={false}
            label="Senha"
          />
        </div>

        <div className="flex flex-col mb-[20px]">
          <PasswordInput
            value={confirmarSenha}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setConfirmarSenha(e.target.value)
            }
            esqueciSenha={false}
            label="Confirme sua Senha"
          />
        </div>

        <button
          onClick={cadastrarUsuario}
          className="cursor-pointer bg-[#3B82F6] hover:bg-[#1E40AF] w-full h-[45px] rounded-md text-white font-medium mt-[20px] text-[17px] transition-all duration-200 hover:opacity-80 mb-[10px]"
        >
          Cadastrar
        </button>

        <Divider texto="Ou Entre em sua Conta" />

        <button
          className="cursor-pointer bg-[#dadada] w-full h-[45px] rounded-md text-[#333] font-medium text-[17px] transition-all duration-200 hover:opacity-80 mt-[10px]"
          onClick={() => setIsLogin(true)}
        >
          Voltar ao Login
        </button>
      </div>
    </div>
  );
}
