/* eslint-disable react/prop-types */
import { useState } from "react";
import { Button } from "../ui/button"; 
import { Input } from "../ui/input"; 
import {Toggle} from "../ui/Toggle";




export default function CreateGroupModal({ client, onClose, onGroupCreated }) {
  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState([]);
  const [isPrivate, setIsPrivate] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [debounceTimeout, setDebounceTimeout] = useState(null);

  // Debounced user search
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
    setMembers((prevMembers) => prevMembers.filter((user) => user.id !== userId));
  };

  // Updated handleCreateGroup function
  const handleCreateGroup = async () => {
    if (!client) {
      console.error("Chat client not initialized");
      return;
    }

    const memberIds = members.map((member) => member.id);
    const channelType = "messaging";
    
    // Generate a unique and valid channel ID
    const channelId = `${groupName.trim().toLowerCase().replace(/[^a-zA-Z0-9-_!]/g, "-")}-${Date.now()}`;
    
    const channel = client.channel(channelType, channelId, {
      name: groupName, // This is the display name and can contain spaces
      members: memberIds,
      distinct: false, // Ensures multiple channels with the same members can be created
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6">
        <h2 className="text-lg font-semibold mb-4">Create a New Group</h2>

        <Input
          placeholder="Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="mb-4"
        />

        <Input
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="mb-4"
        />

{searchTerm.trim() && searchResults.length > 0 && (
  <div className="max-h-40 overflow-y-auto mb-4 border border-gray-300 rounded p-2">
    {searchResults.map((user) => (
      <div
        key={user.id}
        className="flex items-center justify-between p-2 hover:bg-gray-100 cursor-pointer"
        onClick={() => addMember(user)}
      >
        <span>{user.name || user.id}</span>
        <Button size="sm">Add</Button>
      </div>
    ))}
  </div>
)}



<div className="mb-4">
  {members.length > 0 && (
    <>
      <h4 className="font-medium mb-2">Selected Members:</h4>
      <div className="max-h-24 overflow-y-auto border border-gray-300 rounded p-2">
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
      </div>
    </>
  )}
</div>
{/* 
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            checked={isPrivate}
            onChange={() => setIsPrivate(!isPrivate)}
            id="private-group"
            className="mr-2"
          />
          <label htmlFor="private-group" className="ml-2">
            Private Group
          </label>
        </div> */}
<div className="mb-4 flex items-center">
  <Toggle isChecked={isPrivate} onChange={() => setIsPrivate(!isPrivate)} />
  <span className="ml-3">Private Group</span>
</div>

        <div className="flex justify-end">
          <Button onClick={handleCreateGroup} className="mr-2">
            Create Group
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}

