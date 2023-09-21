import React from 'react';
import {
  CameraIcon,
} from '@heroicons/react/outline';
import {useSession, useSupabaseClient} from '@supabase/auth-helpers-react';
import PreLoader from './PreLoader';
import {useState} from 'react';
import {uploadUserProfileImage} from '@/Helpers/user';

/**
 * A React component for displaying and editing a user's cover image.
 *
 * @component
 * @param {Object} props - The component's props.
 * @param {string} props.url - The URL of the cover image to display.
 * @param {boolean} props.editable - Indicates whether the cover image is editable.
 * @param {Function} props.onChange - A callback function to be called when the cover image is changed.
 * @return {JSX.Element} - The rendered React element.
 */
function Cover({url, editable, onChange}) {
  const supabase = useSupabaseClient();
  const session = useSession();
  const [isUploading, setIsUploading] = useState(false);

  /**
   * Handles the update of the cover image when a new image is selected.
   *
   * @param {Event} ev - The event object representing the file input change.
   * @return {Promise<void>} - A Promise that resolves when the image is uploaded and the component is updated.
   */
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
          <label className='hover:scale-110 flex items-center dark:text-lightBG bg-white py-1 px-2 rounded-md dark:bg-customBlack2 gap-1 cursor-pointer'><CameraIcon className='md:h-7 md:w-7 h-4 w-4 dark:text-lightBG'/>
            <input type="file" onChange={updateCover} className='hidden'/><span className='md:text-md text-xs'>Change cover image</span></label>
        </div>
      )}
    </div>

  );
}

export default Cover;
