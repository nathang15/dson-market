import React from 'react';
import Layout from '@/components/Layout';
import PostCard from '@/components/PostCard';
import {useEffect, useState} from 'react';
import {useSession, useSupabaseClient} from '@supabase/auth-helpers-react';
import {UserContextProvider} from '../contexts/UserContext';
import Message from '@/components/chatting/Message';
import MessageInput from '@/components/chatting/MessageInput';
import {useRouter} from 'next/router';
/**
 * Saved Post Page
 * @return {JSX.Element} The rendered Saved Post Page
 */
function ChatPage() {
  const session = useSession();
  const supabase = useSupabaseClient();
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const userId = router.query.id;
  // TODO Should replace with calls to fetch from messages table
  const [messages, setMessages] = useState([
    {id: 1, text: 'Hello!', sender: 'user'},
    {id: 2, text: 'Hi there!', sender: 'otherUser'},
    // Add more messages as needed
  ]);

  // TODO Replace with calls to post messages to messages table
  const sendMessage = (text, sender) => {
    const newMessage = {
      id: messages.length + 1,
      text,
      sender,
    };
    setMessages([...messages, newMessage]);
  };

  return (
    <Layout>
      <UserContextProvider>
        <h1 className='flex justify-center md:text-6xl text-4xl mb-6 text-darkBG dark:text-lightBG underline decoration-red-500 -my-3 font-bold decoration-8'>
          {userId}
        </h1>
        <div className="rounded-md flex flex-col justify-end p-4 dark:bg-customBlack2 bg-gray-300 -my-3" style={{width: '77vw', height: '82vh'}}>
          <div className="flex-1 mt-4">
            {messages.map((message) => (
              <Message key={message.id} message={message} />
            ))}
          </div>
          <div><MessageInput sendMessage={sendMessage} /></div>
        </div>
      </UserContextProvider>
    </Layout>
  );
}

export default ChatPage;
