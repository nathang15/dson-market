/* eslint-disable no-unused-vars */
/* eslint-disable require-jsdoc */
import React, {useContext, useEffect, useState} from 'react';
// import Avatar from './Avatar';
// import Link from 'next/link';
import {useSession, useSupabaseClient} from '@supabase/auth-helpers-react';
// import {UserContext} from '@/contexts/UserContext';

function NotificationInfo({id}) {
  // const {profile: myProfile} = useContext(UserContext);
  const supabase = useSupabaseClient();
  const [notifications, setNotifications] = useState([]);
  const [visibleNotifications, setVisibleNotifications] = useState([]);
  const session = useSession();

  useEffect(() => {
    fetchComments();
  }, [id]);

  async function fetchComments() {
    try {
      const {data: posts, error: postsError} = await supabase
          .from('posts')
          .select('*, profiles(*)')
          .eq('author', session.user.id);

      if (postsError) {
        console.error('Error fetching posts:', postsError);
        return;
      }

      const totalComments = posts.reduce(
          (acc, post) => acc + (post.comments_number || 0),
          0,
      );

      const notificationsArray = Array.from(
          {length: totalComments},
          (_, index) => ({
            id: index,
            message: 'Someone commented on your post.',
          }),
      );

      setNotifications(notificationsArray);
      setVisibleNotifications(notificationsArray.slice(0, 5)); // Display the first five notifications
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  }

  const handleLoadMore = () => {
    // Display five more notifications on "Load More" click
    const nextBatch = notifications.slice(visibleNotifications.length, visibleNotifications.length + 5);
    setVisibleNotifications((prevVisible) => [...prevVisible, ...nextBatch]);
  };

  return (
    <div className="relative">
      <div className="absolute mt-2 -right-6 dark:bg-customBlack2 bg-white shadow-md p-3 rounded-sm border dark:border-black border-gray-100 w-80">
        {visibleNotifications.length > 0 ? (
          visibleNotifications.map((notification) => (
            <div
              key={notification.id}
              className="flex items-center gap-2 py-2 dark:text-lightBG text-gray-800 dark:hover.bg-customBlack dark:hover:bg-customBlack hover:bg-gray-100 hover:shadow-md hover:rounded-md transition-all hover:border-transparent -mx-1 px-2"
            >
              {notification.message}
            </div>
          ))
        ) : (
          <div>No comments on your posts yet.</div>
        )}
        {notifications.length > visibleNotifications.length && (
          <button
            className="bg-red-400 text-white py-2 px-4 mt-2 rounded-full hover:bg-red-500"
            onClick={handleLoadMore}
          >
            Load More
          </button>
        )}
      </div>
      {notifications.length > 0 && (
        <div className="absolute bottom-0 left-3.5 bg-red-500 w-4 h-4 rounded-full flex items-center justify-center text-white">
          !
        </div>
      )}
    </div>
  );
}

export default NotificationInfo;
