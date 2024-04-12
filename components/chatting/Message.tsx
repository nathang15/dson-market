import React from 'react';
import {UserContext} from '@/contexts/UserContext';
import {useContext, useEffect, useState} from 'react';
import {useSupabaseClient} from '@supabase/auth-helpers-react';
import {useRouter} from 'next/router';
import Link from 'next/link';
import Avatar from '../Avatar';
const Message = ({message}) => {
  const supabase = useSupabaseClient();
  const {profile} = useContext(UserContext);
  const isUser = message.sender === 'user';
  const router = useRouter();
  const userId = router.query.id;
  const [otherUserProfile, setOtherUserProfile] = useState(null);

  useEffect(() => {
    const loadOtherUserProfile = async () => {
      // Load the profile of the other user
      const {data, error} = await supabase
          .from('profiles')
          .select('id, avatar')
          .eq('id', userId)
          .single();

      if (error) {
        console.error('Error loading other user profile:', error);
      } else {
        setOtherUserProfile(data);
      }
    };

    loadOtherUserProfile();
  }, [isUser, message.author]);

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} items-center gap-2 mb-2 last:mb-0`}>
      {!isUser && otherUserProfile && (
        <div className='flex items-center'>
          <Link href={'/profile/' + otherUserProfile?.id}>
            <span className='cursor-pointer'>
              <Avatar url={otherUserProfile?.avatar} size={undefined} editable={undefined} />
            </span>
          </Link>
        </div>
      )}
      <div
        className={`${isUser ? 'bg-red-400' : 'dark:bg-customBlack2 bg-lightBG'} 
        ${isUser ? 'text-white' : 'dark:text-white text-darkBG'} p-2 mx-1 rounded-md max-w-xs`}
      >
        {message.text}
      </div>
      {isUser && profile && (
        <div className='flex items-center'>
          <Link href={'/profile/' + profile.id}>
            <span className='cursor-pointer'>
              <Avatar url={profile.avatar} size={undefined} editable={undefined} />
            </span>
          </Link>
        </div>
      )}
    </div>
  );
};
export default Message;
