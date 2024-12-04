/* eslint-disable react/prop-types */
import { useState, useEffect, useContext, useRef } from "react";
import { StreamChat } from "stream-chat";
import {
  Chat,
  Channel,
  Window,
  MessageList,
  Thread,
  useActionHandler,
  Attachment,
  LoadingIndicator,
} from "stream-chat-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { EmojiPicker } from "stream-chat-react/emojis";
import "stream-chat-react/dist/css/v2/index.css";
import axios from "axios";
import { SidebarProvider } from "@/components/ui/sidebar";
import stripSpecialCharacters from "@/utils/stripSpecialCharacters";
import { AppContext } from "@/utils/store/appContext";
import SidebarMenu from "../components/dashboard/SideBarMenu";
import CreateGroupModal from "../components/dashboard/CreateGroupModal";
import CustomChannelHeader from "@/components/dashboard/CustomChannelHeader";
import PremiumModal from "@/components/dashboard/PremiumModal";
import CustomMessageInput from "../components/dashboard/CustomMessageInput";
import CustomMessage from "../components/dashboard/CustomMessage";
import Payment from "../components/dashboard/PaymentModal";
import { Button } from "@/components/ui/button";
import SuccessModal from "@/components/dashboard/SuccessModal";
import Share from "@/components/chatComponents/Share";
import About from "@/components/chatComponents/About";

async function getOrCreateConvoAIChannel(userId, client) {
  const channelId = `${userId}_convoAI`;
  const channel = client.channel("messaging", channelId, {
    created_by_id: userId,
    name: "ConvoAI 🤖",
    members: [userId, "convoAI"],
  });
  await channel.create();
  return channel;
}

export default function Dashboard() {
  const _ctx = useContext(AppContext);
  const [client, setClient] = useState(null);
  const [activeChannel, setActiveChannel] = useState(null);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const chatContainerRef = useRef(null);
  const [sharedItems, setSharedItems] = useState({});

  const addSharedItem = (item, channelId) => {
    setSharedItems((prevItems) => ({
      ...prevItems,
      [channelId]: [...(prevItems[channelId] || []), item],
    }));
  };

  const userId = stripSpecialCharacters(_ctx.email);
  const userToken = _ctx.streamToken;

  useEffect(() => {
    const initChat = async () => {
      const chatClient = StreamChat.getInstance(
        import.meta.env.VITE_STREAM_API_KEY
      );
      await chatClient.connectUser({ id: userId }, userToken);
      setClient(chatClient);

      const convoAIChannel = await getOrCreateConvoAIChannel(
        userId,
        chatClient
      );
      if (!convoAIChannel.hasListener) {
        convoAIChannel.on("message.new", async (event) => {
          const newMessage = event.message;
          if (newMessage.user.id === userId) {
            await axios.post("http://localhost:4000/api/ai/chat", {
              userId,
              message: newMessage.text,
            });
          }
        });
        convoAIChannel.hasListener = true;
      }
    };

    initChat();

    return () => {
      if (client) client.disconnectUser();
    };
  }, [client, userId, userToken]);

  const navigateToChat = async ({ channelId, messageId = null }) => {
    if (!client) return;

    try {
      const existingChannels = await client.queryChannels({
        id: { $eq: channelId },
      });

      let channel;

      if (existingChannels.length > 0) {
        channel = existingChannels[0];
      } else {
        channel = client.channel("messaging", channelId, {
          members: [channelId, client.userID],
        });
        await channel.create();
      }

      await channel.watch();
      setActiveChannel(channel);

      if (messageId) {
        setTimeout(() => {
          const messageElement = document.getElementById(
            `message-${messageId}`
          );
          if (messageElement && chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
              top: messageElement.offsetTop - 50,
              behavior: "smooth",
            });
          }
        }, 500);
      }
    } catch (error) {
      console.error("Error navigating to chat:", error);
    }
  };

  const handleGroupCreated = async (newChannel) => {
    setActiveChannel(newChannel);
  };

  const CustomAttachmentActions = (props) => {
    const { actionHandler, actions } = props;
  
    const handleClick = async (
      event,
      value,
      name,
    ) => {
      try {
        if (actionHandler) await actionHandler(name, value, event);
      } catch (err) {
        console.log(err);
      }
    };
  
    return (
      <>
        {actions.map((action) => (
          <button key={action} onClick={(event) => handleClick(event, action.value, action.name)}>
            {action.value}
          </button>
        ))}
      </>
    );
  };
  
  const CustomGiphyPreview = (props) => {
    const { message } = props;
  
    const handleAction = useActionHandler(message);
  
    if (!message.attachments) return null;
  
    return (
      <Attachment
        actionHandler={handleAction}
        AttachmentActions={CustomAttachmentActions}
        attachments={message.attachments}
      />
    );
  };

  if (!client)
    return (
      <div className="w-full h-[100%] flex flex-row justify-center items-center">
        <LoadingIndicator size={50} />
      </div>
    );

  return (
    <>
      {_ctx.userType !== "premium" && (
        <PremiumModal setShowPaymentModal={() => setShowPaymentModal(true)} />
      )}
      {_ctx.userType !== "premium" && (
        <Alert className="flex justify-start items-center gap-2 w-full bg-secondary p-3 py-0">
          <Info className="top-[0.5rem] left-0 h-5 w-5" />
          <AlertDescription className="flex-grow">
            Unlock exclusive features and elevate your experience – upgrade to
            Convo Premium today!{" "}
            <Button
              variant="ghost"
              className="px-1 font-bold text-primary underline hover:bg-transparent hover:text-primary"
              onClick={() => setShowPaymentModal(true)}
            >
              Get started here
            </Button>
          </AlertDescription>
        </Alert>
      )}
      <Chat client={client} theme="relative messaging light">
        <div
          className={`flex ${
            _ctx.userType !== "premium" ? "h-[94vh]" : "h-screen"
          } bg-white`}
        >
          <SidebarProvider>
            <SidebarMenu
              client={client}
              userId={userId}
              onShowGroupModal={() => setShowCreateGroupModal(true)}
              logout={() => _ctx.logout(client)}
              setActiveChannel={(channel) => {
                setActiveTab("chat");
                setActiveChannel(channel);
              }}
            />
            <div
              className="relative my-3 flex-1 flex flex-col"
              ref={chatContainerRef}
            >
              <Channel
                GiphyPreviewMessage={CustomGiphyPreview}
                channel={activeChannel}
                EmojiPicker={EmojiPicker}
              >
                <Window>
                  <CustomChannelHeader
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                  />
                  {activeTab === "chat" && (
                    <MessageList
                      Message={(props) => <CustomMessage {...props} />}
                    />
                  )}

                  {activeTab === "share" && <Share sharedItems={sharedItems} />}

                  {activeTab === "about" && <About />}

                  {activeTab === "chat" && (
                    <CustomMessageInput addSharedItem={addSharedItem} />
                  )}
                </Window>
                <Thread />
              </Channel>
            </div>
          </SidebarProvider>
        </div>
        <CreateGroupModal
          client={client}
          isOpen={showCreateGroupModal}
          onClose={() => setShowCreateGroupModal(false)}
          onGroupCreated={handleGroupCreated}
        />
      </Chat>
      <Payment
        isOpen={showPaymentModal}
        setIsOpen={() => setShowPaymentModal(false)}
        setShowSuccessModal={() => setShowSuccessModal(true)}
      />
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />
    </>
  );
}
