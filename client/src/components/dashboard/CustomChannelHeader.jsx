/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import {
  Avatar,
  useChannelStateContext,
  useChatContext,
} from "stream-chat-react";
import { Users } from "lucide-react";
import { logoConvo } from "@/assets/images";
import { FaVideo } from "react-icons/fa";
export default function CustomChannelHeader({ activeTab, setActiveTab }) {
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

  const [status, setStatus] = useState(
    isOneToOneChat && !isAIChannel
      ? otherMembers[0]?.user?.online
        ? "Online"
        : "Offline"
      : null
  );

  useEffect(() => {
    if (isOneToOneChat) {
      const updateStatus = () => {
        const lastActive = new Date(otherMembers[0]?.user?.last_active);
        const now = new Date();
        const timeDifference = now - lastActive;
        const isOnline = timeDifference <= 60 * 1000;
        setStatus(isOnline ? "Online" : "Offline");
      };
      updateStatus();
      const handleUserUpdate = (event) => {
        if (event.user.id === otherMembers[0]?.user?.id) {
          updateStatus();
        }
      };
      client.on("user.updated", handleUserUpdate);
      client.on("user.presence.changed", handleUserUpdate);
      return () => {
        client.off("user.updated", handleUserUpdate);
        client.off("user.presence.changed", handleUserUpdate);
      };
    }
  }, [client, isOneToOneChat, otherMembers]);

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200">
      {/* Left Side - Avatar and Display Name */}
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
          {status && (
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

      {/* Centered Tabs */}
      <div className="flex-1 flex justify-center space-x-4">
        {["chat", "share", "about"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === tab
                ? "text-purple-900 border-b-2 border-purple-900"
                : "text-gray-500 hover:text-gray-700 border-b-2 border-transparent"
            } focus:outline-none`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Right Side - Video Call Icon */}
      <div className="flex items-center space-x-3 mr-6">
        <button
          className="text-gray-500 hover:text-gray-700 focus:outline-none"
          onClick={() => alert("Initiate Video Call")} // Replace with your video call handler
          title="Start Video Call"
        >
          <FaVideo size={20} />
        </button>
      </div>
    </div>
  );
}
