import React from 'react';
import {UserContext} from '@/contexts/UserContext';
import {useContext, useEffect, useState} from 'react';
import {useSession, useSupabaseClient} from '@supabase/auth-helpers-react';
import {UserContextProvider} from '@/contexts/UserContext';
import Link from 'next/link';
import Avatar from '../Avatar';
const Message = ({message}) => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const {profile} = useContext(UserContext);
  const isUser = message.sender === 'user';


  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} items-center gap-2 mb-2 last:mb-0`}>
      {/* <div className='flex items-center'>
        <Link href={'/profile/' + profile?.id}>
          <span className='cursor-pointer'>
            <Avatar url={profile?.avatar} />
          </span>
        </Link>
      </div> */}
      <div
        className={`${isUser ? 'bg-red-400' : 'dark:bg-customBlack bg-lightBG'} 
        ${isUser ? 'text-white' : 'dark:text-white text-darkBG'} p-2 mx-1 rounded-md max-w-xs`}
      >
        {message.text}
      </div>
      <div className='flex items-center'>
        {isUser && profile ? (
          <Link href={'/profile/' + profile.id}>
            <span className='cursor-pointer'>
              <Avatar url={profile.avatar} />
            </span>
          </Link>
        ) : null}
      </div>
    </div>
  );
};

export default Message;
