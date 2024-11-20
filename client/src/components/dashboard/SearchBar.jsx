/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, User, Users, MessageCircle } from "lucide-react";

export default function SearchBar({ client, userId }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [debounceTimeout, setDebounceTimeout] = useState(null);

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
            { name: { $autocomplete: query } },
            { last_message_at: -1 },
            { limit: 5 }
          ),
          client.search({ members: { $in: [userId] } }, query, {
            limit: 5,
          }),
        ]);

      setSearchResults({
        users: userResponse.users || [],
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

    // Clear any existing debounce timeout
    if (debounceTimeout) clearTimeout(debounceTimeout);

    // Set a new debounce timeout
    const timeout = setTimeout(() => handleSearch(query), 300);
    setDebounceTimeout(timeout);
  };

  const renderResults = () => {
    if (!searchResults) return null;

    const { users, channels, messages } = searchResults;

    return (
      <ScrollArea className="absolute overflow-y-auto top-full left-0 right-0 z-99 mt-1 max-h-96 bg-white border rounded-lg shadow-md">
        {users.length > 0 && (
          <div className="p-3 border-b">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User size={18} /> Users
            </h3>
            {users.map((user) => (
              <div key={user.id} className="py-2">
                {user.name || user.id}
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
              <div key={channel.id} className="py-2">
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
              <div key={message.id} className="py-2">
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

  useEffect(() => {
    return () => {
      // Clean up debounce timeout on component unmount
      if (debounceTimeout) clearTimeout(debounceTimeout);
    };
  }, [debounceTimeout]);

  return (
    <div className="z-10 absolute top-3 ml-4 w-[calc(100vw-22rem)]">
      <Input
        className="w-full bg-secondary-foreground"
        placeholder="Search for users, groups, or messages"
        value={searchTerm}
        onChange={handleInputChange}
      />
      {loading && (
        <div className="absolute right-4 top-2.5">
          <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
        </div>
      )}
      {renderResults()}
    </div>
  );
}
