/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ref,
  set,
  push,
  onValue,
  off,
  serverTimestamp,
  get,
  update,
  Unsubscribe,
  DataSnapshot,
  query,
  orderByChild,
} from "firebase/database";
import { db } from "./firebase";
import { getUserFromDatabase } from "./userService";

export interface ChatMetadata {
  id: string;
  name?: string;
  members: { [uid: string]: boolean };
  lastMessage?: string;
  lastMessageTimestamp?: number | object;
  createdAt: number | object;
  isGroup: boolean;
  creatorUid: string;
}

export interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName?: string;
  timestamp: number | object;
}

export interface UserChatInfoForList
  extends Omit<ChatMetadata, "members" | "lastMessageTimestamp" | "createdAt"> {
  id: string;
  displayName: string;
  displayPhoto?: string;
  lastMessageTimestamp?: number;
  createdAt: number;
}

export async function sendMessage(
  chatId: string,
  messageData: Omit<Message, "id" | "timestamp">
): Promise<void> {
  if (!chatId) throw new Error("chatId é obrigatório para enviar mensagem.");
  const messagesPath = `chats/${chatId}/messages`;
  const newMessageRef = push(ref(db, messagesPath));

  const fullMessageData = {
    ...messageData,
    id: newMessageRef.key!,
    timestamp: serverTimestamp(),
  };
  await set(newMessageRef, fullMessageData);

  const metadataUpdatePath = `chats/${chatId}/metadata`;
  await update(ref(db, metadataUpdatePath), {
    lastMessage: messageData.text,
    lastMessageTimestamp: serverTimestamp(),
  });
}

export function onMessages(
  chatId: string,
  callback: (messages: Message[]) => void
): Unsubscribe {
  const messagesQuery = query(
    ref(db, `chats/${chatId}/messages`),
    orderByChild("timestamp")
  );

  const listener = onValue(
    messagesQuery,
    (snapshot: DataSnapshot) => {
      const messages: Message[] = [];
      snapshot.forEach((childSnapshot) => {
        messages.push({
          ...childSnapshot.val(),
          id: childSnapshot.key,
        } as Message);
      });
      callback(messages);
    },
    (error) => {
      console.error("Erro ao ouvir mensagens:", error);
    }
  );

  return () => off(messagesQuery, "value", listener);
}

