/* eslint-disable react/prop-types */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function CreateGroupModal({
  client,
  isOpen,
  onClose,
  onGroupCreated,
}) {
  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState([]);
  const [isPrivate, setIsPrivate] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [debounceTimeout, setDebounceTimeout] = useState(null);

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (debounceTimeout) clearTimeout(debounceTimeout);

    const newTimeout = setTimeout(async () => {
      if (term.trim() === "") {
        setSearchResults([]);
        return;
      }

      try {
        const response = await client.queryUsers({
          id: { $autocomplete: term },
        });
        setSearchResults(response.users);
      } catch (error) {
        console.error("Error searching users:", error);
      }
    }, 300);

    setDebounceTimeout(newTimeout);
  };

  const addMember = (user) => {
    if (!members.some((member) => member.id === user.id)) {
      setMembers((prevMembers) => [...prevMembers, user]);
    }
  };

  const removeMember = (userId) => {
    setMembers((prevMembers) =>
      prevMembers.filter((user) => user.id !== userId)
    );
  };

  const handleCreateGroup = async () => {
    if (!client) {
      console.error("Chat client not initialized");
      return;
    }

    const memberIds = members.map((member) => member.id);
    const channelType = "messaging";

    const channelId = `${groupName
      .trim()
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-_!]/g, "-")}-${Date.now()}`;

    const channel = client.channel(channelType, channelId, {
      name: groupName,
      members: memberIds,
      distinct: false,
    });

    try {
      const response = await channel.create();
      console.log("Channel created successfully:", response);
      onGroupCreated(channel);
      onClose();
    } catch (error) {
      console.error("Error creating channel:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a New Group</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Input
              id="group-name"
              placeholder="Group Name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="col-span-4"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Input
              id="search-users"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="col-span-4"
            />
          </div>
          {searchTerm.trim() && searchResults.length > 0 && (
            <ScrollArea className="h-[200px] w-full rounded-md border p-4">
              {searchResults.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-2 hover:bg-accent rounded-md cursor-pointer"
                  onClick={() => addMember(user)}
                >
                  <span>{user.name || user.id}</span>
                  <Button size="sm">Add</Button>
                </div>
              ))}
            </ScrollArea>
          )}
          {members.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Selected Members:</h4>
              <ScrollArea className="h-[100px] w-full rounded-md border p-4">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-2"
                  >
                    <span>{member.name || member.id}</span>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => removeMember(member.id)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </ScrollArea>
            </div>
          )}
          <div className="flex items-center space-x-2">
            <Toggle pressed={isPrivate} onPressedChange={setIsPrivate} />
            <span>Private Group</span>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleCreateGroup}>Create Group</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
