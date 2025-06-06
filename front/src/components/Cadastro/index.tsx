import { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import {
  AuthError,
  User as FirebaseAuthUser,
  UserCredential,
} from "firebase/auth";
import { upsertUserInDatabase } from "../../services/userService";

import Divider from "../LoginPageComponents/Divider";
import LoginInput from "../LoginPageComponents/LoginInput";
import PasswordInput from "../LoginPageComponents/PasswordInput";
import RegisterInput from "../LoginPageComponents/RegisterInput";

export default function Cadastro({
  setIsLogin,
  setLoading,
}: {
  setIsLogin: (value: boolean) => void;
  setLoading: (value: boolean) => void;
}) {
  const navigate = useNavigate();
  const { signUp, updateUserProfile } = useAuth();
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  async function cadastrarUsuario(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    if (senha !== confirmarSenha) {
      Swal.fire({
        background: "#1E293B",
        color: "#E0E7FF",
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

    try {
      const result = await signUp(email, senha);
      if ((result as UserCredential).user) {
        const userCredential = result as UserCredential;
        const firebaseUser: FirebaseAuthUser = userCredential.user;
        await updateUserProfile({ displayName: nomeCompleto });
        console.log(
          "Usuário cadastrado e perfil Auth atualizado:",
          firebaseUser.displayName
        );
        await updateUserProfile({ displayName: nomeCompleto });
        console.log(
          "Usuário cadastrado e perfil Auth atualizado:",
          firebaseUser.displayName
        );
        await upsertUserInDatabase(firebaseUser, { displayName: nomeCompleto });
        console.log(
          "Dados do usuário (cadastro) salvos/atualizados no Realtime Database."
        );
        await upsertUserInDatabase(firebaseUser, { displayName: nomeCompleto });
        console.log(
          "Dados do usuário salvos/atualizados no Realtime Database."
        );
        Swal.fire({
          background: "#1E293B",
          color: "#E0E7FF",
          icon: "success",
          title: "Cadastro realizado com sucesso!",
          text: "Você será redirecionado.",
          didOpen: () => {
            const swalPopup = document.querySelector(".swal2-popup");
            if (swalPopup) {
              (swalPopup as HTMLElement).style.zIndex = "9999";
            }
          },
        }).then(() => {
          navigate("/");
        });
      } else {
        const firebaseError = result as AuthError;
        console.error("Erro ao cadastrar (Firebase Auth):", firebaseError);
        let errorMessage = "Ocorreu um erro ao tentar cadastrar.";
        if (firebaseError.code === "auth/email-already-in-use") {
          errorMessage = "Este e-mail já está em uso.";
        } else if (firebaseError.code === "auth/weak-password") {
          errorMessage = "A senha é muito fraca. Use pelo menos 6 caracteres.";
        }
        Swal.fire({
          background: "#1E293B",
          color: "#E0E7FF",
          icon: "error",
          title: "Erro ao cadastrar",
          text: errorMessage,
          didOpen: () => {
            const swalPopup = document.querySelector(".swal2-popup");
            if (swalPopup) {
              (swalPopup as HTMLElement).style.zIndex = "9999";
            }
          },
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Erro geral no processo de cadastro:", error);
      Swal.fire({
        background: "#1E293B",
        color: "#E0E7FF",
        icon: "error",
        title: "Erro Inesperado",
        text: "Ocorreu um erro inesperado durante o cadastro. Tente novamente.",
        didOpen: () => {
          const swalPopup = document.querySelector(".swal2-popup");
          if (swalPopup) {
            (swalPopup as HTMLElement).style.zIndex = "9999";
          }
        },
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      id="formulario"
      className="min-h-screen h-full w-full overflow-y-scroll"
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      <style>
        {`
      #formulario::-webkit-scrollbar {
        display: none;
      }
    `}
      </style>
      <div className="w-[95%] md:w-[70%] rounded-lg bg-[#1E293B] h-fit md:bg-transparent p-[20px] md:p-0 mx-auto flex flex-col transition-opacity duration-500 mt-[110px] mb-[20px]">
        <h1 className="text-center text-gray-300 text-[30px] font-medium mb-[10px] pt-6">
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
