/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetchContacts } from "../../services/fetchContacts";
import { addMembersToGroup } from "../../services/chatService";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

const MySwal = withReactContent(Swal);


export const handleAddMembers = async (chatId: string) => {
  const contacts = await fetchContacts();
  const htmlContent = `${
    contacts.length > 0
      ? `<ul class="text-left space-y-2 max-h-60 overflow-y-auto custom-scrollbar px-1">
        ${contacts
          .map(
            (c: any) => `
            <li class="bg-[#0F172A] border border-blue-700 p-3 rounded-lg flex justify-between items-center hover:bg-blue-800/30 transition-colors duration-200">
              <div>
                <p class="font-medium text-blue-100">${
                  c.displayName || c.email
                }</p>
                <p class="text-sm text-blue-400">${c.email}</p>
              </div>
              <input 
                type="checkbox" 
                value="${c.uid}" 
                id="user-${c.uid}" 
                class="form-checkbox h-5 w-5 text-blue-500 bg-slate-800 border-blue-700 rounded focus:ring-0 cursor-pointer"
              />
            </li>`
          )
          .join("")}
      </ul>`
      : `<p class="text-blue-300 text-sm">Você não possui contatos para adicionar.</p>`
  }`;

  const { value: selected } = await MySwal.fire({
    title: "Adicionar Contatos ao Grupo",
    html: htmlContent,
    background: "#1E293B",
    color: "#E0E7FF",
    confirmButtonText: "Adicionar",
    showCancelButton: true,
    preConfirm: () => {
      const checkboxes = document.querySelectorAll(
        "input[type='checkbox']:checked"
      );
      return Array.from(checkboxes).map((cb: any) => cb.value);
    },
  });

  if (selected && selected.length > 0) {
    try {
      await addMembersToGroup(chatId, selected);
      Swal.fire({
        icon: "success",
        title: "Contatos adicionados com sucesso!",
        background: "#1E293B",
        color: "#E0E7FF",
      });
    } catch (err) {
      console.error("Erro ao adicionar membros:", err);
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: "Não foi possível adicionar os contatos ao grupo.",
        background: "#1E293B",
        color: "#E0E7FF",
      });
    }
  }
};
