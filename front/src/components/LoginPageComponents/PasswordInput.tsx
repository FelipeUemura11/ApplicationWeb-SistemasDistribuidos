import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

type PasswordInputProps = {
  esqueciSenha?: boolean;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};


const PasswordInput = ({ esqueciSenha, label, value, onChange }: PasswordInputProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const idCampo = label === "Senha" ? "senha" : "confirmarSenha";

  return (
    <>
      <div className="relative w-full">
        <label
          htmlFor={idCampo}
          className={`absolute text-gray-300 transition-all duration-300 bg-[#1E293B] md:bg-[#0F172A] px-2 ${
            isFocused || value
              ? "top-[-10px] left-2 text-[14px]"
              : "top-1/2 transform left-3 -translate-y-1/2 text-base text-[16px]"
          }`}
        >
          {label}
        </label>

        <input
          id={idCampo}
          name={label}
          value={value}
          type={isVisible ? "text" : "password"}
          className="w-full border text-gray-300 border-gray-300 rounded-lg py-3 px-4 pr-10 transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-[#1E40AF] focus:border-[#1E40AF]"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={onChange}
        />

        <button
          type="button"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 text-[22px]"
          onClick={() => setIsVisible(!isVisible)}
        >
          {isVisible ? (
            <FiEyeOff
              className={`transition-all duration-300 cursor-pointer ${
                isFocused || value
                  ? "text-[#1E40AF] opacity-80"
                  : "text-gray-400"
              }`}
            />
          ) : (
            <FiEye
              className={`transition-all duration-300 cursor-pointer ${
                isFocused || value
                  ? "text-[#1E40AF] opacity-80"
                  : "text-gray-400"
              }`}
            />
          )}
        </button>
      </div>
      {esqueciSenha && (
        <a
          href="/esqueci-senha"
          className="ml-auto mt-[20px] text-gray-300 transition-all duration-300 hover:text-[#1E40AF] font-medium text-[15px]"
        >
          Esqueci Minha Senha
        </a>
      )}
    </>
  );
};

export default PasswordInput;
