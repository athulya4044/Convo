/* eslint-disable react/prop-types */
import { useState } from "react";


export default function CreateGroupModal ({ client, onClose, onGroupCreated }) {
    const [groupName, setGroupName] = useState("");
    const [members, setMembers] = useState([]);
    const [isPrivate, setIsPrivate] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
  
    const handleSearch = async (term) => {
      setSearchTerm(term);
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
    };
  
    const addMember = (user) => {
      if (!members.some((member) => member.id === user.id)) {
        setMembers((prevMembers) => [...prevMembers, user]);
      }
    };
  
    const removeMember = (userId) => {
      setMembers((prevMembers) => prevMembers.filter((user) => user.id !== userId));
    };
  
    const handleCreateGroup = async () => {
      if (!client) {
        console.error("Chat client not initialized");
        return;
      }
  
      const memberIds = members.map((member) => member.id);
      const channelType = "messaging"; 
      const channel = client.channel(channelType, {
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
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0, 
        backgroundColor: "rgba(0, 0, 0, 0.5)", display: "flex", 
        justifyContent: "center", alignItems: "center"
      }}>
        <div style={{
          backgroundColor: "white", padding: "20px", borderRadius: "8px", 
          width: "400px", textAlign: "center"
        }}>
          <h2>Create a New Group</h2>
  
          <input
            type="text"
            placeholder="Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            style={{ marginBottom: "10px", width: "100%", padding: "8px" }}
          />
  
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ marginBottom: "10px", width: "100%", padding: "8px" }}
          />
  
          <div style={{ maxHeight: "150px", overflowY: "auto", marginBottom: "10px", border: "1px solid #ddd", padding: "5px" }}>
            {searchResults.map((user) => (
              <div
                key={user.id}
                style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "5px", cursor: "pointer", borderBottom: "1px solid #ddd"
                }}
                onClick={() => addMember(user)}
              >
                <span>{user.name || user.id}</span>
                <button style={{ padding: "4px 8px" }}>Add</button>
              </div>
            ))}
          </div>
  
          <div style={{ marginBottom: "10px" }}>
            <h4>Selected Members:</h4>
            {members.map((member) => (
              <div key={member.id} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "5px", borderBottom: "1px solid #ddd"
              }}>
                <span>{member.name || member.id}</span>
                <button onClick={() => removeMember(member.id)} style={{ padding: "4px 8px" }}>Remove</button>
              </div>
            ))}
          </div>
  
          <div style={{ marginBottom: "10px" }}>
            <label>
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={() => setIsPrivate(!isPrivate)}
              />
              Private Group
            </label>
          </div>
  
          <button 
            onClick={handleCreateGroup} 
            style={{ marginRight: "10px", padding: "8px 12px" }}
          >
            Create Group
          </button>
          <button onClick={onClose} style={{ padding: "8px 12px" }}>Cancel</button>
        </div>
      </div>
    );
  };