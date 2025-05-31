import { useState } from "react";
import Login from "../../components/Login";
import Cadastro from "../../components/Cadastro";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-[#0F172A]">
      {isLogin ? (
        <Login setIsLogin={setIsLogin} setLoading={setLoading} />
      ) : (
        <Cadastro setIsLogin={setIsLogin} setLoading={setLoading} />
      )}
      
      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
}
