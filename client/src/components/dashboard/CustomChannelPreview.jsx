import { Card, CardHeader } from "@/components/ui/card";
import { Avatar, useChatContext } from "stream-chat-react";

export default function CustomChannelPreview({ channel, setActiveChannel }) {
  const { client } = useChatContext();
  const { name, image } = channel.data || {};
  const members = Object.values(channel.state.members);
  const otherMembers = members.filter(
    (member) => member.user?.id !== client.userID
  );
  const displayName =
    name ||
    otherMembers
      .map((member) => member.user?.name || member.user?.id)
      .join(", ");

  return (
    <Card
      className="mx-3 mb-2 cursor-pointer hover:bg-gray-100 transition-colors"
      onClick={() => setActiveChannel(channel)}
    >
      <CardHeader className="p-3 flex flex-row justify-start items-center space-x-3">
        <Avatar image={image} name={displayName} size={40} shape="rounded" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800 truncate">
            {displayName}
          </p>
          <p className="text-xs text-gray-500 truncate">
            {channel.state.messages[channel.state.messages.length - 1]?.text ||
              "No messages yet"}
          </p>
        </div>
      </CardHeader>
    </Card>
  );
}
