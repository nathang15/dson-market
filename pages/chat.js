import React from 'react';
import Layout from '@/components/Layout';
import PostCard from '@/components/PostCard';
import {useEffect, useState, useContext} from 'react';
import {useSession, useSupabaseClient} from '@supabase/auth-helpers-react';
import {UserContextProvider} from '../contexts/UserContext';
import Message from '@/components/chatting/Message';
import MessageInput from '@/components/chatting/MessageInput';
import {useRouter} from 'next/router';
import Card from '@/components/Card';
import {UserContext} from '@/contexts/UserContext';
import Link from 'next/link';
import Avatar from '@/components/Avatar';

/**
 * Saved Post Page
 * @return {JSX.Element} The rendered Saved Post Page
 */
function ChatPage() {
  const session = useSession();
  const supabase = useSupabaseClient();
  const router = useRouter();
  const {profile} = useContext(UserContext);
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
      // Handle error accordingly
    }
  };


  return (
    <Card>
      <div className="flex-1 mt-4">
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
      </div>
      <div className="mt-4">
        <div className="flex items-center">
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded-md mr-2 w-12 dark:text-white dark:bg-customBlack2 dark:border-darkBG"
          />
          <button
            onClick={sendMessage}
            className="bg-red-500 text-white p-2 rounded-md"
          >
            Send
          </button>
        </div>
      </div>
    </Card>
  );
}

export default ChatPage;
