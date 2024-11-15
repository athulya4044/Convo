import { MessageSimple, useMessageContext } from "stream-chat-react";

function CustomMessage() {
  const { message } = useMessageContext();

  return (
    <div className="custom-message">
      <MessageSimple message={message} />  
    </div>
  );
}

export default CustomMessage;
