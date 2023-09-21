import React, {useState} from 'react';
import {CameraIcon} from '@heroicons/react/outline';
// import {uploadUserProfileImage} from '../Helpers/user';
import {useSession, useSupabaseClient} from '@supabase/auth-helpers-react';
import PreLoader from './PreLoader';
import ImgEditor from './ImgEditor';

/**
 * Avatar component for displaying user profile avatars.
 *
 * @component
 * @param {Object} props - The component's props.
 * @param {string} props.size - The size of the avatar ('lg', 'md', 'sm').
 * @param {string} props.url - The URL of the avatar image.
 * @param {boolean} props.editable - Whether the avatar is editable.
 * @param {Function} props.onChange - Function to handle avatar change.
 * @return {JSX.Element} The Avatar component.
 */
function Avatar({size, url, editable, onChange}) {
  const supabase = useSupabaseClient();
  const session = useSession();
  // const [isUploading, setIsUploading] = useState(false);
  const [isUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  /**
   * Opens the image editor modal.
   */
  function openModal() {
    setIsModalOpen(true);
  }

  /**
   * Closes the image editor modal.
   */
  function closeModal() {
    setIsModalOpen(false);
  }

  let width = 'w-14';
  let height = 'h-14';
  const borderRadius = 'rounded-full';

  if (size === 'lg') {
    width = 'md:w-48 w-32';
    height = 'md:h-48 h-32';
  }

  if (size === 'sm') {
    width = 'w-16 flex-shrink-0';
    height = 'h-16';
  }

  return (
    <div className={`hover:border-4 border-customGray dark:border-taupe rounded-full relative flex items-center justify-center ${width} ${height}`}>
      {url ? (
        <div className={`${borderRadius} overflow-hidden bg-gray-200`}>
          <img src={url} alt="" className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className={`${borderRadius} bg-gray-200 flex items-center justify-center text-gray-400 text-md font-bold p-2 ${editable && 'mt-16'}`} >
          No Avatar
        </div>
      )}

      {isUploading && (
        <div className='absolute inset-0 bg-white bg-opacity-80 flex items-center z-10'>
          <div className='inline-block mx-auto'><PreLoader /></div>
        </div>
      )}

      {editable && (
        <>
          <button className='absolute bottom-0 right-0 hover:scale-110 border-2 border-lightBorder dark:border-customBlack p-2 bg-white rounded-full cursor-pointer dark:bg-customBlack2' onClick={openModal}>
            <CameraIcon className='h-7 w-7 dark:text-lightBG' />
          </button>
          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-75">
              <div className="modal-content dark:bg-customBlack border-2 dark:border-customBlack2 border-x-customGray p-3 rounded-lg">
                <ImgEditor supabase={supabase} session={session}/>
                <button className='mt-2 border-2 dark:border-customBlack2 p-2 rounded-lg dark:bg-customBlack dark:text-lightBG hover:scale-105 font-semibold' onClick={closeModal}>Close</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Avatar;
