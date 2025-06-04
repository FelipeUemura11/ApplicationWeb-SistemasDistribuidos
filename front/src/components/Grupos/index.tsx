/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";
import * as chatService from "../../services/chatService";
import { UserChatInfoForList } from "../../services/chatService";
import Loading from "./Loading";
import GroupError from "./GroupError";
import GroupList from "./GroupList";
import GroupHeader from "./GroupHeader";

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

  return (
    <div className="w-full md:w-[280px] lg:w-[320px] h-full flex-shrink-0 flex flex-col bg-[#0F172A] md:border-r border-blue-700 shadow-md md:shadow-none">
      <GroupHeader
        onChatSelect={onChatSelect}
        setIsLoading={setIsLoading}
        currentUser={currentUser}
      />

      {isLoading ? (
        <Loading />
      ) : error ? (
        <GroupError error={error} />
      ) : chatList.length === 0 ? (
        <div className="flex-grow flex items-center justify-center text-blue-500 p-4">
          <p className="text-center">
            Nenhuma conversa. <br /> Crie um grupo para começar!
          </p>
        </div>
      ) : (
        <GroupList
          chatList={chatList}
          activeChatId={activeChatId}
          onChatSelect={onChatSelect}
        />
      )}
    </div>
  );
}
