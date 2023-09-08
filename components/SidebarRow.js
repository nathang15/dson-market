import Image from "next/legacy/image";
import React from "react";
import { useRouter } from "next/router";

function SidebarRow({ src, Icon, title, active }) {
  const router = useRouter();
  const {pathname} = router;
  // const activeEle = pathname === "/";
  return (
    <div className={`group flex items-center space-x-2 p-4 hover:bg-gray-200 dark:hover:bg-customBlack2 hover:text-red-500 hover:scale-110 rounded-xl cursor-pointer transition-all ${active ? 'text-red-500' : 'text-gray-500'}`}>
      {src && (
        <Image
          className="rounded-full"
          src={src}
          width={30}
          height={30}
          layout="fixed"
        />
      )}
      {Icon && (
          <Icon
            className={`md:h-8 md:w-8 h-7 w-7 group-hover:text-red-500 transition-all ${active ? 'text-red-500' : 'text-gray-500 dark:text-lightBG'}`}
          />      
      )}
      <p className="md:inline-flex hidden font-medium">{title}</p>
    </div>
  );
}

export default SidebarRow;




