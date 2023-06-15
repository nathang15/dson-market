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
    useEffect(() => {
      loadPosts();
      if(!session?.user?.id) {
        return;
      }
        if (activeTab === 'posts') {
          loadPosts();
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
                <h2 className='text-3xl mb-2'>About me</h2>
                <div>
                  {isMyUser && !editMode && (
                    <button
                      onClick={() => {
                        setEditMode(true);
                        setAbout(profile?.about);
                      }}
                      className='inline-flex mx-1 gap-1 bg-white rounded-md shadow-md shadow-gray-500 py-1 px-2'
                    >
                      <PencilAltIcon className='h-6 w-6' />
                      Edit About
                    </button>
                  )}
                  {isMyUser && editMode && (
                    <>
                      <button
                        onClick={saveProfile}
                        className='inline-flex mx-1 gap-1 bg-white rounded-md shadow-md shadow-gray-500 py-1 px-2'
                      >
                        Save About
                      </button>
                      <button
                        onClick={() => setEditMode(false)}
                        className='inline-flex mx-1 gap-1 bg-white rounded-md shadow-md shadow-gray-500 py-1 px-2'
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
              <div className='flex'>
                {editMode ? (
                  <div className='flex-grow mt-2'>
                    <textarea
                    className='text-lg border py-2 px-3 rounded-md shadow-gray-400 shadow-sm w-full'
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

                    <p className='text-sm text-right text-gray-400 mt-1'>
                      {about?.length}/200 words
                    </p>
                  </div>
                ) : (
                  <pre className='text-lg whitespace-pre-wrap font-sans'>
                    {profile?.about ? profile.about : defaultAboutText}
                  </pre>
                )}
              </div>
            </Card>
          </div>
        )}
        {activeTab === 'reviews' && (
            <div>
                <Card>
                    <h2 className='text-3xl mb-2'>Rating</h2>
                    <div className=''>
                        <ReviewsInfo/>
                        <ReviewsInfo/>
                    </div>  
                </Card>
            </div>
        )}
        </UserContextProvider>
    </div>
  )
}

export default ProfileContent