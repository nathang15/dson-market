import React from 'react'
import Avatar from "./Avatar";
import Link from "next/link";
function NotificationInfo() {
  return (
    <Link href="/" className="flex items-center gap-2 py-2 text-gray-800 hover:bg-gray-100 hover:shadow-md hover:rounded-md transition-all hover:border-transparent -mx-1 px-2">
        <Avatar size='sm'/>
        Bob the Builder commented on your post. 
    </Link>
  )
}

export default NotificationInfo