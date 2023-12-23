/* eslint-disable no-unused-vars */
import React from 'react';
import {useEffect, useState} from 'react';
import {useSession, useSupabaseClient} from '@supabase/auth-helpers-react';
import {UserContextProvider} from '../contexts/UserContext';
import Message from '@/components/chatting/Message';
import {useRouter} from 'next/router';
import Card from '@/components/Card';
import {PaperAirplaneIcon} from '@heroicons/react/solid';

/**
 * Saved Post Page
 * @return {JSX.Element} The rendered Saved Post Page
 */
function ChatPage() {
  const session = useSession();
  const supabase = useSupabaseClient();
  const router = useRouter();
  const userId = router.query.id;
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState([]);

  const channel = supabase
      .channel('messages')
      .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
          },
          (payload) => loadMessages(),
      )
      .subscribe();

  useEffect(() => {
    // Load messages when the component mounts or userId changes
    loadMessages();
  }, [userId]);

  const sendMessage = async () => {
    try {
      if (!messageText.trim()) {
        return; // Handle case where message text is empty
      }

      const authorId = session.user.id;
      const receiverId = userId;

      // Insert the message into the 'messages' table
      const {data, error} = await supabase
          .from('messages')
          .insert([
            {content: messageText, author: authorId, receiver: receiverId},
          ]);

      if (error) {
        throw error;
      }

      // Update local state with the new message
      const newMessage = {
        id: data[0].id,
        text: messageText,
        sender: 'user',
      };

      setMessages([...messages, newMessage]);
    } catch (error) {
      console.error(error);
    }
    // Clear the message text input after successful submission
    setMessageText('');
  };

  const loadMessages = async () => {
    try {
      const {data, error} = await supabase
          .from('messages')
          .select('id, content, author, receiver, created_at')
          .in('author', [session.user.id, userId])
          .in('receiver', [session.user.id, userId])
          .order('created_at', {ascending: true});

      if (error) {
        throw error;
      }

      // Map fetched messages to the format used in the local state
      const formattedMessages = data.map((message) => ({
        id: message.id,
        text: message.content,
        sender: message.author === session.user.id ? 'user' : 'otherUser',
      }));

      setMessages(formattedMessages);
    } catch (error) {
      console.error(error);
    }
  };

  const sendMessageWithKey = (e) => {
    // Check if the Enter key is pressed
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent the default behavior (e.g., new line in the textarea)
      sendMessage();
    }
  };


  return (
    <Card>
      <div className="flex-1 mt-4">
        {messages.length > 0 ? (
            messages.map((message) => (
              <Message key={message.id} message={message} />
            ))
          ) : (
            <p className="text-lg dark:text-lightBG -mt-2">No chat history</p>
          )}
      </div>
      <div className="mt-4">
        <div className="flex items-center">
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={sendMessageWithKey}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded-md mr-2 w-12 dark:text-white dark:bg-customBlack2 dark:border-darkBG"
          />
          <button
            onClick={sendMessage}
            className="p-2"
          >
            <PaperAirplaneIcon className="h-7 text-red-500 hover:scale-110 dark:text-lightBG transform rotate-90" />
          </button>
        </div>
      </div>
    </Card>
  );
}

export default ChatPage;
