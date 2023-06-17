import React from 'react'
import {
    CameraIcon,
  } from "@heroicons/react/outline";
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import PreLoader from './PreLoader';
import { useState } from 'react';
import { uploadUserProfileImage } from '@/Helpers/user';

function Cover({url,editable,onChange}) {
    const supabase = useSupabaseClient();
    const session = useSession();
    const [isUploading, setIsUploading] = useState(false);
    async function updateCover(ev) {
        const file = ev.target.files?.[0];
        if (file) {
          setIsUploading(true);
          await uploadUserProfileImage(supabase, session.user.id, file, 'covers', 'cover');
          setIsUploading(false);
          if (onChange) onChange();
        }
    }
  return (
    <div className='md:h-72 h-52 flex-shrink overflow-hidden flex justify-center items-center relative'>
        <div>
            <img src = {url} alt=""/>
        </div>
        {isUploading && (
            <div className='absolute inset-0 bg-white bg-opacity-80 flex items-center z-10'>
                <div className='inline-block mx-auto'><PreLoader/></div>
            </div>
        )}
        {editable && (
            <div className='absolute right-0 bottom-0 m-2'>
                <label className='hover:scale-110 flex items-center dark:text-lightBG bg-white py-1 px-2 rounded-md dark:bg-customBlack2 gap-1 cursor-pointer'><CameraIcon className='h-7 w-7 dark:text-lightBG'/>
                <input type="file" onChange={updateCover} className='hidden'/>Change cover image</label>
            </div>
        )}
    </div>
    
  );
}

export default Cover