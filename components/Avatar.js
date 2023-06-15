import React from 'react';
import { CameraIcon } from "@heroicons/react/outline";
import { uploadUserProfileImage } from "../Helpers/user";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useState } from "react";
import PreLoader from './PreLoader';

function Avatar({ size, url, editable, onChange }) {
  const supabase = useSupabaseClient();
  const session = useSession();
  const [isUploading, setIsUploading] = useState(false);

  async function handleAvatarChange(ev) {
    const file = ev.target.files?.[0];
    if (file) {
      setIsUploading(true);
      await uploadUserProfileImage(supabase, session.user.id, file, 'avatars', 'avatar');
      setIsUploading(false);
      if (onChange) onChange();
    }
  }

  let width = 'w-14';
  let height = 'h-14';
  let borderRadius = 'rounded-full';

  if (size === 'lg') {
    width = 'md:w-48 w-32';
    height = 'md:h-48 h-32';
  }

  if (size === 'sm') {
    width = 'w-16 flex-shrink-0';
    height = 'h-16';
  }

  return (
    <div className={`relative flex items-center justify-center ${width} ${height}`}>
      {url ? (
        <div className={`${borderRadius} overflow-hidden bg-gray-200`}>
          <img src={url} alt="" className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className={`${borderRadius} bg-gray-200 flex items-center justify-center text-gray-400 text-md font-bold p-2 ${editable && 'mt-16'}`}>
          No Avatar
        </div>
      )}

      {isUploading && (
        <div className='absolute inset-0 bg-white bg-opacity-80 flex items-center z-10'>
          <div className='inline-block mx-auto'><PreLoader /></div>
        </div>
      )}

      {editable && (
        <label className='absolute bottom-0 right-0 shadow-md shadow-gray-500 p-2 bg-white rounded-full cursor-pointer'>
          <CameraIcon className='h-7 w-7' />
          <input type="file" className='hidden' onChange={handleAvatarChange} />
        </label>
      )}
    </div>
  )
}

export default Avatar;