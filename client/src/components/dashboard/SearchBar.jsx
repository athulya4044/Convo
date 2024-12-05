import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, User, Users, MessageCircle, Search, X, Mic } from "lucide-react";

export default function SearchBar({ client, userId, navigateToChat }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Initialize the speech recognition object once
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearchTerm(transcript);
        handleSearch(transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };
    } else {
      console.warn("Speech Recognition API is not supported in this browser.");
    }

    // Cleanup on unmount
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults(null);
      return;
    }

    setLoading(true);

    try {
      const [userResponse, channelResponse, messageResponse] =
        await Promise.all([
          client.queryUsers(
            { name: { $autocomplete: query } },
            { id: 1 },
            { limit: 5 }
          ),
          client.queryChannels(
            {
              name: { $autocomplete: query },
              members: { $in: [userId] },
            },
            [{ last_message_at: -1 }],
            { limit: 5 }
          ),
          client.search({ members: { $in: [userId] } }, query, {
            limit: 5,
          }),
        ]);

      const filteredUsers = userResponse.users.filter(
        (user) => user.id !== userId
      );

      setSearchResults({
        users: filteredUsers || [],
        channels: channelResponse || [],
        messages: messageResponse.results || [],
      });
    } catch (error) {
      console.error("Error during search:", error);
    }

    setLoading(false);
  };

  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchTerm(query);

    if (debounceTimeout) clearTimeout(debounceTimeout);

    const timeout = setTimeout(() => handleSearch(query), 300);
    setDebounceTimeout(timeout);
  };

  const handleResultClick = (result) => {
    setSearchTerm("");
    setSearchResults(null);
    navigateToChat(result);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSearchResults(null);
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
    }
  };

  const renderResults = () => {
    if (!searchResults) return null;

    const { users, channels, messages } = searchResults;

    return (
      <ScrollArea className="bg-white border rounded-lg shadow-md">
        {users.length > 0 && (
          <div className="p-3 border-b">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User size={18} /> Users
            </h3>
            {users.map((user) => (
              <div
                key={user.id}
                className="flex justify-start items-center cursor-pointer py-2 hover:bg-secondary-foreground"
                onClick={() => handleResultClick({ channelId: user.id })}
              >
                {user.name} - @{user.id}
              </div>
            ))}
          </div>
        )}
        {channels.length > 0 && (
          <div className="p-3 border-b">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Users size={18} /> Groups
            </h3>
            {channels.map((channel) => (
              <div
                key={channel.id}
                className="cursor-pointer py-2 hover:bg-secondary-foreground"
                onClick={() => handleResultClick({ channelId: channel.id })}
              >
                {channel.data.name || channel.id}
              </div>
            ))}
          </div>
        )}
        {messages.length > 0 && (
          <div className="p-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <MessageCircle size={18} /> Messages
            </h3>
            {messages.map(({ message }) => (
              <div
                key={message.id}
                className="py-2 cursor-pointer hover:bg-gray-100"
                onClick={() =>
                  handleResultClick({
                    channelId: message.channel.id,
                    messageId: message.id,
                  })
                }
              >
                <strong>{message.user?.name || message.user?.id}: </strong>
                {message.text}
              </div>
            ))}
          </div>
        )}
        {users.length === 0 &&
          channels.length === 0 &&
          messages.length === 0 && (
            <div className="p-3 text-center text-gray-500">
              No results found :(
            </div>
          )}
      </ScrollArea>
    );
  };

  return (
    <div className="relative">
      <div className="relative flex items-center">
        <Search className="absolute left-3 text-gray-500" size={18} />
        <Input
          className="w-full pl-10 pr-10 bg-white border-secondary border-2"
          placeholder="Search for users,groups or messages"
          value={searchTerm}
          onChange={handleInputChange}
        />
        {!loading && searchTerm && (
          <button
            className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
            onClick={clearSearch}
          >
            <X size={18} />
          </button>
        )}
        <button
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 ${
            isListening ? "text-red-500" : "hover:text-gray-700"
          }`}
          onClick={startListening}
        >
          <Mic size={18} />
        </button>
        {loading && (
          <div className="absolute right-16">
            <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
          </div>
        )}
      </div>
      {renderResults()}
    </div>
  );
}
