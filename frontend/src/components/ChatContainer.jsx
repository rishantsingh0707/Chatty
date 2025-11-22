import React, { useEffect, useRef } from 'react'
import { useMessageStore } from '../store/Message.Store'
import ChatHeader from './ChatHeader.jsx'
import MessageInput from './MessageInput.jsx'
import MessageSkeleton from './skeletons/MessageSkeleton.jsx'
import { useAuthStore } from '../store/Auth.Store.js'
import { formatMessageTime } from '../lib/utils.js'

function ChatContainer() {
  const { selectedUser, messages, isMessagesLoading, getMessages, subscribeToNewMessages, unsusbscribeToNewMessages } = useMessageStore()
  const { authUser } = useAuthStore()
  const messageEndRef = useRef(null)

  useEffect(() => {
    getMessages(selectedUser._id)
    subscribeToNewMessages()

    return () => unsusbscribeToNewMessages()

  }, [selectedUser, getMessages, subscribeToNewMessages, unsusbscribeToNewMessages])

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollTo({
        top: messageEndRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isMessagesLoading]);

  if (isMessagesLoading) {
    return (
      <div className="flex flex-1 flex-col overflow-hidden">
        <ChatHeader />
        <div className="flex-1 overflow-auto">
          <MessageSkeleton />
        </div>
        <MessageInput />
      </div>
    )
  }

  return (
    <>
      <style>{`
        /* Firefox */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(100,100,100,0.35) transparent;
        }

        /* WebKit (Chrome, Edge, Safari) */
        .custom-scrollbar::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(100,100,100,0.35);
          border-radius: 9999px;
          border: 2px solid transparent;
          background-clip: padding-box;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(100,100,100,0.6);
        }

        /* Dark mode tweaks (DaisyUI / Tailwind dark class on root) */
        :root.dark .custom-scrollbar::-webkit-scrollbar-thumb,
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(160,160,160,0.18);
        }
        :root.dark .custom-scrollbar {
          scrollbar-color: rgba(160,160,160,0.18) transparent;
        }
      `}</style>

      <div className="flex flex-1 flex-col h-full">
        <ChatHeader />

        <div
          ref={messageEndRef}
          className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-base-100 custom-scrollbar"
          aria-live="polite"
        >
          {messages.map((message) => {
            const isOwn = message.senderId.toString() === authUser._id.toString();

            return (
              <div key={message._id} className={`w-full flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] flex items-end ${isOwn ? 'flex-row-reverse space-x-reverse space-x-3' : 'space-x-3'}`}>
                  <div className="shrink-0">
                    <div className="w-10 h-10 rounded-full overflow-hidden border">
                      <img
                        src={
                          isOwn
                            ? authUser.profilePic || '/profilePic.jpg'
                            : selectedUser.profilePic || '/profilePic.jpg'
                        }
                        alt="avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className={`${isOwn ? 'bg-primary text-primary-content' : 'bg-base-200 text-base-content'} px-4 py-3 rounded-lg shadow-sm`}>
                    {message.image && (
                      <img src={message.image} alt="attachment" className="max-w-full sm:max-w-60 rounded-md mb-2" />
                    )}
                    {message.message && <div className="whitespace-pre-wrap">{message.message}</div>}
                    <div className="text-xs opacity-60 mt-1 text-right">
                      {formatMessageTime(message.createdAt)}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="px-4 py-3 border-t border-base-300">
          <MessageInput />
        </div>
      </div>
    </>
  )
}

export default ChatContainer