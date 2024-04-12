import {UserContext} from '@/contexts/UserContext';
import {useSession, useSupabaseClient} from '@supabase/auth-helpers-react';
import React, {useContext, useEffect, useState} from 'react';
import Avatar from './Avatar';
import Card from './Card';
import {
  CameraIcon,
} from '@heroicons/react/outline';
import PreLoader from './PreLoader';
import Link from 'next/link';
import PostConfirmationPop from './PostConfirmationPop';

/**
 * PostFormCard component for creating and posting new content.
 * @component
 * @param {Object} props - The component's props.
 * @param {function} props.onPost - A callback function to execute after a successful post.
 * @return {JSX.Element|null} - Returns the PostFormCard component JSX or null if the post is successful.
 */
function PostFormCard({onPost}) {
  const supabase = useSupabaseClient();
  const [uploads, setUploads] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const session = useSession();
  const [content, setContent] = useState('');
  const {profile} = useContext(UserContext);
  const [errorMessage, setErrorMessage] = useState('');
  const [isPosted, setIsPosted] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  /**
   * Create a new post based on the content and photos provided.
   * Accepted post must follow the rule
   */
  function createPost() {
    const lowerContent = content.toLowerCase();
    const hasWTB = /(^|\s)#wtb(\s|$)/i.test(lowerContent);
    const hasWTS = /(^|\s)#wts(\s|$)/i.test(lowerContent);
    const hasWTBlong = /(^|\s)#wanttobuy(\s|$)/i.test(lowerContent);
    const hasWTSlong = /(^|\s)#wanttosell(\s|$)/i.test(lowerContent);
    if (!hasWTB && !hasWTS && !hasWTSlong && !hasWTBlong) {
      setErrorMessage('Invalid post input. Please include either #wtb, #wts, #wanttobuy, or #wanttosell.');
      return;
    }

    if (hasWTS || hasWTSlong && uploads.length === 0) {
      setErrorMessage('Invalid post input. Please include at least 1 photo for #wts posts.');
      return;
    }

    const words = content.trim().split(/\s+/);
    const otherWords = words.filter((word) => !word.startsWith('#'));

    if (otherWords.length === 0) {
      setErrorMessage('Invalid post input. Please include content in your post.');
      return;
    }
    if (hasWTS || hasWTSlong) {
      // Show the confirmation popup for #wts posts
      setShowConfirmation(true);
      return;
    }
    supabase.from('posts').insert({
      author: session.user.id,
      content,
      photos: uploads,
    }).then((response) => {
      if (!response.error) {
        setContent('');
        setErrorMessage('');
        setUploads([]);
        setIsPosted(true);
        if (onPost) {
          onPost();
        }
      }
    });
  }

  /**
   * Create a new post based on the content and photos provided.
   * Accepted post must follow the rule
   */
  function createPostAfterConfirm() {
    supabase.from('posts').insert({
      author: session.user.id,
      content,
      photos: uploads,
    }).then((response) => {
      if (!response.error) {
        setContent('');
        setErrorMessage('');
        setUploads([]);
        setIsPosted(true);
        if (onPost) {
          onPost();
        }
      }
    });
  }

  /**
 * Cancel the current post form and reset form values.
 */
  function cancelPost() {
    setContent('');
    setErrorMessage('');
    setUploads([]);
    adjustTextareaHeight(null); // Pass null to reset the textarea height
  }

  useEffect(() => {
    if (isPosted) {
      setIsPosted(false); // Reset the isPosted state to allow reloading the component
    }
  }, [isPosted]);

  /**
 * Add photos to the list of uploads for the post.
 * @param {Event} ev - The input event containing selected files.
 */
  async function addPhotos(ev) {
    const files = ev.target.files;

    if (files.length > 0) {
      if (files.length > 8) {
        // Display an error message when the limit is exceeded
        alert('You can only upload a maximum of 8 photos at a time.');
        return;
      }

      setIsUploading(true);

      for (const file of files) {
        if (uploads.length >= 8) {
          // If the limit is reached during the loop, break out of it
          alert('You can only upload a maximum of 8 photos at a time.');
          break;
        }

        // Check the file size (in bytes), adjust the limit as needed
        const maxSizeInBytes = 5 * 1024 * 1024; // 5 MB as an example, adjust as needed
        if (file.size > maxSizeInBytes) {
          alert('File size exceeds the limit (5 MB). Please upload a smaller file.');
          continue; // Skip the current file
        }

        const validExtensions = ['png', 'jpg', 'jpeg'];
        const fileExtension = file.name.split('.').pop().toLowerCase();

        if (!validExtensions.includes(fileExtension)) {
          // Display an error message for invalid file types
          alert('Invalid file type. Please upload only png, jpg, or jpeg files.');
          continue; // Skip the current file
        }

        const newName = Date.now() + file.name;

        const result = await supabase
            .storage
            .from('photos')
            .upload(newName, file);

        if (result.data) {
          const url = process.env.NEXT_PUBLIC_SUPABASE_URL + '/storage/v1/object/public/photos/' + result.data.path;
          setUploads((prevUploads) => [...prevUploads, url]);
        } else {
          console.log(result);
        }
      }

      setIsUploading(false);
    }
  }


  const handleTextareaChange = (e) => {
    setContent(e.target.value);
    adjustTextareaHeight(e.target);
  };

  const adjustTextareaHeight = (textarea) => {
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    } else {
      const defaultHeight = '70px'; // Set the default height here
      const textareas = document.getElementsByTagName('textarea');
      for (let i = 0; i < textareas.length; i++) {
        textareas[i].style.height = defaultHeight;
      }
    }
  };

  useEffect(() => {
    if (content) {
      const textarea = document.getElementById('post-content');
      if (textarea) {
        adjustTextareaHeight(textarea);
      }
    }
  }, [content]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        cancelPost();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  /**
 * Remove the selected photo from the chain of photos to be posted
 * @param {int} index - The index of the selected photo.
 */
  function removePhoto(index) {
    setUploads((prevUploads) => prevUploads.filter((_, i) => i !== index));
  }

  if (isPosted) {
    return null; // Return null to hide the component after a successful post
  }

  return (
    <Card noPadding={undefined} isUserCard={undefined}>
      <div className='flex gap-2 max-w-2xl'>
        <div className='flex items-center'>
          <Link href={'/profile/' + profile.id}>
            <span className='cursor-pointer'>
              <Avatar url={profile.avatar} size={''} editable={false} />
            </span>
          </Link>
        </div>
        {profile.name ? (
              <textarea
                value={content}
                onChange={handleTextareaChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    const textarea = e.target as HTMLTextAreaElement;
                    const { selectionStart, selectionEnd } = textarea;
                    const newContent = `${content.substring(0, selectionStart)}\n${content.substring(selectionStart, selectionEnd)}${content.substring(selectionEnd)}`;
                    const newCursorPosition = selectionStart + 1;
                    setContent(newContent);
                    adjustTextareaHeight(textarea);
                    setTimeout(() => {
                      textarea.setSelectionRange(newCursorPosition, newCursorPosition);
                    }, 0);
                  }
                }}                
                className="grow p-3 rounded-lg bg-lightBG placeholder-gray-600 dark:bg-customBlack2 dark:placeholder-gray-200 dark:text-white md:text-md text-sm"
                placeholder = {`What do you want to sell or buy, ${profile.name}?`}
                onFocus={(e) => e.target.placeholder = ''}
                onBlur={(e) => e.target.placeholder = `What do you want to sell or buy, ${profile.name}?`}
              />

            ) : (
              <div className="mt-2 font-semibold flex items-center text-red-500">
                Please set a name before you can sell.
              </div>
            )}
      </div>
      {isUploading && (
        <div className='grow'>
          <PreLoader/>
        </div>
      )}
      {uploads.length > 0 && (
        <div className="flex gap-2 mt-2">
          {uploads.map((upload, index) => (
            <div key={index} className="relative">
              <img src={upload} alt="" className="w-auto h-24 rounded-md" />
              <button
                onClick={() => removePhoto(index)}
                className="absolute top-0 right-0 p-1 bg-white rounded-full text-gray-500 hover:bg-gray-200 transition-all"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414L11.414 11l5.293 5.293a1 1 0 11-1.414 1.414L10 12.414l-5.293 5.293a1 1 0 01-1.414-1.414L8.586 11 3.293 5.707a1 1 0 111.414-1.414L10 9.586l5.293-5.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      <div className='flex gap-5 items-center mt-2'>
        <div>
          {profile.name && (
            <label className='flex gap-1 mt-2 hover:scale-110 transition-all cursor-pointer'>
              <input type="file" className='hidden' multiple onChange={addPhotos}/>
              <CameraIcon className='h-7 text-red-500 dark:text-gray-300'/>
              <span className='hidden md:block mt-1 font-semibold text-gray-400 dark:text-gray-300'>Photos</span>
            </label>
          )}
        </div>
        <div className='grow text-right flex-col justify-end items-center'>
          {profile.name && (
            <>
              {content && (
                <button onClick={cancelPost} className='mr-2 transition-all bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-1 rounded-md mt-2 dark:bg-customBlack border-2 dark:border-customBlack2 hover:scale-110 dark:text-lightBG'>Cancel</button>
              )}
              <button onClick={createPost} className='bg-red-500 hover:scale-110 text-white px-6 py-1 rounded-md mt-2 dark:bg-customBlack dark:border-customBlack2 dark:border-2 transition-all'>Post</button>
            </>
          )}
          {errorMessage && (
            <p className='text-red-500 text-sm mt-1'>{errorMessage}</p>
          )}
        </div>
      </div>
      {showConfirmation && (
        <PostConfirmationPop
          onConfirm={() => {
            // Handle confirmation and post action here
            createPostAfterConfirm();
            setShowConfirmation(false);
          }}
          onCancel={() => {
            // Handle cancel action here
            setShowConfirmation(false);
          }}
        />
      )}
    </Card>
  );
}

export default PostFormCard;
