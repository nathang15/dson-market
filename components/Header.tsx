import Image from 'next/legacy/image';
import {
  SearchIcon,
  SunIcon,
  MoonIcon,
} from '@heroicons/react/outline';
import {
  BellIcon,
} from '@heroicons/react/outline';
import Avatar from './Avatar';
import Link from 'next/link';
import {useSession, useSupabaseClient} from '@supabase/auth-helpers-react';
// import {UserContext} from '@/contexts/UserContext';
import React, {useEffect, useRef, useState} from 'react';
import PreLoader from './PreLoader';
import { useRouter } from 'next/router';
import useColorMode from '@/hooks/useColorMode';
import NotificationInfo from './NotificationInfo';

/**
 * Header component that appears on all pages.
 * @return {JSX.Element} The rendered header.
 */
function Header() {
  const logo = '/dsonmarket_rectangle_logo.png';
  const logoDark = '/dsonmarket_rectangle_logo_inverse.png';
  const supabase = useSupabaseClient();
  const session = useSession();
  // Initialize profile state
  const [profile, setProfile] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const [colorMode, setColorMode] = useColorMode();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  /**
   * Handle the search form submission.
   * @param {Event} e - The form submission event.
   */
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== '') {
      router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        // Click outside dropdown, handle accordingly
        handleClickOutSideDropdown(event);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [handleClickOutSideDropdown]);

  /**
   * Opens the dropdown menu for post options
   * @param {Event} e - event
   */
  function openDropDown(e) {
    e.stopPropagation();
    setDropdownOpen(true);
  }

  /**
     * Closes the dropdown menu when clicking outside
     * @param {Event} e - event
     */
  function handleClickOutSideDropdown(e) {
    e.stopPropagation();
    setDropdownOpen(false);
  }

  useEffect(() => {
    /**
     * Fetch user profile information.
     */
    const fetchProfile = async () => {
      if (session) {
        const {data, error} = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

        if (error) {
          setErrorMessage(error.message);
        } else {
          setProfile(data);
        }
      }
    };

    fetchProfile();
  }, [session, supabase]);
  let avatar = profile['avatar'];
  let id = profile['id'];
  let name = profile['name'];

  return (
    <header className="sticky top-0 z-50 bg-white border-2 border-lightBorder dark:border-customBlack2 dark:bg-customBlack flex items-center p-2 lg:px-5 px-4">
      <div className="flex items-center">
        <Link href="/">
          {colorMode == 'light' ? (
            <Image src={logo} height={75} width={1.80584551148*75} layout="fixed" />
          ) : (
            <Image src={logoDark} height={75} width={1.80584551148*75} layout="fixed" />
          )}
        </Link>
        <div className="flex md:inline-flex items-center rounded-full bg-gray-100 p-2 dark:bg-customBlack2">
          <SearchIcon className="h-6 text-gray-600 dark:text-gray-200" />
          <form onSubmit={handleSearch}>
            <input
              className="lg:inline-flex ml-2 bg-transparent outline-none bg-lightBG placeholder-gray-600 dark:bg-customBlack2 dark:placeholder-gray-200 dark:text-white flex-shrink"

              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={(e) => e.target.placeholder = ''}
              onBlur={(e) => e.target.placeholder = 'Search DsonMarket'}
              placeholder = "Search DsonMarket"
            />
          </form>
        </div>
      </div>

      <div className="flex items-center sm:space-x-2 justify-end flex-grow md:-ml-0 -ml-5">
        {/* user Image here with Name */}
        <div>
          {profile && id ? ( // Check if profile and profile.id exist
            <Link href={`/profile/${id}`}>
              <span className="cursor-pointer md:flex items-center hidden">
                <div className="md:flex hidden mr-3 font text-md dark:text-lightBG hover: animate-underline2 hover:scale-105 transition-all cursor-pointer font-semibold">{name}</div>
                <Avatar url={avatar} size={''} editable={false} />
              </span>
            </Link>
          ) : (
            // Show a loading state if profile is not yet available
            <div className='grow'>
              <PreLoader/>
            </div>
          )}
        </div>
        <div className="px-1 mt-2 dark:text-lightBG text-gray-800">
          {!dropdownOpen && (
            <button className='' onClick={openDropDown}>
              <BellIcon className="rounded-full cursor-pointer h-7 w-7 hover:scale-125 transition-all" />
            </button>
          )}
          {dropdownOpen && (
            <button className=''>
              <BellIcon className="rounded-full cursor-pointer h-7 w-7 hover:scale-125 transition-all" />
            </button>
          )}
          <div ref={dropdownRef}>
            <div className='relative'>
              {dropdownOpen && (
                // <div className='absolute mt-2 -right-6 dark:bg-customBlack2 bg-white shadow-md p-3 rounded-sm border dark:border-black border-gray-100 w-80'>
                <NotificationInfo id={undefined}/>
                // </div>
              )}
            </div>
          </div>
        </div>

        <button
          className="p-2 rounded-full bg-transparent hover:scale-125 transition-all"
          onClick={() => setColorMode(colorMode === 'light' ? 'dark' : 'light')}
        >
          {isMounted && (
            colorMode === 'dark' ? (
              <SunIcon className="h-7 w-7 text-white" />
            ) : (
              <MoonIcon className="h-7 w-7" />
            )
          )}
        </button>
      </div>
    </header>
  );
}

export default Header;
function setErrorMessage(_message: string) {
  throw new Error('Function not implemented.');
}

