import React, { useState, useEffect } from 'react';
import { getDatabase, ref, set, onValue } from 'firebase/database';
const db = getDatabase();

const AdminChatPanel = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]); // List of users to chat with
  const [selectedUserId, setSelectedUserId] = useState(null); // Selected user for the chat
  
  const adminId = 'admin'; // Admin identifier

  // Fetch list of users (mocked or fetched from Firebase)
  const fetchUsers = () => {
    const usersRef = ref(db, 'users'); // Assuming users are stored under "users"
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const userList = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setUsers(userList);
      }
    });
  };

  // Fetch messages for the selected user
  const fetchMessages = () => {
    if (!selectedUserId) return; // Ensure a user is selected
    const chatKey = `admin_${selectedUserId}`;
    const chatRef = ref(db, `chats/${chatKey}`);
    onValue(chatRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messagesArray = Object.keys(data).map((key) => ({
          id: key,
          text: data[key].text,
          sender_id: data[key].sender_id,
          receiver_id: data[key].receiver_id,
          timestamp: data[key].timestamp,
          status: data[key].status,
        }));
        
        // Sort messages by timestamp (newest at the bottom)
        const sortedMessages = messagesArray.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        setMessages(sortedMessages);
      } else {
        setMessages([]);
      }
    });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [selectedUserId]);

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = async () => {
    if (message.trim() && selectedUserId) {
      const newMessage = {
        sender_id: adminId, // Always the admin
        receiver_id: selectedUserId, // Selected user
        text: message,
        timestamp: new Date().toISOString(),
        status: 'sent', // Default to 'sent'
      };

      const chatKey = `admin_${selectedUserId}`;
      const chatRef = ref(db, `chats/${chatKey}`);
      const newMessageRef = ref(db, `chats/${chatKey}/${Date.now()}`); // Use timestamp as unique key

      console.log('DB instance:', db); // Log db object to ensure it's correctly initialized
      // console.log('Chat path:', newMessagePath); // Log the chat path being used 
      console.log('New message object:', newMessage); // Log the message being sent


      try {
        await set(newMessageRef, newMessage);
        setMessage(''); // Clear input field
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  return (
    <div className="mt-14 p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Chat Panel</h1>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden flex">
        {/* Sidebar for user list */}
        <div className="w-1/3 border-r bg-gray-50 flex flex-col">
          <div className="p-4">
            <input
              type="text"
              placeholder="Search Users..."
              className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring"
            />
          </div>
          <div className="flex-1 overflow-y-auto">
            {users.map((user) => (
              <div
                key={user.id}
                className={`p-4 cursor-pointer ${
                  selectedUserId === user.id ? 'bg-purple-100' : ''
                }`}
                onClick={() => setSelectedUserId(user.id)}
              >
                {user.name || user.id}
              </div>
            ))}
          </div>
        </div>

        {/* Chat view */}
        <div className="w-2/3 flex flex-col">
          {/* Messages display */}
          <div className="flex-1 bg-gray-100 p-4 overflow-y-auto" style={{ height: '400px' }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`px-4 py-2 rounded-lg mb-4 max-w-xs ${
                  msg.sender_id === adminId ? 'ml-auto bg-purple-500 text-white' : 'bg-gray-300'
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>
          {/* Input and send button */}
          <div className="p-4 border-t bg-white flex items-center">
            <input
              type="text"
              value={message}
              onChange={handleInputChange}
              className="flex-1 px-4 py-2 rounded-full border border-gray-300"
            />
            <button
              onClick={handleSendMessage}
              className="ml-2 bg-purple-500 text-white px-4 py-2 rounded-full"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminChatPanel;
