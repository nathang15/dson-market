// import {useRouter} from 'next/router';
import React from 'react';
import {UserContext} from '@/contexts/UserContext';
import {useContext} from 'react';
import Link from 'next/link';
import {
  UserCircleIcon,
  AnnotationIcon,
  CurrencyDollarIcon,
  ChatAltIcon,
} from '@heroicons/react/outline';

/**
 * React component for rendering profile tabs that navigate between 'Posts', 'About', and 'Reviews' sections.
 * @param {Object} props - Component props.
 * @param {string} props.userId - The ID of the user whose profile is being viewed.
 * @param {string} props.active - The currently active tab ('posts', 'about', or 'reviews').
 * @return {JSX.Element} The rendered React component.
 */
function ProfileTabs({userId, active}) {
  const tabClasses = 'flex items-center';
  const activeTabClasses = 'flex items-center font-bold';
  const {profile} = useContext(UserContext);
  // const router = useRouter();

  // const handleSalesLinkClick = () => {
  //   const postsPageUrl = `/profile/${userId}/posts`;
  //   window.location.href = postsPageUrl;
  // };
  return (
    <div className = 'mt-5 md:mt-14 flex gap-3 items-center'>
      <Link
        href={`/profile/${userId}/posts`}
        className={active === 'posts' ? activeTabClasses : tabClasses}
        // onClick={handleSalesLinkClick}
      >
        <CurrencyDollarIcon className="h-7 w-7 mr-1 bg-transparent text-yellow-500" />
        <span className="md:block">Posts</span>
      </Link>
      <Link href={`/profile/${userId}/about`} className={active === 'about' ? activeTabClasses : tabClasses}>
        <UserCircleIcon className='h-7 w-7 mr-1 bg-transparent text-blue-500'/>
        <span className='md:block'>About</span>
      </Link>
      <Link href={`/profile/${userId}/reviews`} className={active === 'reviews' ? activeTabClasses : tabClasses}>
        <AnnotationIcon className='h-7 w-7 mr-1 bg-transparent'/>
        <span className='md:block'>Reviews</span>
      </Link>
      {userId != profile?.id && (
        <Link href={`/profile/${userId}/chat`} className={tabClasses}>
          <ChatAltIcon className="h-7 w-7 mr-1 bg-transparent text-red-500" />
          <span className="md:block">Chat</span>
        </Link>
      )}
    </div>
  );
}

export default ProfileTabs;