export function listenToUserChats(
  currentUserId: string,
  onUpdate: (chats: UserChatInfoForList[]) => void,
  onError: (error: Error) => void,
  onLoading: (loading: boolean) => void
): () => void {
  onLoading(true);
  const userChatsRef = ref(db, `userChats/${currentUserId}`);
  let activeMetadataListeners: { [chatId: string]: Unsubscribe } = {};

  const mainListener = onValue(
    userChatsRef,
    async (snapshot) => {
      Object.values(activeMetadataListeners).forEach((unsub) => unsub());
      activeMetadataListeners = {};

      if (!snapshot.exists() || !snapshot.hasChildren()) {
        onUpdate([]);
        onLoading(false);
        return;
      }

      const chatEntries = snapshot.val();
      const chatIds = Object.keys(chatEntries);
      const chatListPromises: Promise<UserChatInfoForList | null>[] = [];

      const processChat = async (
        chatId: string,
        initialLoad: boolean = false
      ) => {
        const chatMetadataRef = ref(db, `chats/${chatId}/metadata`);
        if (activeMetadataListeners[chatId]) {
          activeMetadataListeners[chatId]();
        }

        activeMetadataListeners[chatId] = onValue(
          chatMetadataRef,
          async (metadataSnapshot) => {
            if (metadataSnapshot.exists()) {
              const metadata = metadataSnapshot.val() as Omit<
                ChatMetadata,
                "id"
              >;
              let finalDisplayName = metadata.name || "Chat";
              let finalDisplayPhoto = metadata.isGroup
                ? "URL_FOTO_GRUPO_PADRAO"
                : "URL_FOTO_USUARIO_PADRAO";

              if (!metadata.isGroup && metadata.members) {
                const memberUids = Object.keys(metadata.members);
                const otherUserUid = memberUids.find(
                  (uid) => uid !== currentUserId
                );
                if (otherUserUid) {
                  try {
                    const otherUserProfile = await getUserFromDatabase(
                      otherUserUid
                    );
                    finalDisplayName =
                      otherUserProfile?.displayName || `Conversa`;
                    finalDisplayPhoto =
                      otherUserProfile?.photoURL || finalDisplayPhoto;
                  } catch (e) {
                    finalDisplayName = "Chat Privado";
                  }
                } else {
                  finalDisplayName = "Chat individual";
                }
              } else if (metadata.isGroup) {
                finalDisplayName = metadata.name || "Grupo";
              }

              const chatInfo: UserChatInfoForList = {
                ...metadata,
                id: chatId,
                displayName: finalDisplayName,
                displayPhoto: finalDisplayPhoto,
                createdAt:
                  typeof metadata.createdAt === "object"
                    ? Date.now()
                    : metadata.createdAt,
                lastMessageTimestamp:
                  typeof metadata.lastMessageTimestamp === "object"
                    ? Date.now()
                    : metadata.lastMessageTimestamp,
              };

              const currentChatSnap = await get(userChatsRef);
              if (currentChatSnap.exists()) {
                const allChatIds = Object.keys(currentChatSnap.val());
                const allChatInfoPromises = allChatIds.map(async (cId) => {
                  const metaSnap = await get(ref(db, `chats/${cId}/metadata`));
                  if (metaSnap.exists()) {
                    const meta = metaSnap.val() as Omit<ChatMetadata, "id">;
                    let dName = meta.name || "Chat";
                    if (!meta.isGroup && meta.members) {
                      const mUids = Object.keys(meta.members);
                      const oUid = mUids.find((u) => u !== currentUserId);
                      if (oUid) {
                        const oProfile = await getUserFromDatabase(oUid);
                        dName = oProfile?.displayName || `Conversa`;
                      }
                    } else if (meta.isGroup) dName = meta.name || "Grupo";
                    return {
                      ...meta,
                      id: cId,
                      displayName: dName,
                      createdAt: meta.createdAt as number,
                      lastMessageTimestamp: meta.lastMessageTimestamp as number,
                    } as UserChatInfoForList;
                  }
                  return null;
                });
                const updatedFullList = (
                  await Promise.all(allChatInfoPromises)
                ).filter((c) => c !== null) as UserChatInfoForList[];
                onUpdate(updatedFullList);
              }
            } else {
              const currentChatSnap = await get(userChatsRef);
              if (currentChatSnap.exists()) {
              } else {
                onUpdate([]);
              }
            }
          },
          onError
        );
      };

      chatIds.forEach((chatId) =>
        chatListPromises.push(
          get(ref(db, `chats/${chatId}/metadata`)).then(
            async (metadataSnapshot) => {
              if (metadataSnapshot.exists()) {
                processChat(chatId, true);
                const metadata = metadataSnapshot.val() as Omit<
                  ChatMetadata,
                  "id"
                >;
                let finalDisplayName = metadata.name || "Chat";
                if (!metadata.isGroup && metadata.members) {
                  const memberUids = Object.keys(metadata.members);
                  const otherUserUid = memberUids.find(
                    (uid) => uid !== currentUserId
                  );
                  if (otherUserUid) {
                    try {
                      const otherUserProfile = await getUserFromDatabase(
                        otherUserUid
                      );
                      finalDisplayName =
                        otherUserProfile?.displayName || `Conversa`;
                    } catch (e) {
                      finalDisplayName = "Chat Privado";
                    }
                  } else {
                    finalDisplayName = "Chat individual";
                  }
                } else if (metadata.isGroup) {
                  finalDisplayName = metadata.name || "Grupo";
                }

                return {
                  ...metadata,
                  id: chatId,
                  displayName: finalDisplayName,
                  createdAt: metadata.createdAt as number,
                  lastMessageTimestamp: metadata.lastMessageTimestamp as number,
                } as UserChatInfoForList;
              }
              return null;
            }
          )
        )
      );

      Promise.all(chatListPromises)
        .then((resolvedChats) => {
          const filteredChats = resolvedChats.filter(
            (c) => c !== null
          ) as UserChatInfoForList[];
          onUpdate(filteredChats);
          onLoading(false);
        })
        .catch((err) => {
          onError(err);
          onLoading(false);
        });
    },
    onError
  );

  return () => {
    off(userChatsRef, "value", mainListener);
    Object.values(activeMetadataListeners).forEach((unsub) => unsub());
  };
}

