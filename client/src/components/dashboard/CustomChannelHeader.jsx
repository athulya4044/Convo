import {
  Avatar,
  useChannelStateContext,
  useChatContext,
} from "stream-chat-react";
import { Users } from "lucide-react";
import { logoConvo } from "@/assets/images";

export default function CustomChannelHeader() {
  const { channel } = useChannelStateContext();
  const { client } = useChatContext();

  const members = Object.values(channel.state.members);
  const otherMembers = members.filter(
    (member) => member.user?.id !== client.userID
  );
  const isOneToOneChat = members.length === 2;

  const displayName = isOneToOneChat
    ? otherMembers
        .map((member) => member.user?.name || member.user?.id)
        .join(", ")
    : channel.data?.name || "Unnamed Group";
  const memberCount = members.length;

  const isAIChannel = channel.id.includes("convoAI"); 
  
  const status = isOneToOneChat
    ? otherMembers[0]?.user?.online
      ? "Online"
      : "Offline"
    : null;

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200">
      <div className="flex items-center space-x-3">
        <Avatar
          image={
            isAIChannel
              ? logoConvo
              : isOneToOneChat
              ? otherMembers[0]?.user?.image
              : channel.data?.image
          }
          name={displayName}
          size={40}
          shape="rounded"
        />
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{displayName}</h2>
          {isOneToOneChat && (
            <p
              className={`text-sm flex items-center ${
                status === "Online" ? "text-green-600" : "text-gray-500"
              }`}
            >
              {status}
            </p>
          )}
          {!isOneToOneChat && (
            <p className="text-sm text-gray-500 flex items-center">
              <Users className="w-4 h-4 mr-1" />
              {memberCount} {memberCount === 1 ? "member" : "members"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
