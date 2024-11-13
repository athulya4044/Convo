import { MessageInput, useChannelStateContext } from "stream-chat-react";
import { uploadFile } from "@/utils/uploadFile";

export default function CustomMessageInput() {
  const { channel } = useChannelStateContext();

  return (
    <MessageInput
      overrideSubmitHandler={async (message) => {
        console.log("Sending message with attachments:", message);

        if (!channel) {
          console.error("Channel not found");
          return;
        }

        try {
          const files = message.attachments?.filter((attachment) => attachment.file);

          let s3Attachments = [];
          if (files && files.length > 0) {
            s3Attachments = await Promise.all(
              files.map(async (file) => {
                const s3Url = await uploadFile(file); 
                console.log("File uploaded to S3:", s3Url);
                
                return {
                  asset_url: s3Url,
                  title: file.name,
                  type: "file", 
                };
              })
            );
          }

          await channel.sendMessage({
            text: message.text,
            attachments: s3Attachments, 
          });
          console.log("Message sent successfully");
        } catch (error) {
          console.error("Error sending message:", error);
        }
      }}
      
      // Custom function to handle file uploads directly to S3
      doFileUploadRequest={async (file) => {
        try {
          const s3Url = await uploadFile(file);
          console.log("File uploaded to S3:", s3Url);
          return { asset_url: s3Url, title: file.name }; 
        } catch (error) {
          console.error("Error uploading file to S3:", error);
          throw error; 
        }
      }}
      
      // Custom function to handle image uploads directly to S3
      doImageUploadRequest={async (file) => {
        try {
          const s3Url = await uploadFile(file); 
          console.log("Image uploaded to S3:", s3Url);
          return { asset_url: s3Url, title: file.name }; 
        } catch (error) {
          console.error("Error uploading image to S3:", error);
          throw error; 
        }
      }}
    />
  );
}