export async function createChatRoom(
  creatorUid: string,
  memberUids: string[],
  chatName?: string,
  isGroup: boolean = false
): Promise<string | null> {
  // Garante que o criador esteja na lista de membros
  if (!memberUids.includes(creatorUid)) {
    memberUids = [...memberUids, creatorUid];
  }

  // Validação para grupos
  if (isGroup && !chatName) {
    throw new Error("Nome do chat é obrigatório para criar um grupo.");
  }

  // Criação do ID do chat
  const chatId = isGroup
    ? push(ref(db, "chats")).key
    : `${memberUids.sort().join("_")}`;

  if (!chatId) {
    throw new Error("Falha ao gerar ID de chat");
  }

  const members = memberUids.reduce(
    (acc, uid) => ({ ...acc, [uid]: true }),
    {}
  );

  const chatMetadata: ChatMetadata = {
    id: chatId,
    name: chatName,
    members,
    createdAt: serverTimestamp(),
    isGroup,
    creatorUid, 
    lastMessage: isGroup ? "Grupo criado!" : "Chat iniciado!",
    lastMessageTimestamp: serverTimestamp(),
  };

  // Atualizações atômicas
  const updates: Record<string, any> = {
    [`chats/${chatId}/metadata`]: chatMetadata,
  };

  // Adiciona aos userChats de cada membro
  memberUids.forEach((uid) => {
    updates[`userChats/${uid}/${chatId}`] = true;
  });

  try {
    await update(ref(db), updates);
    return chatId;
  } catch (error) {
    console.error("Erro ao criar chat:", error);
    throw error;
  }
}

export async function addMembersToGroup(
  chatId: string,
  newMemberUids: string[]
): Promise<void> {
  // Verificação inicial
  if (!chatId || !newMemberUids?.length) {
    throw new Error("Parâmetros inválidos");
  }

  // Obtém os metadados atuais
  const metadataRef = ref(db, `chats/${chatId}/metadata`);
  const snapshot = await get(metadataRef);

  if (!snapshot.exists()) {
    throw new Error("Grupo não encontrado");
  }

  const metadata = snapshot.val() as ChatMetadata;

  if (!metadata.isGroup) {
    throw new Error("Apenas grupos podem ter membros adicionados");
  }

  // Filtra membros que já existem
  const existingMembers = Object.keys(metadata.members || {});
  const membersToAdd = newMemberUids.filter(
    (uid) => !existingMembers.includes(uid)
  );

  if (!membersToAdd.length) {
    return; // Nenhum membro novo para adicionar
  }

  // Prepara atualizações
  const updates: Record<string, any> = {};

  // Adiciona novos membros
  membersToAdd.forEach((uid) => {
    updates[`chats/${chatId}/metadata/members/${uid}`] = true;
    updates[`userChats/${uid}/${chatId}`] = true;
  });

  // Atualiza lastMessageTimestamp
  updates[`chats/${chatId}/metadata/lastMessage`] = "Novos membros adicionados";
  updates[`chats/${chatId}/metadata/lastMessageTimestamp`] = serverTimestamp();

  try {
    await update(ref(db), updates);
  } catch (error) {
    console.error("Erro ao adicionar membros:", error);
    throw new Error("Não foi possível adicionar os membros ao grupo");
  }
}
