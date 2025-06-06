import { useState } from "react";
import { FiAtSign } from "react-icons/fi";

type LoginInputProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function LoginInput({onChange, value}: LoginInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative w-full">

      <label
      htmlFor="email"
        className={`absolute text-gray-300 transition-all duration-300 bg-[#1E293B] md:bg-[#0F172A] px-2 ${
          isFocused || value
            ? "top-[-10px] left-2 text-[14px]"
            : "top-1/2 transform left-3 -translate-y-1/2 text-base text-[16px]"
        }`}
      >
        E-mail
      </label>


      <input
        id="email"
        name="email"
        type="email"
        className="w-full border text-gray-300 border-gray-300 rounded-lg py-3 px-4 pr-10 transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-[#1E40AF] focus:border-[#1E40AF]"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChange={onChange}
      />

      <FiAtSign className={`absolute right-3 top-1/2 transform transition-all duration-300 -translate-y-1/2 text-[22px] ${isFocused || value ? "text-[#1E40AF] opacity-80" : "text-gray-400"}`} />
    </div>
  );
};
