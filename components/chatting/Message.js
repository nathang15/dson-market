// import React from 'react';
// import {UserContext} from '@/contexts/UserContext';
// import {useContext, useEffect, useState} from 'react';
// import {useSession, useSupabaseClient} from '@supabase/auth-helpers-react';
// import {UserContextProvider} from '@/contexts/UserContext';
// import Link from 'next/link';
// import Avatar from '../Avatar';
// const Message = ({messages}) => {
//   const session = useSession();
//   const supabase = useSupabaseClient();
//   const {profile} = useContext(UserContext);
//   const isUser = profile?.id;

//   // {messages.map((message) => (
//   //   <Message key={message.id} message={content} />
//   // ))}
//   return (
//     <div>
//       {messages.map((message) => (
//         <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} items-center gap-2 mb-2 last:mb-0`} key={message.id}>
//           <div
//             className={`${isUser ? 'bg-red-400' : 'dark:bg-darkBG bg-lightBG'}
//             ${isUser ? 'text-white' : 'dark:text-white text-darkBG'} p-2 mx-1 rounded-md max-w-xs`}
//           >
//             {message.text}
//           </div>
//           <div className='flex items-center'>
//             {isUser && profile ? (
//               <Link href={'/profile/' + profile.id}>
//                 <span className='cursor-pointer'>
//                   <Avatar url={profile.avatar} />
//                 </span>
//               </Link>
//             ) : null}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Message;

import React from 'react';
import {UserContext} from '@/contexts/UserContext';
import {useContext, useEffect, useState} from 'react';
import {useSession, useSupabaseClient} from '@supabase/auth-helpers-react';
import {useRouter} from 'next/router';
import {UserContextProvider} from '@/contexts/UserContext';
import Link from 'next/link';
import Avatar from '../Avatar';
const Message = ({message}) => {
  const session = useSession();
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
  console.log(otherUserProfile);

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} items-center gap-2 mb-2 last:mb-0`}>
      {!isUser && otherUserProfile && (
        <div className='flex items-center'>
          <Link href={'/profile/' + otherUserProfile?.id}>
            <span className='cursor-pointer'>
              <Avatar url={otherUserProfile?.avatar} />
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
              <Avatar url={profile.avatar} />
            </span>
          </Link>
        </div>
      )}
    </div>
  );
};
export default Message;
