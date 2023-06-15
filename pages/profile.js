import Layout from '@/components/Layout'
import Card from '@/components/Card'
import Avatar from '@/components/Avatar'
import React from 'react'

import {
    CheckCircleIcon,
    UserCircleIcon,
    AnnotationIcon,
    CurrencyDollarIcon,
    PencilAltIcon,
  } from "@heroicons/react/outline";
import PostCard from '@/components/PostCard'
import { useRouter } from 'next/router'
import ReviewsInfo from '@/components/ReviewsInfo'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useState, useEffect } from 'react'
import Cover from '@/components/Cover'
import ProfileTabs from '@/components/ProfileTabs'
import ProfileContent from '@/components/ProfileContent';
import {UserContextProvider} from "../contexts/UserContext";
import PreLoader from '@/components/PreLoader';

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

    useEffect(() => {
        if (!userId) {
          return;
        }
        setLoading(true);
        supabase.from('profiles')
        .select()
        .eq('id', userId)
        .then(result => {
            setLoading(false);
          if (result.error) {
            throw result.error;
          }
          if (result.data) {
            setProfile(result.data[0]);
          }
        });
      }, [userId]);
    
    function saveProfile() {
        supabase.from('profiles').update({
            name
        }).eq('id', session.user.id).then(result =>{
            if(!result.error){
                setProfile(prev => {
                    return {...prev, name};
                });
            }
            setEditMode(false);
        });
    }

    const isMyUser = userId === session?.user?.id;
  return (
    <Layout className="">
        <UserContextProvider>
            <Card noPadding={true}>
                <div className='relative overflow-hidden rounded-md'>
                <Cover url={profile?.cover} editable={isMyUser} onChange={() => window.location.reload()}/>
                    <div  className='absolute md:top-48 top-36 left-4 z-20'>
                        {profile && (
                            <Avatar url={profile.avatar} editable={isMyUser} size={'lg'} onChange={() => window.location.reload()}/>
                        )}
                    </div>
                    <div className='p-2 pt-0 md:pt-4'>
                        <div className='ml-36 md:ml-52 flex justify-between'> 
                            <div>
                                    {editMode && (
                                        <div>
                                            <input type = "text" className='border py-2 px-3 rounded-md shadow-gray-400 shadow-sm' placeholder={'Your Name'} onChange={ev => setName(ev.target.value)} value={name}/>
                                        </div>
                                    )}
                                    {!editMode && (
                                        <h1 className="text-3xl font-bold flex">
                                        {!editMode && loading
                                            ?  <div className='grow'><PreLoader/></div> // Show loading text while fetching profile
                                            : profile?.name || `ser ${profile?.id}`}
                                        </h1>
                                    )}
                            </div>
                            <div className='grow'>
                                <div className='text-right'>
                                    {isMyUser && !editMode && (
                                        <button onClick={() => {setEditMode(true); setName(profile?.name)}} className='inline-flex mx-1 gap-1 bg-white rounded-md shadow-md shadow-gray-500 py-1 px-2 '>
                                            <PencilAltIcon className='h-6 w-6'/>
                                            Change Name
                                        </button>
                                    )}
                                    {isMyUser && editMode && (
                                        <button onClick={saveProfile} className='inline-flex nx-1 gap-1 bg-white rounded-md shadow-md shadow-gray-500 py-1 px-2 '>
                                            Save Name
                                        </button>
                                    )}       
                                    {isMyUser && editMode && (
                                        <button onClick={() => setEditMode(false)} className='inline-flex mx-1 gap-1 bg-white rounded-md shadow-md shadow-gray-500 py-1 px-2 '>
                                            Cancel
                                        </button>
                                    )}  
                                </div>
                    
                            </div>
                        </div>
                        <ProfileTabs active={tab} userId={profile?.id} />                  
                    </div>
                </div>
            </Card> 
            <ProfileContent activeTab = {tab} userId={userId}/>    
        </UserContextProvider>   
    </Layout>
  )
}

export default ProfilePage