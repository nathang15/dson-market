/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
import React, {useContext, useEffect, useRef, useState} from 'react';
import Card from './Card';
import Avatar from './Avatar';
import Link from 'next/link';
import {
  CameraIcon,
  XIcon,
} from '@heroicons/react/solid';
import {
  DotsHorizontalIcon,
  ThumbUpIcon,
  ChatAlt2Icon,
  BookmarkIcon,
  TrashIcon,
  ExclamationIcon,
  PencilIcon,
  ShoppingBagIcon,
  ChatAltIcon,
} from '@heroicons/react/outline';
import ReactTimeAgo from 'react-time-ago';
import {UserContext} from '@/contexts/UserContext';
import {useSession, useSupabaseClient} from '@supabase/auth-helpers-react';
import PhotoModal from './PhotoModal';
import OptimizedImage from './OptimizedImage';

/**
 * A component representing a single post card.
 *
 * @param {Object} props - The component's props.
 * @param {number} props.id - The unique identifier of the post.
 * @param {string} props.content - The content of the post.
 * @param {string} props.created_at - The creation date of the post.
 * @param {Array<string>} props.photos - An array of photo URLs associated with the post.
 * @param {boolean} props.sold - Indicates whether the post is marked as sold.
 * @param {Object} props.profiles - The author's profile information.
 * @return {React.Element} - The rendered component.
 */
