import {
  CurrencyDollarIcon,
  LogoutIcon,
  BookmarkIcon,
  BookOpenIcon,
  PencilAltIcon,
  ChatAltIcon
} from '@heroicons/react/outline';
import {
  HomeIcon,
} from '@heroicons/react/solid';
import React, {useEffect, useState} from 'react';
import SidebarRow from './SidebarRow';
import {useRouter} from 'next/router';
import Link from 'next/link';
import {useSupabaseClient, useSession} from '@supabase/auth-helpers-react';

/**
 * React component for the sidebar navigation menu.
 * @return {JSX.Element} The rendered React component.
 */
function Sidebar() {
  const router = useRouter();
  const {asPath: pathname} = router;
  const supabase = useSupabaseClient();
  const session = useSession();
  const [userId, setUserId] = useState(null);

  /**
   * Effect hook that updates the user ID in state when the session user changes.
   */

  useEffect(() => {
    if (session?.user) {
      setUserId(session.user.id);
    }
  }, [session]);

  /**
   * Handles the user logout process and redirects to the homepage.
   */
  async function logout() {
    await supabase.auth.signOut().then(() => {
      window.location.href = '/'; // Redirect to the homepage
    });
  }

  /**
   * Handles the user logout process and redirects to the homepage.
   */
  async function login() {
    window.location.href = '/'; // Redirect to the homepage
  }

  return (
    <div className="p-2 mt-5 max-w-[600px] xl:min-w-[300px]">
      {userId && (
        <Link href="/" className="block md:px-3 px-0">
          <SidebarRow active={pathname === '/'} Icon={HomeIcon} title="Home" src={undefined} />
        </Link>
      )}
      {userId && (
        <Link href={`/profile/${userId}/chat`} className="block md:px-3 px-0">
          <SidebarRow
            active={pathname === `/profile/${userId}/chat`}
            Icon={ChatAltIcon}
            title="Chat" 
            src={undefined}          
          />
        </Link>
      )}
      {userId && (
        <Link href={`/profile/${userId}/posts`} className="block md:px-3 px-0">
          <SidebarRow
            active={pathname === `/profile/${userId}/posts`}
            Icon={CurrencyDollarIcon}
            title="Sales" 
            src={undefined}          
          />
        </Link>
      )}
      {userId && (
        <Link href="/saved" className="block md:px-3 px-0">
          <SidebarRow active={pathname === '/saved'} Icon={BookmarkIcon} title="Saved" src={undefined} />
        </Link>
      )}
      <Link href="/guide" className="block md:px-3 px-0">
        <SidebarRow active={pathname === '/guide'} Icon={BookOpenIcon} title="Guidelines" src={undefined} />
      </Link>
      <Link href="/feedback" className="block md:px-3 px-0">
        <SidebarRow active={pathname === '/feedback'} Icon={PencilAltIcon} title="Project Feedback" src={undefined} />
      </Link>
      {session?.user ? (
        <button onClick={logout} className="w-full -my-2 block md:px-3 px-0">
          <span className="">
            <SidebarRow Icon={LogoutIcon} title="Logout" src={undefined} active={undefined} />
          </span>
        </button>
      ) : (
        <button onClick={login} className="w-full -my-2 block md:px-3 px-0">
          <span className="">
            <SidebarRow Icon={LogoutIcon} title="Login" src={undefined} active={undefined} />
          </span>
        </button>
      )}
    </div>
  );
}

export default Sidebar;
