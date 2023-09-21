import Layout from '@/components/Layout';
import Card from '@/components/Card';
import Avatar from '@/components/Avatar';
import React from 'react';

import {
  PencilAltIcon,
} from '@heroicons/react/outline';
import {useRouter} from 'next/router';
import {useSession, useSupabaseClient} from '@supabase/auth-helpers-react';
import {useState, useEffect} from 'react';
import Cover from '@/components/Cover';
import ProfileTabs from '@/components/ProfileTabs';
import ProfileContent from '@/components/ProfileContent';
import {UserContextProvider} from '../contexts/UserContext';
import PreLoader from '@/components/PreLoader';

/**
 * React component for the user's profile page.
 * @function ProfilePage
 * @return {JSX.Element} The profile page JSX element.
 */
function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const router = useRouter();
  const tab = router?.query?.tab?.[0] || 'about';
  const session = useSession();
  const supabase = useSupabaseClient();
  const userId = router.query.id;
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [reviewsCount, setReviewsCount] = useState(0);
  const isMyUser = userId === session?.user?.id;

  useEffect(() => {
    if (!userId) {
      return;
    }
    setLoading(true);
    supabase.from('profiles')
        .select()
        .eq('id', userId)
        .then((result) => {
          setLoading(false);
          if (result.error) {
            throw result.error;
          }
          if (result.data) {
            setProfile(result.data[0]);
          }
        });
  }, [userId]);

  /**
   * Saves the user's profile name to the database.
   * @function saveProfile
   */
  function saveProfile() {
    supabase.from('profiles').update({
      name,
    }).eq('id', session.user.id).then((result) =>{
      if (!result.error) {
        setProfile((prev) => {
          return {...prev, name};
        });
      }
      setEditMode(false);
    });
  }

  useEffect(() => {
    if (userId) {
      // Fetch the reviews associated with the userId
      supabase.from('reviews')
          .select()
          .eq('receiver', userId)
          .then((result) => {
            if (result.error) {
              throw result.error;
            }
            if (result.data) {
              setReviewsCount(result.data.length);
            }
          });
    }
  }, [userId]);

  return (
    <Layout className="">
      <UserContextProvider>
        <Card noPadding={true}>
          <div className='relative overflow-hidden rounded-md'>
            <Cover url={profile?.cover} editable={isMyUser} onChange={() => window.location.reload()}/>
            <div className='absolute md:top-48 top-28 md:left-4 -left-2 z-20'>
              {profile && (
                <Avatar url={profile.avatar} editable={isMyUser} size={'lg'} onChange={() => window.location.reload()}/>
              )}
            </div>
            <div className='md:p-2 p-0 pt-0 md:pt-4 dark:text-lightBG'>
              <div className='ml-32 md:ml-52 md:flex justify-between'>
                <div>
                  {editMode && (
                    <div>
                      <input type = "text" className='border-2 py-2 px-3 rounded-md dark:bg-customBlack2 dark:border-customBlack dark:placeholder-lightBG' placeholder={'Your Name'} onChange={(ev) => setName(ev.target.value)} value={name}/>
                    </div>
                  )}
                  {!editMode && (
                    <h1 className="md:text-3xl text-lg font-bold flex justify-end mr-2">
                      {!editMode && loading ?
                                            <div className='grow'><PreLoader/></div> : // Show loading text while fetching profile
                                            profile?.name || `User ${profile?.id}`}
                    </h1>
                  )}
                </div>
                <div className='grow'>
                  <div className='text-right'>
                    {isMyUser && !editMode && (
                      <button onClick={() => {
                        setEditMode(true); setName(profile?.name);
                      }} className='inline-flex items-center mx-1 gap-1 rounded-md dark:bg-customBlack2 bg-lightBG hover:scale-110 py-1 px-2 '>
                        <PencilAltIcon className='h-6 w-6'/>
                        <span className='md:text-md text-sm'>Change Name</span>
                      </button>
                    )}
                    {isMyUser && editMode && (
                      <button onClick={saveProfile} className='inline-flex mx-1 gap-1 dark:bg-customBlack2 bg-lightBG hover:scale-110 rounded-md py-1 px-2 '>
                                            Save Name
                      </button>
                    )}
                    {isMyUser && editMode && (
                      <button onClick={() => setEditMode(false)} className='inline-flex mx-1 gap-1 rounded-md dark:bg-customBlack2 bg-lightBG hover:scale-110 py-1 px-2 '>
                                            Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div className='flex justify-end md:justify-start md:ml-52 ml-0 mr-2 lg:text-xl md:text-xl text-sm font-semibold'>
                {reviewsCount} {reviewsCount < 2 ? 'Feedback' : 'Feedbacks'}
              </div>
              <ProfileTabs active={tab} userId={profile?.id} />
            </div>
          </div>
        </Card>
        <ProfileContent activeTab = {tab} userId={userId}/>
      </UserContextProvider>
    </Layout>
  );
}

export default ProfilePage;
