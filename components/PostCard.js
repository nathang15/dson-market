import React, { useContext, useEffect, useState } from 'react'
import Card from './Card'
import Avatar from "./Avatar";
import ClickOutHandler from 'react-clickout-handler';
import Link from "next/link";
import {
  CameraIcon,
  PhotographIcon,
} from "@heroicons/react/solid";
import {
  DotsHorizontalIcon,
  ThumbUpIcon,
  ChatAlt2Icon,
  BookmarkIcon,
  TrashIcon,
  ExclamationIcon,
  PencilIcon,
} from "@heroicons/react/outline";
import ReactTimeAgo from 'react-time-ago';
import { UserContext } from '@/contexts/UserContext';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import PhotoModal from './PhotoModal';

function PostCard({id, content, created_at, photos, profiles:authorProfile}) {
  // State variables
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const {profile:myProfile} = useContext(UserContext);
  const supabase = useSupabaseClient();
  const [likes, setLikes] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const [isSaved,setIsSaved] = useState(false);
  const [showReportPopup, setShowReportPopup] = useState(false);
  const [showSavePopup, setShowSavePopup] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

// Fetch likes, comments, and check if the post is saved on component mount or when myProfile.id changes
  useEffect(() => {
    fetchLikes();
    fetchComments();
    if (myProfile?.id) fetchIsSaved();
  }, [myProfile?.id]);

// Fetches whether the post is saved by the current user
  function fetchIsSaved() {
    supabase
      .from('saved_posts')
      .select()
      .eq('post_id', id)
      .eq('user_id', myProfile?.id)
      .then(result => {
        if (result.data.length > 0) {
          setIsSaved(true);
        } else {
          setIsSaved(false);
        }
      })
  }

  // Handles the submission of a report for the post
  function handleReportSubmit(e) {
    e.preventDefault();
    setShowReportPopup(true);

    // Hide the popup after a few seconds
    setTimeout(() => {
      setShowReportPopup(false);
    }, 3000);
  }

  // Opens the dropdown menu for post options
  function openDropDown(e) {
    e.stopPropagation();
    setDropdownOpen(true);
  }

  // Closes the dropdown menu when clicking outside
  function handleClickOutSideDropdown(e){
    e.stopPropagation();
    setDropdownOpen(false);
  }

  // Fetches the likes for the post
  function fetchLikes() {
    supabase.from('likes').select().eq('post_id', id)
      .then(result => setLikes(result.data));
  }

  // Fetches the comments for the post
  function fetchComments() {
    supabase.from('posts')
      .select('*, profiles(*)')
      .eq('parent', id)
      .then(result => setComments(result.data));
  }

  // Checks if the current user has liked the post
  const isLikedByMe = !!likes.find(like => like.user_id === myProfile?.id);

  // Toggles the like status for the post
  function toggleLike() {
    const newLikes = isLikedByMe ? likes.filter(like => like.user_id !== myProfile.id) : [...likes, { user_id: myProfile.id }];
    setLikes(newLikes);
  
    if (isLikedByMe) {
      supabase
        .from('likes')
        .delete()
        .eq('post_id', id)
        .eq('user_id', myProfile.id)
        .then(() => {
          fetchLikes();
        })
        .catch(() => {
          // If there was an error, revert the state back
          setLikes(likes);
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
        })
        .catch(() => {
          // If there was an error, revert the state back
          setLikes(likes);
        });
    }
  }
  
  // Toggles the saved status for the post
  function toggleSave() {
    if (isSaved) {
      supabase
        .from('saved_posts')
        .delete()
        .eq('post_id', id)
        .eq('user_id', myProfile?.id)
        .then(result => {
          setIsSaved(false);
          setDropdownOpen(false);
          setShowSavePopup(true);
          setTimeout(() => {
            setShowSavePopup(false);
          }, 5000);
          if (window.location.pathname === "/saved") {
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
        .then(result => {
          setIsSaved(true);
          setDropdownOpen(false);
          setShowSavePopup(true);
          setTimeout(() => {
            setShowSavePopup(false);
          }, 5000);
        });
    }
  }
  


  // Submits a comment for the post
  function postComment(ev) {
    ev.preventDefault();
    supabase.from('posts')
      .insert({
        content:commentText,
        author:myProfile.id,
        parent:id,
      })
      .then(result => {
        console.log(result);
        fetchComments();
        setCommentText('');
      })
  }

  // Opens the photo modal with the selected photo
  function openPhotoModal(photo) {
    setSelectedPhotoIndex(photo);
    setIsModalOpen(true);
  }
  
  // Closes the photo modal
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
    }
    else if (event.key === 'Escape') {
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
        const { data: savedData, error: savedError } = await supabase
        .from('saved_posts')
        .delete()
        .match({ post_id: id });
  
      if (savedError) {
        console.error('Saved Posts delete error:', savedError);
      } else {
        console.log('Saved Posts removed successfully:', savedData);
      }
      
      // Delete likes where post_id matches the current post's id
      const { data: likesData, error: likesError } = await supabase
        .from('likes')
        .delete()
        .match({ post_id: id });
  
      if (likesError) {
        console.error('Likes delete error:', likesError);
      } else {
        console.log('Likes removed successfully:', likesData);
        
        // Delete the posts with parent column matching the ID of the current post
        const { data: childPostsData, error: childPostsError } = await supabase
          .from('posts')
          .delete()
          .match({ parent: id });
  
        if (childPostsError) {
          console.error('Child posts delete error:', childPostsError);
        } else {
          console.log('Child posts deleted successfully:', childPostsData);
        }
  
        // Delete the post
        const { data: postData, error: postError } = await supabase
          .from('posts')
          .delete()
          .match({ id });
  
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
    window.location.reload();
  };
  
  return (
    <Card>
      {/* Post header */}
      <div className="flex gap-3">
        <div>
          <Link href={'/profile/' + authorProfile.id}>
            <span className='cursor-pointer'>
              <Avatar url={authorProfile.avatar} />
            </span>
          </Link>
        </div>
        <div className="grow">
          <p>
            <Link href={'/profile/' + authorProfile.id}>
            <span className="mr-1 font-semibold cursor-pointer hover:underline">
              {authorProfile.name || `User ${authorProfile?.id}`}
            </span>
            </Link> posted a <a className="text-red-500 font-semibold">listing</a>
          </p>
          <p className="text-gray-400 text-sm font-semibold">
            <ReactTimeAgo date={(new Date(created_at)).getTime()} />
          </p>
        </div>
        <div>
          {/* Dropdown menu */}
          {!dropdownOpen && (
            <button className='text-gray-300' onClick={openDropDown}>
              <DotsHorizontalIcon className="h-7 text-gray-500" />
            </button>
          )}
          {dropdownOpen && (
            <button className='text-gray-300'>
              <DotsHorizontalIcon className="h-7 text-gray-500" />
            </button>
          )}
          <ClickOutHandler onClickOut={handleClickOutSideDropdown}>
            <div className='relative'>
              {dropdownOpen && (
                <div className='absolute -right-6 bg-white shadow-md shadow-gray-300 p-3 rounded-sm border border-gray-100 w-52 z-10'>
                  {/* Save button */}
                  <button onClick={toggleSave} className='w-full -my-2'>
                    <span className='group flex gap-2 py-2 my-2 hover:bg-red-500 hover:text-white -mx-4 px-4 rounded-md transition-all hover:scale-110 hover:shadow-md shadow-gray-300'>
                      {isSaved && (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M3 3l1.664 1.664M21 21l-1.5-1.5m-5.485-1.242L12 17.25 4.5 21V8.742m.164-4.078a2.15 2.15 0 011.743-1.342 48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185V19.5M4.664 4.664L19.5 19.5" />
                        </svg>
                      )}
                      {!isSaved && (
                        <BookmarkIcon className="h-6 text-gray-800 group-hover:text-white" />
                      )}
                      {isSaved ? 'Remove from saved' : 'Save Listing'}
                    </span>
                  </button>
                  {/* Edit button */}
                  {/* <a href="" className='group flex gap-2 py-2 my-2 hover:bg-red-500 hover:text-white -mx-4 px-4 rounded-md transition-all hover:scale-110 hover:shadow-md shadow-gray-300'><BellIcon className="h-6 text-gray-800 group-hover:text-white" />Turn Notifications</a> */}
                  {/* {myProfile?.id && myProfile.id === authorProfile.id && (
                    <button onClick={editPost} className='w-full -my-2'>
                      <span className='group flex gap-2 py-2 my-2 hover:bg-red-500 hover:text-white -mx-4 px-4 rounded-md transition-all hover:scale-110 hover:shadow-md shadow-gray-300'>
                        <PencilIcon className="h-6 text-gray-800 group-hover:text-white" />Edit Post
                      </span>
                    </button>
                  )} */}
                  {/* Delete button */} 
                  {myProfile?.id && myProfile.id === authorProfile.id && (
                    <button onClick={deletePost} className='w-full -my-2'>
                      <span className='group flex gap-2 py-2 my-2 hover:bg-red-500 hover:text-white -mx-4 px-4 rounded-md transition-all hover:scale-110 hover:shadow-md shadow-gray-300'>
                        <TrashIcon className="h-6 text-gray-800 group-hover:text-white" />Delete Post
                      </span>
                    </button>
                  )}
                  {/* Report button */}
                  <button
                    className="w-full -my-2"
                    onClick={handleReportSubmit}
                  >
                    <span className='group flex gap-2 py-2 my-2 hover:bg-red-500 hover:text-white -mx-4 px-4 rounded-md transition-all hover:scale-110 hover:shadow-md shadow-gray-300'>
                      <ExclamationIcon className="h-6 text-gray-800 group-hover:text-white" />
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
              {showSavePopup && (
                <div className="fixed bottom-5 right-5 bg-red-500 p-2 rounded-md shadow-md">
                  <p className="text-sm text-white">{isSaved ? 'Post Saved' : 'Post Unsaved'}</p>
                </div>
              )}
            </div>
          </ClickOutHandler>
        </div>
      </div>
  
      {/* Post content */}
      <div>
        <pre className='whitespace-pre-wrap font-sans my-3'>{content}</pre>
        {/* Post photos */}
        {photos?.length > 0 && (
          <div>
            {photos.length === 1 ? (
              <div className='rounded-md overflow-hidden cursor-pointer' onClick={() => openPhotoModal(0)}>
                <img src={photos[0]} className='mx-auto w-full h-full object-cover' alt="" />
              </div>
            ) : (
              <div>
                {photos.length <= 4 ? (
                  <div className='grid grid-cols-2 gap-2'>
                    {photos.map((photo, index) => (
                      <div key={photo} className='rounded-md overflow-hidden cursor-pointer' onClick={() => openPhotoModal(index)}>
                        <img src={photo} className='mx-auto w-full h-full object-cover' alt="" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className='grid grid-cols-2 gap-2'>
                    {photos.slice(0, 3).map((photo, index) => (
                      <div key={photo} className='rounded-md overflow-hidden cursor-pointer' onClick={() => openPhotoModal(index)}>
                        <img src={photo} className='mx-auto w-full h-full object-cover' alt="" />
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
          <ThumbUpIcon className={"h-6 w-6 text-gray-800 " + (isLikedByMe ? 'fill-red-400' : '')} />
          {likes?.length}
        </button>
        {/* Comment button */}
        <button className='flex gap-1 items-center'>
          <ChatAlt2Icon className="h-6 w-6 text-gray-800" />
          {comments.length}
        </button>
      </div>
      <div className='flex mt-4 gap-3'>
        <div>
          <Link href={'/profile/' + myProfile?.id}>
            <span className='cursor-pointer'>
              <Avatar url={myProfile?.avatar} />
            </span>
          </Link>
        </div>
        {/* Comment input */}
        <div className='border grow rounded-full h-12 shadow-md relative'>
          <form onSubmit={postComment}>
            <input
              value={commentText}
              onChange={ev => setCommentText(ev.target.value)}
              className='block w-full p-3 px-4 overflow-hidden h-12 rounded-full' placeholder='Leave a comment' />
          </form>
        </div>
      </div>
      <div>
        {/* Comment section */}
        {comments.length > 0 && comments.map(comment => (
          <div key={comment.id} className="mt-2 flex gap-2 items-center">
            <Link href={'/profile/' + comment.profiles.id}>
              <span className='cursor-pointer'>
                <Avatar url={comment.profiles.avatar} />
              </span>
            </Link>
            <div className="bg-gray-200 py-2 px-4 rounded-3xl">
              <div>
                <Link href={'/profile/' + comment.profiles.id}>
                  <span className="hover:underline font-semibold mr-1">
                    {comment.profiles.name}
                  </span>
                </Link>
                <span className="text-sm text-gray-400">
                  <ReactTimeAgo timeStyle={'twitter'} date={(new Date(comment.created_at)).getTime()} />
                </span>
              </div>
              <p className="text-sm">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
  }
  
  export default PostCard
  