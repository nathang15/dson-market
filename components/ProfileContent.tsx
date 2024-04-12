import React from 'react';
import ReviewsInfo from './ReviewsInfo';
import Card from '@/components/Card';
import PostCard from './PostCard';
import {useEffect, useState} from 'react';
import {useSession, useSupabaseClient} from '@supabase/auth-helpers-react';
import {UserContextProvider} from '../contexts/UserContext';
import {
  PencilAltIcon,
} from '@heroicons/react/outline';
import ChatPage from '@/pages/chat';

/**
 * React component for displaying user profile content, including posts, about section, and reviews.
 * @param {Object} props - Component props.
 * @param {string} props.activeTab - The active tab to display ('posts', 'about', or 'reviews').
 * @param {string} props.userId - The ID of the user whose profile is being viewed.
 * @return {JSX.Element} The rendered React component.
 */
function ProfileContent({activeTab, userId}) {
  const [posts, setPosts] = useState([]);
  const [profile, setProfile] = useState(null);
  const session = useSession();
  const supabase = useSupabaseClient();
  const [reviewText, setReviewText] = useState('');
  const [reviews, setReviews] = useState([]);
  const [showCancel, setShowCancel] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [about, setAbout] = useState('');
  const isMyUser = userId === session?.user?.id;
  const defaultAboutText = 'No information available.';

  // Fetch the active tab and perform corresponding actions
  useEffect(() => {
    loadPosts();
    if (!session?.user?.id) {
      return;
    }
    if (activeTab === 'posts') {
      loadPosts();
    } else if (activeTab === 'reviews') {
      loadReviews();
    }
  }, [userId]);

  /**
   * Loads the user's posts and updates the state with the retrieved data.
   */
  async function loadPosts() {
    try {
      const posts = await userPosts(userId);
      const profile = await userProfile(userId);
      setPosts(posts);
      setProfile(profile);
    } catch (error) {
      console.error(error);
      // window.location.reload();
    }
  }

  /**
   * Retrieves the user's posts from the database.
   * @param {string} userId - The ID of the user whose posts to retrieve.
   * @return {Promise<Object[]>} A Promise that resolves to an array of post objects.
   */
  async function userPosts(userId) {
    const {data} = await supabase.from('posts')
        .select('id, content, photos, created_at, author')
        .eq('author', userId)
        .is('parent', null).order('created_at', {ascending: false});
    return data;
  }

  /**
   * Retrieves the user's profile from the database.
   * @param {string} userId - The ID of the user whose profile to retrieve.
   * @return {Promise<Object>} A Promise that resolves to the user's profile object.
   */
  async function userProfile(userId) {
    const {data} = await supabase.from('profiles')
        .select()
        .eq('id', userId);
    return data?.[0];
  }

  // TODO add documentation for this
  useEffect(() => {
    if (!userId) {
      return;
    }
    supabase.from('profiles')
        .select()
        .eq('id', userId)
        .then((result) => {
          if (result.error) {
            throw result.error;
          }
          if (result.data) {
            setProfile(result.data[0]);
          }
        });
  }, [userId]);

  /**
   * Saves the user's profile after editing.
   */
  function saveProfile() {
    const trimmedAbout = about.trim();

    // Check if the trimmed about text is empty
    if (trimmedAbout === '') {
      setEditMode(false);
      return; // If empty, do nothing
    }
    supabase.from('profiles').update({
      about,
    }).eq('id', session.user.id).then((result) =>{
      if (!result.error) {
        setProfile((prev) => {
          return {...prev, about};
        });
      }
      setEditMode(false);
    });
  }

  /**
   * Handles the submission of a new review.
   */
  async function writeReview() {
    try {
      if (!reviewText.trim()) {
        // Handle case where review text is empty
        return;
      }

      const authorId = session.user.id;
      const receiverId = userId;

      // Insert the review into the 'reviews' table
      const {error} = await supabase.from('reviews').insert([
        {content: reviewText, author: authorId, receiver: receiverId},
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

  /**
   * Loads and displays the reviews on the fetched user
   */
  async function loadReviews() {
    try {
      const {data: reviews, error} = await supabase
          .from('reviews')
          .select('id, content, author, created_at')
          .eq('receiver', userId);

      if (error) {
        throw error;
      }

      // Fetch author information for each review
      const reviewAuthors = await Promise.all(
          reviews.map(async (review) => {
            const {data: author, error: authorError} = await supabase
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
          }),
      );

      setReviews(reviewAuthors);
    } catch (error) {
      console.error(error);
      // Handle error accordingly
    }
  }

  /**
   * Handles changes in the review text input.
   * @param {Event} e - The input change event.
   */
  const handleInputChange = (e) => {
    setReviewText(e.target.value);
    setShowCancel(!!e.target.value.trim());
  };

  /**
   * Cancels the review writing process and clears the review text.
   */
  const handleCancel = () => {
    setReviewText('');
    setShowCancel(false);
    resetTextareaHeight(); // Reset the textarea's height
  };

  /**
   * Resets the height of the review textarea.
   */
  const resetTextareaHeight = () => {
    const textarea = document.querySelector('.review-textarea') as HTMLTextAreaElement;
    textarea.style.height = 'auto';
  };

  /**
   * Handles keydown events in the review textarea, adding line breaks and handling the Escape key.
   * @param {KeyboardEvent} e - The keydown event.
   */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const textarea = e.target;
      const {selectionStart, selectionEnd, value} = textarea;
      const newValue =
            value.substring(0, selectionStart) +
            '\n' +
            value.substring(selectionEnd, value.length);
      setReviewText(newValue);
      // Set the cursor position after the inserted line break
      setTimeout(() => {
        textarea.selectionStart = selectionStart + 1;
        textarea.selectionEnd = selectionStart + 1;
      });
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };

  // Calculate the row count of text input
  const calculateRowCount = (text) => {
    if (text === null || text === undefined) {
      return 0; // or handle the case appropriately
    }
    const lineBreaks = (text.match(/\n/g) || []).length;
    return lineBreaks + 1; // Add 1 to account for the initial row
  };

  return (
    <div>
      <UserContextProvider>
        {activeTab === 'posts' && (
          <div>
            {posts?.length > 0 && posts.map((post) => (
              <PostCard key={post.id} {...post} profiles={profile} />

            ))}

          </div>
        )}
        {activeTab === 'about' && (
          <div>
            <Card noPadding={undefined} isUserCard={undefined}>
              <div className='flex justify-between items-center'>
                <h2 className='text-3xl mb-2 dark:text-lightBG'>About me</h2>
                <div>
                  {isMyUser && !editMode && (
                    <button
                      onClick={() => {
                        setEditMode(true);
                        setAbout(profile?.about);
                      }}
                      className='inline-flex items-center mx-1 gap-1 bg-white rounded-md dark:bg-customBlack2 border-2 dark:border-customBlack hover:scale-110 py-1 px-2'
                    >
                      <PencilAltIcon className='h-6 w-6 dark:text-lightBG' />
                      <span className='dark:text-lightBG md:text-md text-xs'>
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
                      className='text-lg dark:placeholder-lightBG py-2 px-3 rounded-md dark:text-white dark:bg-customBlack2 border-2 dark:border-customBlack w-full'
                      style={{resize: 'none', overflow: 'hidden'}}
                      placeholder='Tell us about yourself'
                      onChange={(ev) => setAbout(ev.target.value)}
                      onInput={(ev) => {
                        const target = ev.target as HTMLTextAreaElement; // Typecast the event target to HTMLTextAreaElement
                        target.style.height = 'auto'; // Reset the height to auto
                        target.style.height = target.scrollHeight + 'px'; // Set the height to match the scrollHeight
                        const rowCount = calculateRowCount(target.value);
                        target.rows = rowCount;
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
            <Card noPadding={undefined} isUserCard={undefined}>
              <h2 className="text-3xl mb-2 dark:text-lightBG">Write a Review</h2>
              <textarea
                className="text-lg py-2 px-3 rounded-md dark:bg-customBlack2 border-2 dark:text-lightBG dark:border-customBlack dark:placeholder-lightBG w-full review-textarea"
                style={{resize: 'none', overflow: 'hidden'}}
                placeholder="Write your review here"
                value={reviewText}
                onChange={handleInputChange}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement; // Typecast the event target to HTMLTextAreaElement
                  target.style.height = 'auto';
                  target.style.height = target.scrollHeight + 'px';
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
            <Card noPadding={undefined} isUserCard={undefined}>
              <h2 className="text-3xl mb-2 dark:text-lightBG">Reviews</h2>
              {reviews.length > 0 ? (
              <pre className='whitespace-pre-wrap font-sans dark:text-lightBG'>
                <ReviewsInfo reviews={reviews} />
              </pre>
            ) : (
              <p className="text-lg dark:text-lightBG">No reviews available.</p>
            )}
            </Card>
          </div>

        )}
        {activeTab === 'chat' && (
          <div>
            <ChatPage/>
          </div>

        )}

      </UserContextProvider>
    </div>
  );
}

export default ProfileContent;
