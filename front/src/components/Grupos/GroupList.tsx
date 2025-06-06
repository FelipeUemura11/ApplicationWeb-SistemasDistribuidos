import { useState, useRef, useEffect } from "react";
import { FiUsers, FiMessageSquare, FiMoreVertical } from "react-icons/fi";
import { handleAddMembers } from "../../hooks/groupsHooks/handleAddMembers";
import { UserChatInfoForList } from "../../services/chatService";

interface Props {
  activeChatId: string | null;
  chatList: UserChatInfoForList[];
  onChatSelect: (chatId: string) => void;
}

export default function GroupList({ activeChatId, chatList, onChatSelect }: Props) {
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  return (
    <div className="custom-scrollbar overflow-y-auto flex-grow md:min-h-[540px] h-full">
      <ul className="space-y-px p-2 flex flex-col gap-1">
        {chatList.map((chat) => (
          <li
            key={chat.id}
            className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-150 w-full cursor-pointer relative
                  ${activeChatId === chat.id
                ? "bg-blue-600 text-white shadow-md"
                : "hover:bg-slate-700/70 text-slate-300"
              }`}
            onClick={() => onChatSelect(chat.id)}
          >
            <div
              className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white text-lg font-semibold
                  ${chat.isGroup
                  ? activeChatId === chat.id
                    ? "bg-purple-400"
                    : "bg-purple-600"
                  : activeChatId === chat.id
                    ? "bg-green-400"
                    : "bg-green-600"
                }`}
            >
              {chat.isGroup ? (
                <FiUsers size={20} />
              ) : (
                chat.displayName?.charAt(0).toUpperCase() || (
                  <FiMessageSquare size={20} />
                )
              )}
            </div>
            <div className="overflow-hidden flex-grow">
              <p
                className={`text-sm font-medium truncate ${activeChatId === chat.id ? "text-white" : "text-slate-100"
                  }`}
              >
                {chat.displayName}
              </p>
              {chat.lastMessage && (
                <p
                  className={`text-xs truncate ${activeChatId === chat.id
                      ? "text-blue-100"
                      : "text-slate-400"
                    }`}
                >
                  {chat.lastMessage}
                </p>
              )}
            </div>
            {chat.isGroup && (
              <div className="relative z-90">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(menuOpen === chat.id ? null : chat.id);
                  }}
                  className="text-blue-300 hover:text-blue-100 p-1 rounded-full hover:bg-blue-700/40"
                >
                  <FiMoreVertical size={18} />
                </button>
                {menuOpen === chat.id && (
                  <div
                    ref={menuRef}
                    className="absolute right-0 mt-2 w-48 bg-[#1E293B] border border-blue-700 rounded-md shadow-lg p-2 text-sm text-blue-100 z-30"
                  >
                    <button
                      onClick={() => handleAddMembers(chat.id)}
                      className="w-full text-left hover:bg-blue-700/30 p-2 rounded cursor-pointer"
                    >
                      Adicionar Contatos
                    </button>
                  </div>
                )}

              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
