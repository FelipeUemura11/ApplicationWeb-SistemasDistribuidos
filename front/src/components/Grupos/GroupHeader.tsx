import * as chatService from "../../services/chatService";
import { FiPlusCircle } from "react-icons/fi";
import Swal from "sweetalert2";

interface Props {
  onChatSelect: (chatId: string) => void;
  currentUser: { uid: string } | null;
  setIsLoading: (loading: boolean) => void;
}

export default function GroupHeader({
  onChatSelect,
  currentUser,
  setIsLoading,
}: Props) {
  const handleCreateGroup = async () => {
    if (!currentUser?.uid) return;

    const { value: groupName } = await Swal.fire({
      background: "#1E293B",
      color: "#E0E7FF",
      title: "Criar Novo Grupo",
      input: "text",
      inputLabel: "Nome do Grupo",
      inputPlaceholder: "Digite o nome do grupo...",
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      confirmButtonText: "Criar Grupo",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#3B82F6",
      cancelButtonColor: "#EF4444",
      customClass: {
        popup: "bg-[#1E293B] text-blue-100 rounded-lg",
        title: "text-blue-100",
        input:
          "bg-[#0F172A] text-blue-100 border-blue-700 focus:ring-blue-500 focus:border-blue-500",
        inputLabel: "text-blue-300",
        actions: "gap-x-2",
      },
      inputValidator: (value) => {
        if (!value || value.trim().length === 0) {
          return "Você precisa digitar um nome para o grupo!";
        }
        if (value.length > 50) {
          return "O nome do grupo não pode ter mais de 50 caracteres.";
        }
      },
    });

    if (groupName && groupName.trim()) {
      setIsLoading(true);
      try {
        const newChatId = await chatService.createChatRoom(
          currentUser.uid,
          [currentUser.uid],
          groupName.trim(),
          true
        );
        if (newChatId) {
          onChatSelect(newChatId);
          Swal.fire({
            title: "Sucesso!",
            text: `Grupo "${groupName.trim()}" criado.`,
            icon: "success",
            background: "#1E293B",
            color: "#E0E7FF",
            confirmButtonColor: "#3B82F6",
          });
        }
      } catch (e) {
        console.error("Erro ao criar grupo:", e);
        Swal.fire({
          title: "Erro!",
          text: "Não foi possível criar o grupo.",
          icon: "error",
          background: "#1E293B",
          color: "#E0E7FF",
          confirmButtonColor: "#EF4444",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="px-4 py-3 w-full flex justify-between items-center border-b border-blue-700/50 md:pt-4">
      <h2 className="font-bold text-xl text-blue-100">Conversas</h2>
      <button
        onClick={handleCreateGroup}
        title="Criar Novo Grupo"
        className="p-2 text-blue-300 hover:text-blue-100 transition-colors rounded-full hover:bg-blue-700/50"
      >
        <FiPlusCircle size={24} className="cursor-pointer" />
      </button>
    </div>
  );
}
