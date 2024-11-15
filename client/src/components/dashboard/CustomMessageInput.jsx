import { MessageInput, useChannelStateContext } from "stream-chat-react";
import { uploadFile } from "../../utils/uploadFile";
import { useState } from "react";

function CustomMessageInput() {
  const { channel } = useChannelStateContext();
  const [selectedAttachments, setSelectedAttachments] = useState([]);

  const handleSendMessage = async (message) => {
    if (!channel) {
      console.error("Channel not found");
      return;
    }
    let attachments = [];
    if (selectedAttachments.length > 0) {
      attachments = await Promise.all(
        selectedAttachments.map(async (file) => {
          const s3Url = await uploadFile(file, channel.id);
          return {
            type: file.type.startsWith("image") ? "image" : "file",
            asset_url: s3Url,
            image_url: s3Url,
            title: file.name,
          };
        })
      );
    }

    const messageData = {
      text: message.text || "",
      attachments,
    };

    try {
      await channel.sendMessage(messageData);
      setSelectedAttachments([]); 
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div>
      <MessageInput
        overrideSubmitHandler={handleSendMessage}

        doFileUploadRequest={async (file) => {
          setSelectedAttachments((prev) => [...prev, file]);
          return { type: "file", asset_url: "", title: file.name }; 
        }}

        doImageUploadRequest={async (file) => {
          setSelectedAttachments((prev) => [...prev, file]);
          return { type: "image", image_url: "", title: file.name }; 
        }}
      />
    </div>
  );
}

export default CustomMessageInput;
