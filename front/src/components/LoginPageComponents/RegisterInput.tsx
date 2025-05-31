import { useState } from "react";
import { FaUser } from "react-icons/fa";

type RegisterInputProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function RegisterInput({ value, onChange }: RegisterInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative w-full">
      <label
        htmlFor="nomeCompleto"
        className={`absolute bg-blue-800 text-gray-300 transition-all duration-300 bg-[#0F172A] px-2 ${
          isFocused || value
            ? "top-[-10px] left-2 text-[14px]"
            : "top-1/2 transform left-3 -translate-y-1/2 text-base text-[16px]"
        }`}
      >
        Nome Completo
      </label>

      <input
        id="nomeCompleto"
        name="nomeCompleto"
        type="text"
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="w-full border text-[#555] border-gray-300 rounded-lg py-3 px-4 pr-10 transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-[#1E40AF] focus:border-[#1E40AF]"
      />

      <FaUser
        className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-[22px] transition-all duration-300 ${
          isFocused || value ? "text-[#1E40AF] opacity-80" : "text-gray-400"
        }`}
      />
    </div>
  );
}
