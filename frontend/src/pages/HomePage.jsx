import { useChatStore } from "../store/useChatStore";

import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const HomePage = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="h-screen bg-base-200 chat-background">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100/80 backdrop-blur rounded-xl shadow-lg w-full max-w-6xl h-[calc(100vh-8rem)] ring-1 ring-base-300/60">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />

            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
};
export default HomePage;
