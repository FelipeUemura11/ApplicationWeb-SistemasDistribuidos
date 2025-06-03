/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import {
  acceptFriendRequest,
  declineFriendRequest,
} from "../../services/friendRequest";
import { fetchFriendRequests } from "../../services/friendRequest";

export default function FriendRequests({ currentUser }: { currentUser: any }) {
  const [friendRequests, setFriendRequests] = useState<any[]>([]);

  useEffect(() => {
    const fetchRequests = async () => {
      if (currentUser?.uid) {
        const requests = await fetchFriendRequests(currentUser.uid);
        setFriendRequests(requests);
      }
    };

    fetchRequests();
  }, [currentUser?.uid]);

  return (
    <>
      <div className="text-left mt-10">
        <h3 className="text-lg font-semibold text-blue-300 mb-3 ml-2">
          Pedidos de Amizade
        </h3>

        {friendRequests.length > 0 ? (
          <ul className="space-y-2 max-h-52 overflow-y-auto custom-scrollbar px-2">
            {friendRequests.map((req) => (
              <li
                key={req.requesterId}
                className="p-3 rounded-lg bg-[#0F172A] border border-blue-700 flex justify-between items-center hover:bg-blue-800/30 transition"
              >
                <div>
                  <p className="font-medium text-blue-100">
                    {req.requesterDisplayName || req.requesterId}
                  </p>
                  <p className="text-sm text-blue-400">Status: {req.status}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={async () => {
                      if (currentUser?.uid) {
                        await acceptFriendRequest(
                          req.requesterId,
                          currentUser.uid
                        );
                        setFriendRequests((prev) =>
                          prev.filter((r) => r.requesterId !== req.requesterId)
                        );

                        location.reload(); 
                      }
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white px-2 cursor-pointer py-1 rounded text-lg flex items-center justify-center"
                    title="Aceitar"
                  >
                    <FaCheck />
                  </button>

                  <button
                    onClick={async () => {
                      if (currentUser?.uid) {
                        await declineFriendRequest(
                          req.requesterId,
                          currentUser.uid
                        );
                        setFriendRequests((prev) =>
                          prev.filter((r) => r.requesterId !== req.requesterId)
                        );
                      }
                    }}
                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 cursor-pointer rounded text-lg flex items-center justify-center"
                    title="Recusar"
                  >
                    <FaTimes />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-blue-400 ml-2">Nenhum pedido recebido.</p>
        )}
      </div>
    </>
  );
}
