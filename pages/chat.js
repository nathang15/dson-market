/* eslint-disable no-unused-vars */
import React from 'react';
import {useEffect, useState} from 'react';
import {useSession, useSupabaseClient} from '@supabase/auth-helpers-react';
import {UserContextProvider} from '../contexts/UserContext';
import Message from '@/components/chatting/Message';
import {useRouter} from 'next/router';
import Card from '@/components/Card';
import {PaperAirplaneIcon} from '@heroicons/react/solid';
import {UserContext} from '@/contexts/UserContext';
import {useContext} from 'react';
import Avatar from '@/components/Avatar';
import Link from 'next/link';
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
  const [otherUsers, setOtherUsers] = useState([]);
  const [otherUserProfileMap, setOtherUserProfileMap] = useState({});
  const [latestMessages, setLatestMessages] = useState({});

  const {profile} = useContext(UserContext);
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
    if (userId === profile?.id) {
      // If the user is viewing their own chat page,
      // load the list of users who previously sent messages to the current user
      loadOtherUsers();
    }
    // Load messages when the component mounts or userId changes
    loadMessages();
    // Load latest messages when otherUsers or messages change
    loadLatestMessages();
  }, [userId]);

  useEffect(() => {
    loadLatestMessages();
  }, [otherUsers]);

  useEffect(() => {
    const loadOtherUsersProfiles = async () => {
      // Load profiles of other users
      const promises = otherUsers.map(async (otherUserId) => {
        const {data, error} = await supabase
            .from('profiles')
            .select('id, avatar, name')
            .eq('id', otherUserId)
            .single();

        if (error) {
          console.error('Error loading other user profile:', error);
          return null;
        } else {
          return {id: otherUserId, profile: data};
        }
      });

      const profiles = await Promise.all(promises);
      const profilesMap = profiles.reduce((map, profile) => {
        if (profile) {
          map[profile.id] = profile.profile;
        }
        return map;
      }, {});

      setOtherUserProfileMap(profilesMap);
    };

    loadOtherUsersProfiles();
  }, [otherUsers]);

  const loadOtherUsers = async () => {
    try {
      const {data, error} = await supabase
          .from('messages')
          .select('author')
          .eq('receiver', [profile?.id])
          .order('created_at', {ascending: false});

      if (error) {
        throw error;
      }

      // Filter out unique users
      const uniqueOtherUsers = Array.from(new Set(data.map((message) => message.author)));

      setOtherUsers(uniqueOtherUsers);
    } catch (error) {
      console.error(error);
    }
  };

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

  const loadLatestMessages = async () => {
    try {
      const promises = otherUsers.map(async (otherUserId) => {
        const {data, error} = await supabase
            .from('messages')
            .select('id, content, author, receiver, created_at')
            .in('author', [otherUserId])
            .in('receiver', [profile?.id])
            .order('created_at', {ascending: false})
            .limit(1);

        if (error) {
          console.error('Error loading latest message:', error);
          return null;
        } else {
          return {id: otherUserId, latestMessage: data[0]};
        }
      });

      const latestMessagesMap = (await Promise.all(promises)).reduce((map, entry) => {
        if (entry) {
          map[entry.id] = entry.latestMessage;
        }
        return map;
      }, {});

      setLatestMessages(latestMessagesMap);
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
  console.log(otherUserProfileMap.length);
  return (
    <div>
      {userId === profile?.id ? (
        <div>
          {/* Display the list of other users and their latest messages */}
          {Object.values(otherUserProfileMap).length > 0 ? (
              Object.values(otherUserProfileMap).map((otherUser) => (
                <Card key={otherUser.id} className="mb-4">
                  <div className="flex mt-4 justify-center items-center gap-3">
                    <Link href={'/profile/' + otherUser.id + '/chat'}>
                      <span className='cursor-pointer flex items-center gap-3'>
                        <Avatar url={otherUser.avatar} />
                        <span className='dark:text-white text-darkBG font-semibold'>{otherUser.name} latest message:
                          {latestMessages[otherUser.id] && (
                            <span className="ml-1">
                              {latestMessages[otherUser.id].content}
                            </span>
                          )}
                        </span>
                      </span>
                    </Link>
                  </div>
                </Card>
              ))
              ) : (
              <Card>
                <div className="flex-1 mt-4">
                  <p className="text-lg dark:text-lightBG -mt-2">No chat history</p>
                </div>
              </Card>
              )}
        </div>
      ):(
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
      )}
    </div>
  );
}

export default ChatPage;
