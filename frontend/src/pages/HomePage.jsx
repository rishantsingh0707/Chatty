import React from 'react'
import { useMessageStore } from '../store/Message.Store'
import Sidebar from '../components/Sidebar.jsx'
import NoChatSelected from '../components/NoChatSelected.jsx'
import ChatContainer from '../components/ChatContainer.jsx'

function HomePage() {
  const { selectedUser } = useMessageStore()
  return (
    <div className="h-screen bg-base-200 ">
      <div className="flex items-center  justify-center pt-20 px-4">
        <div className="bg-base-100 bg- rounded-xl shadow-cl bg-purple-300 w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />

            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage