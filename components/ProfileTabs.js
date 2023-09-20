import { useRouter } from 'next/router';
import React from 'react'
import Link from "next/link"
import {
    CheckCircleIcon,
    UserCircleIcon,
    AnnotationIcon,
    CurrencyDollarIcon,
    PencilAltIcon,
  } from "@heroicons/react/outline";
function ProfileTabs({userId, active}) {

    const tabClasses = 'flex items-center';
    const activeTabClasses = 'flex items-center font-bold'
    const router = useRouter();

    const handleSalesLinkClick = () => {
      const postsPageUrl = `/profile/${userId}/posts`;
      window.location.href = postsPageUrl;
    };
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
    </div>  
  )
}

export default ProfileTabs