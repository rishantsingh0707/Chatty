import React, { useMemo } from "react";

const MessageSkeleton = ({ avatarSize = "w-10 h-10", leftBubbleWidth = "w-[220px]", rightBubbleWidth = "w-[180px]" }) => {
  // random count between 3 and 5 (computed once per mount)
  const count = useMemo(() => Math.floor(Math.random() * 4) + 4, []);
  const items = Array.from({ length: count });

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {items.map((_, idx) => {
        const isLeft = idx % 2 === 0;
        return (
          <div key={idx} className="w-full flex">
            {isLeft ? (
              <div className="flex items-start">
                <div className={`${avatarSize} rounded-full bg-gray-200 animate-pulse`} />
                <div className={`ml-3 ${leftBubbleWidth} h-16 bg-gray-200 animate-pulse rounded`} />
              </div>
            ) : (
              <div className="ml-auto flex items-start flex-row-reverse">
                <div className={`${avatarSize} rounded-full bg-gray-200 animate-pulse`} />
                <div className={`mr-3 ${rightBubbleWidth} h-16 bg-gray-200 animate-pulse rounded`} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MessageSkeleton;