function PostCard({id, content, created_at, photos, sold, profiles: authorProfile, onPost}) {
  // State variables
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const {profile: myProfile} = useContext(UserContext);
  const supabase = useSupabaseClient();
  const [likes, setLikes] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const [isSaved, setIsSaved] = useState(false);
  const [showReportPopup, setShowReportPopup] = useState(false);
  const [showDeleteCommentPopup, setShowDeleteCommentPopup] = useState(false);
  const [showSavePopup, setShowSavePopup] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploads, setUploads] = useState([]);
  const [isPosted, setIsPosted] = useState(false);
  const [isPostedComment, setIsPostedComment] = useState(false);
  const session = useSession();
  const [newContent, setNewContent] = useState(content);
  const [isEdit, setIsEdit] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  // Fetch likes, comments, and check if the post is saved on component mount or when myProfile.id changes
  useEffect(() => {
    fetchLikes();
    fetchComments();
    if (myProfile?.id) fetchIsSaved();
  }, [myProfile?.id]);

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
   * Create a new post based on the content and photos provided.
   * Accepted post must follow the rule
   */
  function updatePost() {
    const lowerContent = newContent.toLowerCase();
    const hasWTB = /(^|\s)#wtb(\s|$)/i.test(lowerContent);
    const hasWTS = /(^|\s)#wts(\s|$)/i.test(lowerContent);
    const hasWTBlong = /(^|\s)#wanttobuy(\s|$)/i.test(lowerContent);
    const hasWTSlong = /(^|\s)#wanttosell(\s|$)/i.test(lowerContent);
    if (!hasWTB && !hasWTS && !hasWTSlong && !hasWTBlong) {
      setErrorMessage('Invalid post input. Please include either #wtb, #wts, #wanttobuy, or #wanttosell.');
      return;
    }

    if ((hasWTS || hasWTSlong) && (photos.length + uploads.length) === 0) {
      setErrorMessage('Invalid post input. Please include at least 1 photo for #wts posts.');
      return;
    }

    const words = newContent.trim().split(/\s+/);
    const otherWords = words.filter((word) => !word.startsWith('#'));

    if (otherWords.length === 0) {
      setErrorMessage('Invalid post input. Please include content in your post.');
      return;
    }
    supabase.from('posts').update({
      content: newContent,
    }).eq('id', id).then((response) => {
      if (!response.error) {
        setNewContent(newContent);
        setErrorMessage('');
        // setUploads([]);
        setIsPosted(true);
        if (onPost) {
          onPost();
          setIsEdit(false);
        }
      }
    });
  }

  /**
 * Cancel the current post form and reset form values.
 */
  function cancelPost() {
    setNewContent(content);
    setErrorMessage('');
    setIsEdit(false);
    // setUploads([]);
    adjustTextareaHeight(null); // Pass null to reset the textarea height
  }

  useEffect(() => {
    if (isPosted) {
      setIsPosted(false); // Reset the isPosted state to allow reloading the component
    }
  }, [isPosted]);

  const handleTextareaChange = (e) => {
    setNewContent(e.target.value);
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
    if (newContent) {
      const textarea = document.getElementById('post-content');
      if (textarea) {
        adjustTextareaHeight(textarea);
      }
    }
  }, [newContent]);

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
   * Fetches the saved status each posts (check if the user has saved the post or not)
   */
  function fetchIsSaved() {
    supabase
        .from('saved_posts')
        .select()
        .eq('post_id', id)
        .eq('user_id', myProfile?.id)
        .then((result) => {
          if (result.data.length > 0) {
            setIsSaved(true);
          } else {
            setIsSaved(false);
          }
        });
  }

  /**
   * Handles the submission of a report for the post
   * @param {Event} e - event
   */
  function handleReportSubmit(e) {
    e.preventDefault();
    setShowReportPopup(true);

    // Hide the popup after a few seconds
    setTimeout(() => {
      setShowReportPopup(false);
    }, 3000);
  }

  /**
   * Deletes the comment
   */
  function handleDeleteComment() {
    setShowDeleteCommentPopup(true);

    // Hide the popup after a few seconds
    setTimeout(() => {
      setShowDeleteCommentPopup(false);
    }, 3000);
  }

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

  /**
   * Fetches likes for the post.
   */
  function fetchLikes() {
    supabase.from('likes').select().eq('post_id', id)
        .then((result) => setLikes(result.data));
  }

  /**
   * Fetches comments for the post.
   */
  function fetchComments() {
    supabase.from('posts')
        .select('*, profiles(*)')
        .eq('parent', id)
        .order('created_at', {ascending: true})
        .then((result) => setComments(result.data));
  }

  // Checks if the current user has liked the post
  const isLikedByMe = !!likes.find((like) => like.user_id === myProfile?.id);

  /**
   * Toggles the like status for the post
   */
  function toggleLike() {
    const newLikes = isLikedByMe ? likes.filter((like) => like.user_id !== myProfile.id) : [...likes, {user_id: myProfile.id}];
    setLikes(newLikes);

    if (isLikedByMe) {
      supabase
          .from('likes')
          .delete()
          .eq('post_id', id)
          .eq('user_id', myProfile.id)
          .then(() => {
            fetchLikes();
          });
    } else {
      supabase
          .from('likes')
          .insert({
            post_id: id,
            user_id: myProfile.id,
          })
          .then(() => {
            fetchLikes();
          });
    }
  }

  /**
   * Toggles the saved status for the post
   */
  function toggleSave() {
    if (isSaved) {
      supabase
          .from('saved_posts')
          .delete()
          .eq('post_id', id)
          .eq('user_id', myProfile?.id)
          .then((result) => {
            setIsSaved(false);
            setDropdownOpen(false);
            setShowSavePopup(true);
            setTimeout(() => {
              setShowSavePopup(false);
            }, 5000);
            if (window.location.pathname === '/saved') {
              window.location.reload();
            }
          });
    } else {
      supabase
          .from('saved_posts')
          .insert({
            user_id: myProfile.id,
            post_id: id,
          })
          .then((result) => {
            setIsSaved(true);
            setDropdownOpen(false);
            setShowSavePopup(true);
            setTimeout(() => {
              setShowSavePopup(false);
            }, 5000);
          });
    }
  }

  // Function to toggle the 'sold' column in the 'posts' table
  const toggleSoldStatus = async (e) => {
    e.preventDefault();

    const {data, error} = await supabase
        .from('posts')
        .update({sold: !sold})
        .eq('id', id)
        .select();


    if (error) {
      console.error('Sold request error:', error);
    }
    if (data) {
      console.log('Post set sold successfully:', sold);
      // Perform any additional actions after successful post deletion
      // window.location.reload();
    }
  };

  /**
   * Submits a comment for the post
   * @param {Event} ev - event
   */
  function postComment(ev) {
    ev.preventDefault();
    if (!commentText.trim()) {
      // If commentText is empty or contains only spaces, do not proceed with the insert.
      return;
    }
    supabase.from('posts')
        .insert({
          content: commentText,
          author: myProfile.id,
          photos: uploads,
          parent: id,
        })
        .then((result) => {
          console.log(result);
          const newCommentsNumber = comments.length + 1;
          supabase.from('posts')
              .update({comments_number: newCommentsNumber})
              .eq('id', id) // Assuming 'id' is the primary key of your posts table
              .then((updateResult) => {
                console.log(updateResult);
              })
          fetchComments();
          setCommentText('');
          setUploads([]);
          setIsPostedComment(true);
        });
  }

  /**
   * Opens the photo modal of the selected photo
   * @param {Object} photo - the selected photo
   */
  function openPhotoModal(photo) {
    setSelectedPhotoIndex(photo);
    setIsModalOpen(true);
  }

  /**
   * Closes the photo modal of the selected photo
   * @param {Object} photo - the selected photo
   */
  function closePhotoModal() {
    setIsModalOpen(false);
  }

  // Navigate to previous photo in photo modal
  const navigateToPreviousPhoto = () => {
    setSelectedPhotoIndex((prevIndex) => (prevIndex === 0 ? photos.length - 1 : prevIndex - 1));
  };

  // Navigate to next photo in photo modal
  const navigateToNextPhoto = () => {
    setSelectedPhotoIndex((prevIndex) => (prevIndex === photos.length - 1 ? 0 : prevIndex + 1));
  };

  // Close the photo modal when pressing the escape key and navigate using arrow keys
  const handleKeyDown = (event) => {
    if (event.key === 'ArrowLeft') {
      navigateToPreviousPhoto();
    } else if (event.key === 'ArrowRight') {
      navigateToNextPhoto();
    } else if (event.key === 'Escape') {
      closePhotoModal();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Deletes the post
  const deletePost = async () => {
    try {
      const {data: savedData, error: savedError} = await supabase
          .from('saved_posts')
          .delete()
          .match({post_id: id});

      if (savedError) {
        console.error('Saved Posts delete error:', savedError);
      } else {
        console.log('Saved Posts removed successfully:', savedData);
      }

      // Delete likes where post_id matches the current post's id
      const {data: likesData, error: likesError} = await supabase
          .from('likes')
          .delete()
          .match({post_id: id});

      if (likesError) {
        console.error('Likes delete error:', likesError);
      } else {
        console.log('Likes removed successfully:', likesData);

        // Delete the posts with parent column matching the ID of the current post
        const {data: childPostsData, error: childPostsError} = await supabase
            .from('posts')
            .delete()
            .match({parent: id});

        if (childPostsError) {
          console.error('Child posts delete error:', childPostsError);
        } else {
          console.log('Child posts deleted successfully:', childPostsData);
        }

        // Delete the post
        const {data: postData, error: postError} = await supabase
            .from('posts')
            .delete()
            .match({id});

        if (postError) {
          console.error('Post delete error:', postError);
        } else {
          console.log('Post deleted successfully:', postData);
          // Perform any additional actions after successful post deletion
        }
      }
    } catch (error) {
      console.error('Delete request error:', error);
    }
  };

  // The maximum number of visible comments is 5
  const [visibleComments, setVisibleComments] = useState(5);

  // Load more comments if there are more than 5 comments
  const loadMoreComments = () => {
    setVisibleComments((prevVisibleComments) => prevVisibleComments + 5);
  };

  // User deletes their own comment
  const deleteComment = async (commentId) => {
    const {data: postData, error: postError} = await supabase
        .from('posts')
        .delete()
        .eq('id', commentId); // Use 'id' to target the specific comment

    if (postError) {
      console.error('Comment delete error:', postError);
    } else {
      console.log('Comment deleted successfully:', postData);
      const newCommentsNumber = comments.length - 1;
      supabase.from('posts')
          .update({comments_number: newCommentsNumber})
          .eq('id', id) // Assuming 'id' is the primary key of your posts table
          .then((updateResult) => {
            console.log(updateResult);
          })
    }
  };

  /**
   * Add photos to the post form of the comment
   * @param {Event} ev - event
   */
  async function addPhotos(ev) {
    const files = ev.target.files;
    if (files.length > 0) {
      if (files.length > 3) {
        // Display an error message when the limit is exceeded
        alert('You can only upload a maximum of 3 photos at a time.');
        return;
      }

      setIsUploading(true);

      for (const file of files) {
        if (uploads.length >= 3) {
          // If the limit is reached during the loop, break out of it
          alert('You can only upload a maximum of 3 photos at a time.');
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
          const url =
              process.env.NEXT_PUBLIC_SUPABASE_URL +
              '/storage/v1/object/public/photos/' +
              result.data.path;
          setUploads((prevUploads) => [...prevUploads, url]);
        } else {
          console.log(result);
        }
      }
      setIsUploading(false);
    }
  }

  /**
   * Remove the selected photo from the intended photos to be posted in the comment
   * @param {int} index - the index of the selected photo
   */
  function removePhoto(index) {
    setUploads((prevUploads) => prevUploads.filter((_, i) => i !== index));
  }

  /**
   * Set edit post status
   */
  function setEditPost() {
    setIsEdit(true);
  }

  if ( isPosted == true ) {
    setIsPosted(false);
    setIsEdit(false);
  }

  return (
    <Card noPadding={undefined} isUserCard={undefined}>
      {/* Post header */}
      <div className="flex gap-3">
        <div>
          <Link href={'/profile/' + authorProfile.id}>
            <span className='cursor-pointer'>
              <Avatar url={authorProfile.avatar} size={''} editable={false} />
            </span>
          </Link>
        </div>
        <div className="grow">
          <p className='dark:text-lightBG md:text-md text-sm'>
            <Link href={'/profile/' + authorProfile.id}>
              <span className="font-semibold hover: animate-underline2 hover:scale-105 transition-all cursor-pointer">
                {authorProfile.name || `User ${authorProfile?.id}`}{' '}
              </span>
            </Link> {sold ? 'sold a' : 'posted a'} <a className="text-red-500 font-semibold">listing</a>
          </p>
          <p className="text-gray-400 text-sm font-semibold">
            <ReactTimeAgo date={(new Date(created_at)).getTime()} />
          </p>
        </div>
        <div>
          {/* Dropdown menu */}
          {!dropdownOpen && (
            <button className='text-gray-300' onClick={openDropDown}>
              <DotsHorizontalIcon className="h-7 text-gray-500 dark:text-lightBG" />
            </button>
          )}
          {dropdownOpen && (
            <button className='text-gray-300'>
              <DotsHorizontalIcon className="h-7 text-gray-500 dark:text-lightBG" />
            </button>
          )}
          <div ref={dropdownRef}>
            <div className='relative'>
              {dropdownOpen && (
                <div className='absolute -right-6 bg-white p-3 rounded-sm border-2 dark:bg-customBlack dark:border-customBlack2 border-lightBorder w-52 z-10'>
                  { /* Chat Button */ }
                  <Link href={'/profile/' + authorProfile.id + '/chat'}>
                    <button
                      className="w-full -my-2"
                    >
                      <span className='group flex gap-2 py-2 my-2 hover:bg-red-500 hover:text-white -mx-4 px-4 rounded-md transition-all hover:scale-110 hover:shadow-md shadow-gray-300 dark:text-lightBG'>
                        <ChatAltIcon className="h-6 text-gray-800 group-hover:text-white dark:text-lightBG" />
                      Chat
                      </span>
                    </button>
                  </Link>
                  {/* Save button */}
                  <button onClick={toggleSave} className='w-full -my-2'>
                    <span className='group flex gap-2 py-2 my-2 hover:bg-red-500 hover:text-white -mx-4 px-4 rounded-md transition-all hover:scale-110 hover:shadow-md shadow-gray-300 dark:text-lightBG'>
                      {isSaved && (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l1.664 1.664M21 21l-1.5-1.5m-5.485-1.242L12 17.25 4.5 21V8.742m.164-4.078a2.15 2.15 0 011.743-1.342 48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185V19.5M4.664 4.664L19.5 19.5" />
                        </svg>
                      )}
                      {!isSaved && (
                        <BookmarkIcon className="h-6 text-gray-800 group-hover:text-white dark:text-lightBG" />
                      )}
                      {isSaved ? 'Remove from saved' : 'Save Listing'}
                    </span>
                  </button>
                  {/* Edit button */}
                  {myProfile?.id && myProfile.id === authorProfile.id && (
                    <button onClick={isEdit == true ? cancelPost : setEditPost} className='w-full -my-2'>
                      <span className='group flex gap-2 py-2 my-2 hover:bg-red-500 hover:text-white dark:text-lightBG -mx-4 px-4 rounded-md transition-all hover:scale-110 hover:shadow-md shadow-gray-300'>
                        <PencilIcon className="h-6 text-gray-800 dark:text-lightBG group-hover:text-white" />
                        {isEdit == true ? 'Cancel Edit' : 'Edit Post'}
                      </span>
                    </button>
                  )}
                  {/* Set Exchange Status button */}
                  {/* <a href="" className='group flex gap-2 py-2 my-2 hover:bg-red-500 hover:text-white -mx-4 px-4 rounded-md transition-all hover:scale-110 hover:shadow-md shadow-gray-300'><BellIcon className="h-6 text-gray-800 group-hover:text-white" />Turn Notifications</a> */}
                  {myProfile?.id && myProfile.id === authorProfile.id && (
                    <button onClick={toggleSoldStatus} className='w-full -my-2'>
                      <span className='group flex gap-2 py-2 my-2 hover:bg-red-500 hover:text-white dark:text-lightBG -mx-4 px-4 rounded-md transition-all hover:scale-110 hover:shadow-md shadow-gray-300'>
                        <ShoppingBagIcon className="h-6 text-gray-800 dark:text-lightBG group-hover:text-white" />
                        {sold ? 'Undo Exchange' : 'Exchange Done'}
                      </span>
                    </button>
                  )}
                  {/* Delete button */}
                  {myProfile?.id && myProfile.id === authorProfile.id && (
                    <button onClick={deletePost} className='w-full -my-2'>
                      <span className='group flex gap-2 py-2 my-2 hover:bg-red-500 dark:text-lightBG hover:text-white -mx-4 px-4 rounded-md transition-all hover:scale-110 hover:shadow-md shadow-gray-300'>
                        <TrashIcon className="h-6 text-gray-800 dark:text-lightBG group-hover:text-white" />Delete Post
                      </span>
                    </button>
                  )}
                  {/* Report button */}
                  <button
                    className="w-full -my-2"
                    onClick={handleReportSubmit}
                  >
                    <span className='group flex gap-2 py-2 my-2 hover:bg-red-500 hover:text-white -mx-4 px-4 rounded-md transition-all hover:scale-110 hover:shadow-md shadow-gray-300 dark:text-lightBG'>
                      <ExclamationIcon className="h-6 text-gray-800 group-hover:text-white dark:text-lightBG" />
                      Report
                    </span>
                  </button>
                </div>
              )}
              {showReportPopup && (
                <div className="fixed bottom-5 right-5 bg-red-500 p-2 rounded-md shadow-md">
                  <p className="text-sm text-white">Post reported. Thank you for your feedback!</p>
                </div>
              )}
              {showDeleteCommentPopup && (
                <div className="fixed bottom-5 right-5 bg-red-500 p-2 rounded-md shadow-md">
                  <p className="text-sm text-white">Comment Deleted. May take some time to reflect changes.</p>
                </div>
              )}
              {showSavePopup && (
                <div className="fixed bottom-5 right-5 bg-red-500 p-2 rounded-md shadow-md">
                  <p className="text-sm text-white">{isSaved ? 'Post Saved' : 'Post Unsaved'}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Post content */}
      <div>
        {isEdit == true ? (
        <textarea
          value={newContent}
          onChange={handleTextareaChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              const textarea = e.target as HTMLTextAreaElement;
              const { selectionStart, selectionEnd } = textarea;
              const editContent = `${newContent.substring(0, selectionStart)}\n${newContent.substring(selectionStart, selectionEnd)}${newContent.substring(selectionEnd)}`;
              const newCursorPosition = selectionStart + 1;
              setNewContent(editContent);
              adjustTextareaHeight(e.target);
              setTimeout(() => {
                textarea.setSelectionRange(newCursorPosition, newCursorPosition);
              }, 0);
            }
          }}
          className="mt-3 w-full h-full px-3 py-3 rounded-lg bg-lightBG placeholder-gray-600 dark:bg-customBlack2 dark:placeholder-gray-200 dark:text-white"
        />
        ) :
        (
        <pre className='whitespace-pre-wrap font-sans my-3 dark:text-lightBG'>{content}</pre>
        )
        }
        <div className='grow text-right flex-col justify-end items-center mb-3'>
          {isEdit == true && (
            <>
              <button onClick={cancelPost} className='bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-1 rounded-md mt-2 dark:bg-customBlack border-2 dark:border-customBlack2 hover:scale-110 dark:text-lightBG'>Cancel</button>
              {newContent != content && (
                <button onClick={updatePost} className='bg-red-500 hover:scale-110 text-white px-6 py-1 rounded-md mt-2 dark:bg-customBlack dark:border-customBlack2 dark:border-2'>Update</button>
              )}
            </>
          )}
          {errorMessage && (
            <p className='text-red-500 text-sm mt-1'>{errorMessage}</p>
          )}
        </div>
        {/* Post photos */}
        {photos?.length > 0 && (
          <div>
            {photos.length === 1 ? (
              <div className='rounded-md overflow-hidden cursor-pointer' onClick={() => openPhotoModal(0)}>
                <OptimizedImage src={photos[0]} className='mx-auto w-full h-full object-cover' alt=""/>
              </div>
            ) : (
              <div>
                {photos.length <= 4 ? (
                  <div className='grid grid-cols-2 gap-2'>
                    {photos.map((photo, index) => (
                      <div key={photo} className='rounded-md overflow-hidden cursor-pointer' onClick={() => openPhotoModal(index)}>
                        <OptimizedImage src={photo} className='mx-auto w-full h-full object-cover' alt="" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className='grid grid-cols-2 gap-2'>
                    {photos.slice(0, 3).map((photo, index) => (
                      <div key={photo} className='rounded-md overflow-hidden cursor-pointer' onClick={() => openPhotoModal(index)}>
                        <OptimizedImage src={photo} className='mx-auto w-full h-full object-cover' alt="" />
                      </div>
                    ))}
                    <div className='relative rounded-md overflow-hidden cursor-pointer' onClick={() => openPhotoModal(3)}>
                      <img src={photos[3]} className='mx-auto w-full h-full object-cover opacity-100' alt="" />
                      <div className='absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-60'>
                        <span className='text-white text-6xl'>+{photos.length - 3}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Photo modal */}
        {isModalOpen && (
          <PhotoModal photo={photos[selectedPhotoIndex]} onClose={closePhotoModal} onNavigateLeft={navigateToPreviousPhoto} onNavigateRight={navigateToNextPhoto} />
        )}
      </div>

      {/* Post actions */}
      <div className='mt-4 flex gap-8'>
        <button className='flex gap-1 items-center' onClick={toggleLike}>
          {/* Like button */}
          <ThumbUpIcon
            className={`h-6 w-6 text-gray-800 dark:text-lightBorder ${
              isLikedByMe ? 'fill-red-500 dark:text-lightBG' : ''
            }`}
          />
          <span className='dark:text-lightBG'>
            {likes?.length}
          </span>
        </button>
        {/* Comment button */}
        <button className='flex gap-1 items-center'>
          <ChatAlt2Icon className="h-6 w-6 text-gray-800 dark:text-lightBG" />
          <span className='dark:text-lightBG  '>
            {comments.length}
          </span>
        </button>
      </div>
      <div className='flex mt-4 gap-3'>
        <div>
          <Link href={'/profile/' + myProfile?.id}>
            <span className='cursor-pointer'>
              <Avatar url={myProfile?.avatar} size={''} editable={false} />
            </span>
          </Link>
        </div>
        {/* Comment input */}
        <div className='grow rounded-full h-12 dark:border-2 border-lightBorder dark:border-customBlack2 relative'>
          <form onSubmit={postComment} className='flex items-center'>
            <div className="relative flex-grow">
              <input
                value={commentText}
                onChange={(ev) => setCommentText(ev.target.value)}
                className={`text-sm md:text-md dark:text-white bg-lightBG block w-full p-3 px-4 overflow-hidden h-12 rounded-full dark:bg-customBlack2 dark:placeholder-lightBorder${
                  sold ? 'opacity-50 pointer-events-none' : ''
                }`}
                onFocus={(e) => e.target.placeholder = ''}
                onBlur={(e) => e.target.placeholder = sold ? 'This exchange is completed' : 'Leave a comment'}
                placeholder={sold ? 'Exchange completed!' : (!myProfile.name ? 'Please set a name before you can comment' : 'Leave a comment')}
                disabled={sold || !myProfile.name}
              />
              <label className='flex gap-1 -mt-14 hover:scale-110 cursor-pointer absolute right-0 top-0'>
                <input type="file" className='hidden' multiple onChange={addPhotos} />
                <CameraIcon className={`h-7 ${sold? 'text-gray-300 hidden' : 'text-red-500 dark:text-gray-300'} mr-3 mt-16`} />
              </label>
            </div>
          </form>
        </div>
      </div>
      {/* Photo preview */}
      {uploads.length > 0 && (
        <div className="flex mt-2 gap-2">
          {uploads.map((upload, index) => (
            <div key={index} className="relative">
              <img src={upload} alt="" className="w-auto h-16 rounded-md" />
              <button
                onClick={() => removePhoto(index)}
                className="absolute top-0 right-0 p-1 bg-white rounded-full text-gray-500 hover:bg-gray-200 transition"
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
      <div>
        {/* Comment section */}
        {comments.slice(0, visibleComments).map((comment) => (
          <div key={comment.id} className="mt-2 flex gap-2 items-center">
            <Link href={'/profile/' + comment.profiles.id}>
              <span className='cursor-pointer'>
                <Avatar url={comment.profiles.avatar} size={''} editable={false} />
              </span>
            </Link>
            <div className="bg-lightBG py-2 px-4 rounded-3xl dark:bg-customBlack2">
              <div className='flex items-center'>
                <Link href={'/profile/' + comment.profiles.id}>
                  <span className="md:text-md text-xs hover:underline font-semibold mr-1 dark:text-lightBG">
                    {comment.profiles.name}
                  </span>
                </Link>
                <span className="text-xs text-gray-400">
                  <ReactTimeAgo timeStyle={'twitter'} date={(new Date(comment.created_at)).getTime()} />
                </span>
                {session?.user?.id == comment.profiles.id && (
                  <button
                    onClick={() => {
                      deleteComment(comment.id);
                      handleDeleteComment();
                    }}
                    className="relative group"
                  >
                    <XIcon className='h-4 text-red-500 dark:text-gray-300 md:ml-4 ml-2' />
                    <span className="opacity-0 dark:bg-black bg-taupe text-white text-center text-xs rounded-lg py-2 absolute z-10 w-32 left-1/2 transform -translate-x-1/2 top-full mt-2 pointer-events-none transition-opacity duration-300 group-hover:opacity-100">
                    Delete the comment
                    </span>
                  </button>

                )}

              </div>
              <p className="md:text-sm text-xs dark:text-lightBG">{comment.content}</p>
              {comment.photos && comment.photos.length > 0 && (
                <div className='flex gap-2 mt-1'>
                  {comment.photos.map((photo, index) => (
                    <div key={photo} className='rounded-md overflow-hidden cursor-pointer'
                      // onClick={() => openPhotoModal(index)}
                    >
                      <img src={photo} className='mx-auto w-full h-full object-cover' alt="" />
                    </div>
                  ))}
                  {/* {isModalOpen && (
                      <PhotoModal photo={comment.photos[selectedPhotoIndex]} onClose={closePhotoModal} onNavigateLeft={navigateToPreviousPhoto} onNavigateRight={navigateToNextPhoto} />
                    )} */}
                </div>
              )}

            </div>
          </div>
        ))}
        {comments.length > visibleComments && (
          <button
            onClick={loadMoreComments}
            className="bg-red-400 text-white py-2 px-4 rounded-full mt-4 hover:bg-red-500"
          >
          Load More
          </button>
        )}
      </div>
    </Card>
  );
}

export default PostCard;

