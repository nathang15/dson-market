import React from 'react'
import ReviewsInfo from './ReviewsInfo'
import Card from '@/components/Card'
import PostCard from './PostCard'
import {useEffect, useState} from "react";
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import {UserContextProvider} from "../contexts/UserContext";
import {
  PencilAltIcon,
} from "@heroicons/react/outline";

function ProfileContent({activeTab,userId}) {
    const [posts,setPosts] = useState([]);
    const [profile, setProfile] = useState(null);
    const session = useSession();
    const supabase = useSupabaseClient();
    const [reviewText, setReviewText] = useState('');
    const [reviews, setReviews] = useState([]);
    const [showCancel, setShowCancel] = useState(false);

    useEffect(() => {
      loadPosts();
      if(!session?.user?.id) {
        return;
      }
        if (activeTab === 'posts') {
          loadPosts();
        }
        else if(activeTab === 'reviews') {
          loadReviews();
        }
      }, [userId]);
    
      async function loadPosts() {
        try {
          const posts = await userPosts(userId);
          const profile = await userProfile(userId);
          setPosts(posts);
          setProfile(profile);
        } catch (error) {
          console.error(error);
          window.location.reload();
        }
      }
    
      async function userPosts(userId) {
        const {data} = await supabase.from('posts')
          .select('id, content, photos, created_at, author')
          .eq('author', userId)
          .is('parent', null).order('created_at', {ascending: false});
        return data;
      }
    
      async function userProfile(userId) {
        const {data} = await supabase.from('profiles')
          .select()
          .eq('id', userId);
        return data?.[0];
      }

    const [editMode, setEditMode] = useState(false);
    const [about, setAbout] = useState('');
      useEffect(() => {
          if (!userId) {
            return;
          }
          supabase.from('profiles')
          .select()
          .eq('id', userId)
          .then(result => {
            if (result.error) {
              throw result.error;
            }
            if (result.data) {
              setProfile(result.data[0]);
            }
          });
        }, [userId]);
      
      function saveProfile() {
        const trimmedAbout = about.trim();

        // Check if the trimmed about text is empty
        if (trimmedAbout === '') {
          setEditMode(false);
          return; // If empty, do nothing
        }
          supabase.from('profiles').update({
              about
          }).eq('id', session.user.id).then(result =>{
              if(!result.error){
                  setProfile(prev => {
                      return {...prev, about};
                  });
              }
              setEditMode(false);
          });
      }

      async function writeReview() {
        try {
          if (!reviewText.trim()) {
            // Handle case where review text is empty
            return;
          }
      
          const authorId = session.user.id;
          const receiverId = userId;
      
          // Insert the review into the 'reviews' table
          const { error } = await supabase.from('reviews').insert([
            { content: reviewText, author: authorId, receiver: receiverId },
          ]);
      
          if (error) {
            throw error;
          }
      
          // Clear the review text input after successful submission
          setReviewText('');
          loadReviews();
          resetTextareaHeight();
        } catch (error) {
          console.error(error);
          // Handle error accordingly
        }
      }

      async function loadReviews() {
        try {
          const { data: reviews, error } = await supabase
            .from('reviews')
            .select('id, content, author, created_at')
            .eq('receiver', userId);
    
          if (error) {
            throw error;
          }
    
          // Fetch author information for each review
          const reviewAuthors = await Promise.all(
            reviews.map(async (review) => {
              const { data: author, error: authorError } = await supabase
                .from('profiles')
                .select('id, name, avatar')
                .eq('id', review.author)
                .single();
    
              if (authorError) {
                throw authorError;
              }
    
              return {
                ...review,
                author: {
                  id: author.id,
                  name: author.name,
                  avatar: author.avatar,
                },
              };
            })
          );
    
          setReviews(reviewAuthors);
        } catch (error) {
          console.error(error);
          // Handle error accordingly
        }
      }
      
      const handleInputChange = (e) => {
        setReviewText(e.target.value);
        setShowCancel(!!e.target.value.trim());
      };
    
      const handleCancel = () => {
        setReviewText("");
        setShowCancel(false);
        resetTextareaHeight(); // Reset the textarea's height
      };
      
      const resetTextareaHeight = () => {
        const textarea = document.querySelector(".review-textarea");
        textarea.style.height = "auto";
      };
      

      const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          const textarea = e.target;
          const { selectionStart, selectionEnd, value } = textarea;
          const newValue =
            value.substring(0, selectionStart) +
            "\n" +
            value.substring(selectionEnd, value.length);
          setReviewText(newValue);
          // Set the cursor position after the inserted line break
          setTimeout(() => {
            textarea.selectionStart = selectionStart + 1;
            textarea.selectionEnd = selectionStart + 1;
          });
        } else if (e.key === "Escape") {
          e.preventDefault();
          handleCancel();
        }
      };
      
          
      
      const isMyUser = userId === session?.user?.id;
      const defaultAboutText = "No information available.";
      const calculateRowCount = (text) => {
        const lineBreaks = (text.match(/\n/g) || []).length;
        return lineBreaks + 1; // Add 1 to account for the initial row
      };
  return (
    <div>
      <UserContextProvider>
        {activeTab === 'posts' && (
            <div>
                {posts?.length > 0 && posts.map(post => (
                    <PostCard key={post.id} {...post} profiles={profile} />
                    
                ))}
                
            </div>
        )}
       {activeTab === 'about' && (
          <div>
            <Card>
              <div className='flex justify-between items-center'>
                <h2 className='text-3xl mb-2 dark:text-lightBG'>About me</h2>
                <div>
                  {isMyUser && !editMode && (
                    <button
                      onClick={() => {
                        setEditMode(true);
                        setAbout(profile?.about);
                      }}
                      className='inline-flex mx-1 gap-1 bg-white rounded-md dark:bg-customBlack2 border-2 dark:border-customBlack hover:scale-110 py-1 px-2'
                    >
                      <PencilAltIcon className='h-6 w-6 dark:text-lightBG' />
                      <span className='dark:text-lightBG'>
                      Edit About
                      </span>        
                    </button>
                  )}
                  {isMyUser && editMode && (
                    <>
                      <button
                        onClick={saveProfile}
                        className='inline-flex mx-1 gap-1 bg-white rounded-md dark:bg-customBlack2 border-2 dark:border-customBlack hover:scale-110 py-1 px-2'
                      >
                      <span className='dark:text-lightBG'>
                      Save About
                      </span>
                      </button>
                      <button
                        onClick={() => setEditMode(false)}
                        className='inline-flex mx-1 gap-1 bg-white rounded-md dark:bg-customBlack2 border-2 dark:border-customBlack hover:scale-110 py-1 px-2'
                      >
                      <span className='dark:text-lightBG'>
                      Cancel
                      </span>
                      </button>
                    </>
                  )}
                </div>
              </div>
              <div className='flex'>
                {editMode ? (
                  <div className='flex-grow mt-2'>
                    <textarea
                    className='text-lg dark:placeholder-lightBG py-2 px-3 rounded-md dark:bg-customBlack2 border-2 dark:border-customBlack w-full'
                    style={{ resize: 'none', overflow: 'hidden' }}
                    placeholder='Tell us about yourself'
                    onChange={(ev) => setAbout(ev.target.value)}
                    onInput={(ev) => {
                      ev.target.style.height = 'auto'; // Reset the height to auto
                      ev.target.style.height = ev.target.scrollHeight + 'px'; // Set the height to match the scrollHeight
                      const rowCount = calculateRowCount(ev.target.value);
                      ev.target.rows = rowCount;
                    }}
                    value={about}
                    maxLength={200}
                    rows={calculateRowCount(about)}
                  />

                    <p className='text-sm text-right text-gray-400 mt-1 dark:text-lightBG'>
                      {about?.length}/200 words
                    </p>
                  </div>
                ) : (
                  <pre className='text-lg whitespace-pre-wrap font-sans dark:text-lightBG'>
                    {profile?.about ? profile.about : defaultAboutText}
                  </pre>
                )}
              </div>
            </Card>
          </div>
        )}
        {activeTab === 'reviews' && (
          <div>
          {/* Write Review section */}
          <Card>
            <h2 className="text-3xl mb-2 dark:text-lightBG">Write a Review</h2>
            <textarea
              className="text-lg py-2 px-3 rounded-md dark:bg-customBlack2 border-2 dark:text-lightBG dark:border-customBlack dark:placeholder-lightBG w-full review-textarea"
              style={{ resize: "none", overflow: "hidden" }}
              placeholder="Write your review here"
              value={reviewText}
              onChange={handleInputChange}
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = e.target.scrollHeight + "px";
              }}
              onKeyDown={handleKeyDown} // Add keydown event handler
            />

            <button
              onClick={writeReview}
              className="inline-flex mt-2 gap-1 bg-red-500 text-white rounded-md dark:bg-customBlack border-2 dark:border-customBlack2 hover:scale-110 py-1 px-2"
            >
              Submit Review
            </button>
            {showCancel && (
              <button
                onClick={handleCancel}
                className="inline-flex mt-2 gap-1 bg-gray-400 text-white rounded-md dark:bg-customBlack border-2 dark:border-customBlack2 hover:scale-110 py-1 px-2 mx-1"
              >
                Cancel
              </button>
            )}
          </Card>
          <Card>
            <h2 className="text-3xl mb-2 dark:text-lightBG">Reviews</h2>
            {reviews.length > 0 ? (
              <pre className='whitespace-pre-wrap font-sans dark:text-lightBG'>
                <ReviewsInfo className="shadow-md" reviews={reviews} />
              </pre>
            ) : (
              <p className="text-lg dark:text-lightBG">No reviews available.</p>
            )}
          </Card>
        </div>

      )}

        </UserContextProvider>
    </div>
  )
}

export default ProfileContent