import { useState, useEffect } from "react";
import { useChannelStateContext } from "stream-chat-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaPaperPlane,
  FaClock,
  FaCommentDots,
  FaMicrophone,
  FaMicrophoneSlash,
} from "react-icons/fa";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

const About = () => {
  const { channel } = useChannelStateContext();
  const [message, setMessage] = useState(""); // Input value
  const [isTypingManually, setIsTypingManually] = useState(false); // Tracks manual typing
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  // Sync speech-to-text transcript with the input field
  useEffect(() => {
    if (listening && !isTypingManually) {
      setMessage(transcript);
    }
  }, [transcript, listening, isTypingManually]);

  // Format the last seen time
  const getLastSeen = (lastActive) => {
    if (!lastActive) return "Not available";
    const diff = Date.now() - new Date(lastActive).getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    return days > 2 ? `${days} days ago` : "48+ hours ago";
  };

  if (!channel || !channel._client) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-500">
          Loading chat members&apos; information...
        </p>
      </div>
    );
  }

  const members = Object.values(channel.state?.members || {});
  const isOneOnOneChat = members.length === 2;
  const filteredMembers = isOneOnOneChat
    ? members.filter((member) => member.user?.id !== channel._client.userID)
    : members;

  if (filteredMembers.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-500">No members found in this chat.</p>
      </div>
    );
  }

  const handleSendMessage = () => {
    if (message.trim() && channel) {
      channel.sendMessage({ text: message });
      setMessage(""); // Clear the input
      resetTranscript(); // Clear the transcript
      setIsTypingManually(false); // Reset manual typing state
    }
  };

  if (!browserSupportsSpeechRecognition) {
    return <p>Your browser does not support speech recognition. Use Chrome or Edge.</p>;
  }

  return (
    <div className="p-6 bg-white rounded-lg">
      {/* Group Members Header */}
      {!isOneOnOneChat && (
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          Group Members
        </h1>
      )}

      {/* Members List */}
      {filteredMembers.map((member) => {
        const { user } = member;
        const name = user?.name || "Name not available";
        const email = user?.email || "Email not available";
        const phoneNumber = user?.phoneNumber || null;
        const aboutMe = user?.aboutMe || null;
        const imageUrl = user?.image_url || null;

        return (
          <div
            key={user?.id}
            className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200"
          >
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16 border-2 border-gray-300 rounded-full shadow-sm">
                <AvatarImage src={imageUrl} alt={name} />
                <AvatarFallback className="bg-primary text-white rounded-full">
                  {name?.[0] || "?"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">{name}</h2>
                <div className="flex flex-col text-sm text-gray-600 mt-1">
                  {email && (
                    <div className="flex items-center">
                      <FaEnvelope className="mr-1 text-gray-500" />
                      <span>{email}</span>
                    </div>
                  )}
                  {phoneNumber && (
                    <div className="flex items-center">
                      <FaPhoneAlt className="mr-1 text-gray-500" />
                      <span>{phoneNumber}</span>
                    </div>
                  )}
                  {aboutMe && (
                    <div className="flex items-center mt-1">
                      <FaCommentDots className="mr-1 text-gray-500" />
                      <span>{aboutMe}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Last Seen */}
      {isOneOnOneChat && (
        <div className="p-4 bg-gray-100 border border-gray-300 rounded-lg mt-4">
          <div className="flex items-center space-x-2">
            <FaClock className="text-yellow-500" />
            <div>
              <p className="text-sm font-medium text-gray-800">
                Last seen {getLastSeen(filteredMembers[0]?.user?.last_active)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="mt-6 relative">
        <input
          type="text"
          placeholder="Send a quick message..."
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            setIsTypingManually(true); // Mark as manual typing
          }}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          className="w-full border border-gray-300 rounded-lg p-3 pl-12 pr-24 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
        />
        {/* Microphone Button */}
        <button
          onClick={() => {
            if (listening) {
              SpeechRecognition.stopListening();
            } else {
              SpeechRecognition.startListening();
              resetTranscript(); // Clear transcript on start
              setIsTypingManually(false); // Allow speech to update input
            }
          }}
          className={`absolute left-3 top-1/2 transform -translate-y-1/2 p-2 rounded-full ${
            listening ? "bg-red-500 text-white" : "bg-gray-200 text-gray-700"
          } hover:bg-gray-300`}
        >
          {listening ? <FaMicrophoneSlash /> : <FaMicrophone />}
        </button>
        {/* Send Button */}
        <button
          onClick={handleSendMessage}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-primary text-white p-2 rounded-full hover:bg-purple-700 transition-colors"
        >
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
};

export default About;

