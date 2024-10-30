/* eslint-disable react/prop-types */
import { useState, useEffect, useContext } from "react";
import { StreamChat } from "stream-chat";
import {
  Chat,
  Channel,
  ChannelList,
  Window,
  MessageList,
  MessageInput,
  Thread,
  LoadingIndicator,
  Avatar,
  useChatContext,
  useChannelStateContext,
} from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";

import { Card, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import stripSpecialCharacters from "@/utils/stripSpecialCharacters";
import { AppContext } from "@/utils/store/appContext";
import { Users } from "lucide-react";

const apiKey = "g6dm9he8gx4q";

// chat preview on left hand side
const CustomChannelPreview = ({ channel, setActiveChannel }) => {
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
};

const CustomChannelHeader = () => {
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

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200">
      <div className="flex items-center space-x-3">
        <Avatar
          image={
            isOneToOneChat ? otherMembers[0]?.user?.image : channel.data?.image
          }
          name={displayName}
          size={40}
          shape="rounded"
        />
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{displayName}</h2>
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
};

export default function Dashboard() {
  const _ctx = useContext(AppContext);
  const [client, setClient] = useState(null);

  const userId = stripSpecialCharacters(_ctx.email);
  const userToken = _ctx.streamToken;

  useEffect(() => {
    const initChat = async () => {
      const chatClient = StreamChat.getInstance(apiKey);
      await chatClient.connectUser({ id: userId }, userToken);
      setClient(chatClient);
    };

    initChat();

    return () => {
      if (client) client.disconnectUser();
    };
  }, [client, userId, userToken]);

  if (!client) return <LoadingIndicator size={40} />;

  return (
    <Chat client={client} theme="messaging light">
      <div className="w-full flex h-screen bg-white">
        <div className="w-1/4 border-r border-gray-200 flex flex-col">
          <ScrollArea className="flex-1">
            <ChannelList
              filters={{ members: { $in: [userId] } }}
              sort={{ last_message_at: -1 }}
              Preview={CustomChannelPreview}
              showChannelSearch
            />
          </ScrollArea>
        </div>
        <div className="flex-1 flex flex-col">
          <Channel>
            <Window>
              <CustomChannelHeader />
              <MessageList />
              <MessageInput />
            </Window>
            <Thread />
          </Channel>
        </div>
      </div>
    </Chat>
  );
}



// import React from "react";
// import ChatSideBar from "../components/chatComponents/ChatSideBar";
// import MessageList from "../components/chatComponents/MessageList";
// import MessageInput from "../components/chatComponents/MessageInput";
// import ChatHeader from "@/components/chatComponents/ChatHeader";

// const Dashboard = () => {
//   return (
//     <div className="flex h-screen w-screen">
//       {/* Sidebar */}
//       <ChatSideBar />

//       {/* Main Chat Area */}
//       <div className="flex-1 flex flex-col">
//         {/* Chat Header */}
//         {/* <div className="p-4 border-b border-gray-200 flex items-center justify-between">
//           <h2 className="text-lg font-semibold">Hazel</h2>
//           <span className="text-sm text-gray-500">Status: Online</span>
//         </div> */}
//         <ChatHeader />

//         {/* Messages List */}
//         <MessageList />

//         {/* Message Input */}
//         <MessageInput />
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

