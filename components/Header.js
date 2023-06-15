import Image from "next/legacy/image";
import HeaderIcon from "./HeaderIcon";
import {
  SearchIcon,
  DotsVerticalIcon,
  CogIcon,
} from "@heroicons/react/outline";
import Avatar from "./Avatar";
import Link from 'next/link';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import { UserContext } from '@/contexts/UserContext';
import React, { useContext, useEffect, useState } from 'react';
import PreLoader from './PreLoader';
import { useRouter } from 'next/router';

function Header() {
  const logo = "D:/React/dson-market/resources/images/1280px-Dickinson_Red_Devils_D_logo.svg.png";

  const supabase = useSupabaseClient();
  const session = useSession();
  const [profile, setProfile] = useState({}); // Initialize profile state

  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

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
    <header className="sticky top-0 z-50 bg-white flex items-center p-2 lg:px-5 px-4 shadow-md">
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
        <div className="hidden md:inline-flex ml-2 items-center rounded-full bg-gray-100 p-2">
          <SearchIcon className="h-6 text-gray-600" />
            <form onSubmit={handleSearch}>
              <input
                className="hidden lg:inline-flex ml-2 bg-transparent outline-none placeholder-gray-500 flex-shrink"
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
              <span className="cursor-pointer">
                <Avatar url={profile.avatar} />
              </span>
            </Link>
          ) : (
            <div className='grow'>
              <PreLoader/>
            </div> // Show a loading state if profile is not yet available
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;



   {/* <a href="" className="block mb-2 text-gray-800"><ChatIcon className="rounded-full cursor-pointer h-8 w-8" /></a> */}
        {/* <a href="#" className="block" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
          <BellIcon className="icon" />
        </a> */}
        {/* <div className="px-1 text-gray-800 ">
              {!dropdownOpen && (
                <button className='' onClick={openDropDown}>
                <BellIcon className="rounded-full cursor-pointer h-8 w-8" />
                </button>
              )}             
              {dropdownOpen && (
              <button className=''>
                <BellIcon className="rounded-full cursor-pointer h-8 w-8" />
              </button>
              )}
              <ClickOutHandler onClickOut={handleClickOutSideDropdown}>
                <div className='relative'>
                  {dropdownOpen && (
                    <div className='absolute mt-2 -right-6 bg-white shadow-md shadow-gray-300 p-3 rounded-sm border border-gray-100 w-80'>
                      <NotificationInfo/>
                      <NotificationInfo/>
                      <NotificationInfo/>
                    </div>
                  )}
                </div>          
              </ClickOutHandler>
          </div> */}
        {/* <a href="" className="block text-gray-800"><CogIcon className="rounded-full cursor-pointer h-8 w-8" /></a> */}