import React, {useState} from 'react';

const MessageInput = ({sendMessage}) => {
  const [text, setText] = useState('');

  const handleSendMessage = () => {
    if (text.trim() !== '') {
      sendMessage(text, 'user');
      setText('');
    }
  };

  return (
    <div className="flex items-center">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your message..."
        className="flex-1 p-2 border rounded-md mr-2 w-12 dark:text-white dark:bg-customBlack dark:border-darkBG"
      />
      <button
        onClick={handleSendMessage}
        className="bg-red-500 text-white p-2 rounded-md"
      >
        Send
      </button>
    </div>
  );
};

export default MessageInput;
