import React, { useEffect, useState, useCallback } from 'react'; 
import { useAuth } from '../../context/authContext';
import * as chatService from '../../services/chatService';
import { UserChatInfoForList } from '../../services/chatService'; 
import { FiPlusCircle, FiUsers, FiMessageSquare, FiAlertCircle } from 'react-icons/fi';
import Swal from 'sweetalert2';

interface GruposProps {
  onChatSelect: (chatId: string) => void;
  activeChatId: string | null;
}

export default function Grupos({ onChatSelect, activeChatId }: GruposProps) {
  const { currentUser } = useAuth();
  const [chatList, setChatList] = useState<UserChatInfoForList[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser?.uid) {
      setIsLoading(false);
      setChatList([]); 
      return;
    }

    const handleLoading = (loadingState: boolean) => {
      setIsLoading(loadingState);
    };

    const handleError = (err: Error) => {
      console.error("Erro ao carregar conversas:", err);
      setError("Não foi possível carregar as conversas.");
      setIsLoading(false);
    };

    const handleChatUpdates = (updatedChats: UserChatInfoForList[]) => {
      updatedChats.sort((a, b) => {
        const timeA = a.lastMessageTimestamp || a.createdAt || 0;
        const timeB = b.lastMessageTimestamp || b.createdAt || 0;
        return timeB - timeA;
      });
      setChatList(updatedChats);
    };
    
    const unsubscribe = chatService.listenToUserChats(
      currentUser.uid,
      handleChatUpdates,
      handleError,
      handleLoading
    );

    return () => {
      unsubscribe();
      setChatList([]);
    };
  }, [currentUser?.uid]);

  const handleCreateGroup = async () => {
    if (!currentUser?.uid) return;

    const { value: groupName } = await Swal.fire({
      background: '#1E293B',
      color: '#E0E7FF',
      title: 'Criar Novo Grupo',
      input: 'text',
      inputLabel: 'Nome do Grupo',
      inputPlaceholder: 'Digite o nome do grupo...',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Criar Grupo',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3B82F6',
      cancelButtonColor: '#EF4444',
      customClass: {
        popup: 'bg-[#1E293B] text-blue-100 rounded-lg',
        title: 'text-blue-100',
        input: 'bg-[#0F172A] text-blue-100 border-blue-700 focus:ring-blue-500 focus:border-blue-500',
        inputLabel: 'text-blue-300',
        actions: 'gap-x-2',
      },
      inputValidator: (value) => {
        if (!value || value.trim().length === 0) {
          return 'Você precisa digitar um nome para o grupo!';
        }
        if (value.length > 50) {
            return 'O nome do grupo não pode ter mais de 50 caracteres.';
        }
      }
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
            title: 'Sucesso!',
            text: `Grupo "${groupName.trim()}" criado.`,
            icon: 'success',
            background: '#1E293B',
            color: '#E0E7FF',
            confirmButtonColor: '#3B82F6',
          });
        }
      } catch (e) {
        console.error("Erro ao criar grupo:", e);
        Swal.fire({
            title: 'Erro!',
            text: 'Não foi possível criar o grupo.',
            icon: 'error',
            background: '#1E293B',
            color: '#E0E7FF',
            confirmButtonColor: '#EF4444',
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="w-full md:w-[280px] lg:w-[320px] h-full flex-shrink-0 flex flex-col bg-[#0F172A] md:border-r border-blue-700 shadow-md md:shadow-none">
      <div className="px-4 py-3 w-full flex justify-between items-center border-b border-blue-700/50 md:pt-4">
        <h2 className="font-bold text-xl text-blue-100">
          Conversas
        </h2>
        <button
          onClick={handleCreateGroup}
          title="Criar Novo Grupo"
          className="p-2 text-blue-300 hover:text-blue-100 transition-colors rounded-full hover:bg-blue-700/50"
        >
          <FiPlusCircle size={24} className='cursor-pointer'/>
        </button>
      </div>

      {isLoading && (
         <div className="flex-grow flex items-center justify-center text-blue-400 mt-4">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Carregando...
        </div>
      )}

      {!isLoading && error && (
        <div className="flex-grow flex flex-col items-center justify-center text-red-400 p-4">
            <FiAlertCircle size={32} className="mb-2"/>
            <p className="text-center">{error}</p>
        </div>
      )}

      {!isLoading && !error && chatList.length === 0 && (
        <div className="flex-grow flex items-center justify-center text-blue-500 p-4">
            <p className="text-center">Nenhuma conversa. <br/> Crie um grupo para começar!</p>
        </div>
      )}

      {!isLoading && !error && chatList.length > 0 && (
        <div className="overflow-y-auto custom-scrollbar flex-grow">
          <ul className="space-y-px p-2 flex flex-col gap-1">
            {chatList.map((chat) => (
              <li
                key={chat.id}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-150 w-full cursor-pointer
                  ${activeChatId === chat.id ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-700/70 text-slate-300'}`}
                onClick={() => onChatSelect(chat.id)}
              >
                <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white text-lg font-semibold
                  ${chat.isGroup ? (activeChatId === chat.id ? 'bg-purple-400' : 'bg-purple-600') : (activeChatId === chat.id ? 'bg-green-400' : 'bg-green-600')}`}>
                  {chat.isGroup ? <FiUsers size={20}/> : (chat.displayName?.charAt(0).toUpperCase() || <FiMessageSquare size={20}/>) }
                </div>
                <div className="overflow-hidden flex-grow">
                  <p className={`text-sm font-medium truncate ${activeChatId === chat.id ? 'text-white' : 'text-slate-100'}`}>
                    {chat.displayName}
                  </p>
                  {chat.lastMessage && (
                    <p className={`text-xs truncate ${activeChatId === chat.id ? 'text-blue-100' : 'text-slate-400'}`}>
                      {chat.lastMessage}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}