import Image from "next/legacy/image";
import HeaderIcon from "./HeaderIcon";
import {
  SearchIcon,
  DotsVerticalIcon,
  CogIcon,
  SunIcon,
  MoonIcon,
} from "@heroicons/react/outline";
import Avatar from "./Avatar";
import Link from 'next/link';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import { UserContext } from '@/contexts/UserContext';
import React, { useContext, useEffect, useState } from 'react';
import PreLoader from './PreLoader';
import { useRouter } from 'next/router';
import useColorMode from "@/hooks/useColorMode";

function Header() {
  const logo = "/1280px-Dickinson_Red_Devils_D_logo.svg.png";

  const supabase = useSupabaseClient();
  const session = useSession();
  const [profile, setProfile] = useState({}); // Initialize profile state

  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const [colorMode, setColorMode] = useColorMode();
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== '') {
      router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

    useEffect(() => {
    const fetchProfile = async () => {
      if (session) {
        const { data, error } = await supabase
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

  return (
    <header className="sticky top-0 z-50 bg-white border-2 border-lightBorder dark:border-customBlack2 dark:bg-customBlack flex items-center p-2 lg:px-5 px-4">
      {/* Left */}
      <div className="px-4 flex items-center">
      <Link href="/">
        <Image
          src={logo}
          width="40"
          height="40"
          layout="fixed"
        />
        </Link>
        <div className="hidden md:inline-flex ml-2 items-center rounded-full bg-gray-100 p-2 dark:bg-customBlack2">
          <SearchIcon className="h-6 text-gray-600 dark:text-gray-200" />
            <form onSubmit={handleSearch}>
              <input
                className="hidden lg:inline-flex ml-2 bg-transparent outline-none placeholder-gray-600 dark:placeholder-gray-200 flex-shrink"
                placeholder="Search DsonMarket"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
        </div>
      </div>

      <div className="flex items-center sm:space-x-2 justify-end flex-grow">
        {/* user Image here with Name */}
        <div>
          {profile && profile.id ? ( // Check if profile and profile.id exist
            <Link href={`/profile/${profile.id}`}>
              <span className="cursor-pointer flex items-center">
                <div className="mr-3 font text-md dark:text-lightBG">{profile.name}</div>
                <Avatar url={profile.avatar} />
              </span>
            </Link>
          ) : (
            <div className='grow'>
              <PreLoader/>
            </div> // Show a loading state if profile is not yet available
          )}
        </div>
        <button
        className="p-2 rounded-full bg-transparent hover:scale-125"
        onClick={() => setColorMode(colorMode === 'light' ? 'dark' : 'light')}
      >
        {colorMode === 'dark' ? (
          <SunIcon className="h-6 w-6 text-white" />
        ) : (
          <MoonIcon className="h-6 w-6" />
        )}
      </button>
      </div>
    </header>
  );
}

export default Header;



 