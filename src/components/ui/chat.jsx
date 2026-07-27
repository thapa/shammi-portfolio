import { useRef, useEffect, useState, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import ChatMessage from "@/components/ui/chat-message";

const Chat = ({ messages, currentUser, users }) => {
  const containerRef = useRef(null);
  const [visibleMessages, setVisibleMessages] = useState([]);

  useEffect(() => {
    if (messages.length === 0) return;

    setVisibleMessages([]);
    let cancelled = false;

    (async () => {
      for (const msg of messages) {
        if (cancelled) return;
        await new Promise((r) => setTimeout(r, 700));
        if (cancelled) return;
        setVisibleMessages((prev) => [...prev, msg]);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [messages]);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [visibleMessages]);

  const getUserAvatar = (name) =>
    users.find((u) => u.name === name)?.avatar ??
    "/placeholder.svg?height=40&width=40";

  return (
    <div
      ref={containerRef}
      className="w-full h-full overflow-y-auto p-2 bg-white dark:bg-[#212121] flex flex-col py-[2rem]">
      <AnimatePresence initial={false} mode="popLayout">
        {visibleMessages.map((message) => (
          <motion.div
            key={message.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4 }}
            className={`flex mb-4 ${message.name === currentUser ? "justify-end" : "justify-start"
              } items-end`}>
            <ChatMessage
              message={message}
              isCurrentUser={message.name === currentUser}
              avatar={getUserAvatar(message.name)} />
          </motion.div>
        ))}
      </AnimatePresence>
      {visibleMessages.length > 0 &&
        visibleMessages[visibleMessages.length - 1].name === currentUser && (
          <div className="text-xs text-right mt-1 mr-2 dark:text-white text-black">
            Delivered
          </div>
        )}
    </div>
  );
};

export default Chat;
