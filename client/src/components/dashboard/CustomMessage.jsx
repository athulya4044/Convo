import { MessageSimple, useMessageContext } from "stream-chat-react";

function CustomMessage() {
  const { message } = useMessageContext();

  return (
    <div className="custom-message">
      <MessageSimple message={message} />

      {message.attachments && message.attachments.length > 0 && (
        <div className="message-attachments">
          {message.attachments.map((attachment, index) => (
            <div key={index} className="attachment">
              {attachment.asset_url && attachment.asset_url.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                <img src={attachment.asset_url} alt={attachment.title} className="attachment-image" />
              ) : (
                <a href={attachment.asset_url} target="_blank" rel="noopener noreferrer" className="attachment-link">
                  {attachment.title || "Download File"}
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CustomMessage;
