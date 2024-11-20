import { useState, useEffect, useContext } from "react";
import { StreamChat } from "stream-chat";
import {
  Chat,
  Channel,
  Window,
  MessageInput,
  MessageList,
  Thread,
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
import About from "../components/chatComponents/About";
import Share from "../components/chatComponents/Share";

// create / get ai chat for every user
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
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [activeTab, setActiveTab] = useState("chat"); 
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

  const handleGroupCreated = async (newChannel) => {
    setChannels((prevChannels) => [newChannel, ...prevChannels]);
    const response = await client.queryChannels({ members: { $in: [userId] } });
    setChannels(response);
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
        <Alert className="flex items-start gap-2 w-full bg-secondary p-3">
          <Info className="h-5 w-5 mt-0.5 flex-shrink-0" />
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
      <Chat client={client} theme="messaging light">
        <div
          className={`flex ${
            _ctx.userType !== "premium" ? "h-[90vh]" : "h-screen"
          } bg-white`}
        >
          <SidebarProvider>
            <SidebarMenu
              client={client}
              userId={userId}
              onShowGroupModal={() => setShowCreateGroupModal(true)}
              logout={() => _ctx.logout(client)}
            />
            <div className="my-3 flex-1 flex flex-col">
              <Channel EmojiPicker={EmojiPicker}>
                <Window>
                  <CustomChannelHeader
                  activeTab={activeTab}
                  setActiveTab={setActiveTab} />
                {activeTab === "chat" && (
                  <MessageList
                    Message={(props) => <CustomMessage {...props} />}
                  />
                )}

                {activeTab === "share" && (
                  <Share
                    sharedItems={sharedItems}                  
                  />
                )}

                {activeTab === "about" && <About />}

                {activeTab === "chat" && (
                  <CustomMessageInput
                    addSharedItem={addSharedItem} 
                  />
                )}
                </Window>
                <Thread />
              </Channel>
            </div>
          </SidebarProvider>
        </div>
        {showCreateGroupModal && (
          <CreateGroupModal
            client={client}
            onClose={() => setShowCreateGroupModal(false)}
            onGroupCreated={handleGroupCreated}
          />
        )}
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