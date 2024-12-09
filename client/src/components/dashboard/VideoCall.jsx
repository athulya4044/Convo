/* eslint-disable react/prop-types */
import { AppContext } from "@/utils/store/appContext";
import {
  CallingState,
  StreamTheme,
  StreamCall,
  StreamVideo,
  StreamVideoClient,
  useCallStateHooks,
  CallControls,
  SpeakerLayout
} from "@stream-io/video-react-sdk";
import { LoadingIndicator } from "stream-chat-react";
import { useContext } from "react";
import stripSpecialCharacters from "@/utils/stripSpecialCharacters";
import "@stream-io/video-react-sdk/dist/css/styles.css";

function VideoCall({ setActiveTab }) {
  const _ctx = useContext(AppContext);
  const token = _ctx.streamToken;
  const userId = stripSpecialCharacters(_ctx.email);

  const callId = "9GpRJCmxEkLX";
  // set up the user object
  const user = {
    id: userId,
    name: userId,
  };

  const client = new StreamVideoClient({
    apiKey: import.meta.env.VITE_STREAM_API_KEY,
    user,
    token,
  });

  const call = client.call("default", callId);
  call.join({ create: true });

  if (!client || !call)
    return (
      <div className="w-full h-[100%] flex flex-row justify-center items-center">
        <LoadingIndicator size={50} />
      </div>
    );

  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <MyUILayout setActiveTab={setActiveTab} />
      </StreamCall>
    </StreamVideo>
  );
}

export default VideoCall;

const MyUILayout = ({ setActiveTab }) => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  if (callingState !== CallingState.JOINED) {
    return <div>Loading...</div>;
  }

  return (
    <StreamTheme>
      <SpeakerLayout participantsBarPosition='bottom' />
      <CallControls onLeave={() => setActiveTab("chat")}/>
    </StreamTheme>
  );
};

import { ParticipantView } from "@stream-io/video-react-sdk";

export const MyParticipantList = ({ participants }) => {
  return (
    <div style={{ display: "flex", flexDirection: "row", gap: "8px" }}>
      {participants.map((participant) => (
        <ParticipantView
          participant={participant}
          key={participant.sessionId}
        />
      ))}
    </div>
  );
};

export const MyFloatingLocalParticipant = ({ participant }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: "15px",
        left: "15px",
        width: "240px",
        height: "135px",
        boxShadow: "rgba(0, 0, 0, 0.1) 0px 0px 10px 3px",
        borderRadius: "12px",
      }}
    >
      <ParticipantView participant={participant} />
    </div>
  );
};
