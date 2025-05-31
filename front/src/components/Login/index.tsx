import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

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
  const navigate = useNavigate();
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

  async function loginUsuario(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Tentando fazer login:', { email, senha });
      
      const response = await api.post('/usuario/login', {
        email,
        senha
      });

      console.log('Resposta do servidor:', response.data);

      // não perder os dados caso o usuario feche o navegador e abra novamente
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.usuario));

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
      }).then(() => {
        // redirecionar para a pagina home após o alerta
        navigate('/Home');
      });
    } catch (error: any) {
      console.error('Erro ao fazer login:', error);
      console.error('Detalhes do erro:', error.response?.data);
      
      Swal.fire({
        icon: "error",
        title: "Erro ao fazer login",
        text: error.response?.data?.error || "Ocorreu um erro ao tentar fazer login",
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
    <div className="w-full h-full bg-[#0F172A]">
      <div
        id="formulario"
        className="min-h-screen h-full w-full flex justify-center items-center overflow-y-auto scrollbar-hide"
        style={{
          backgroundImage: bgImage ? `url(${bgImage})` : "none",
          scrollbarWidth: "none", // Firefox
          msOverflowStyle: "none", // Edge
        }}
      >
        <div className="w-[25%] md:w-[25%] bg-blue-800 rounded-lg p-6 md:p-10 mx-auto flex flex-col transition-opacity duration-500 shadow-lg">
          <h1 className="text-center text-[30px] font-semibold mb-6 text-white">Login</h1>
  
          <div className="flex flex-col mb-6">
            <LoginInput
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
  
          <div className="flex flex-col mb-5">
            <PasswordInput
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              esqueciSenha={false}
              label="Senha"
            />
          </div>
  
          <button
            onClick={loginUsuario}
            className="cursor-pointer bg-[#3B82F6] hover:bg-[#1E40AF] w-full h-[45px] rounded-md text-white font-medium text-[17px] transition-all duration-200 mb-4"
          >
            Entrar
          </button>
  
          <Divider texto="Ou Crie sua Conta" />
  
          <button
            className="cursor-pointer bg-[#dadada] w-full h-[45px] rounded-md text-[#333] font-medium text-[17px] transition-all duration-200 mt-3"
            onClick={() => setIsLogin(false)}
          >
            Cadastro
          </button>
        </div>
      </div>
    </div>
  );
}
