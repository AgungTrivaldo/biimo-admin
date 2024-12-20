import React, { useState } from 'react';

const InboxChat = () => {
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = () => {
    console.log('Message sent:', message);
    setMessage('');
  };

  return (
    <div className="mt-14 p-8">
      <h1 className="text-2xl font-bold mb-4">Inbox Chat</h1>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden flex">
        <div className="w-1/3 border-r bg-gray-50 flex flex-col">
          <div className="p-4">
            <input
              type="text"
              placeholder="Search People..."
              className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring"
            />
          </div>
        </div>

        <div className="w-2/3 flex flex-col">
          <div className="flex-1 bg-gray-100 p-4">
            <div className="bg-gray-300 px-4 py-2 rounded-lg mb-4 max-w-xs">Hey There!</div>
            <div className="ml-auto bg-purple-500 text-white px-4 py-2 rounded-lg mb-4 max-w-xs">
              Hello!
            </div>
          </div>
          <div className="p-4 border-t bg-white flex items-center">
            <input
              type="text"
              value={message}
              onChange={handleInputChange}
              className="flex-1 px-4 py-2 rounded-full border border-gray-300"
            />
            <button onClick={handleSendMessage} className="ml-2 bg-purple-500 text-white px-4 py-2 rounded-full">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InboxChat;
