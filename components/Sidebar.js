import {
  ChevronDownIcon,
  ShoppingBagIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  LogoutIcon,
  BookmarkIcon,
  BookOpenIcon,
  PencilAltIcon
} from "@heroicons/react/outline";
import {
  CalendarIcon,
  ClockIcon,
  DesktopComputerIcon,
  UsersIcon,
  ShoppingCartIcon,
  HomeIcon,
} from "@heroicons/react/solid";
import React, { useEffect, useState } from "react";
import SidebarRow from "./SidebarRow";
import { useRouter } from "next/router";
import Link from "next/link";
import { useSupabaseClient, useSession } from "@supabase/auth-helpers-react";

function Sidebar() {
  const router = useRouter();
  const { asPath: pathname } = router;
  const supabase = useSupabaseClient();
  const session = useSession();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    if (session?.user) {
      setUserId(session.user.id);
    }
  }, [session]);

  async function logout() {
    await supabase.auth.signOut().then(() => {
      window.location.href = '/'; // Redirect to the homepage
    });
  }

  return (
    <div className="p-2 mt-5 max-w-[600px] xl:min-w-[300px]">
      <Link href="/" className="block md:px-3 px-0">
        <SidebarRow active={pathname === "/"} Icon={HomeIcon} title="Home" />
      </Link>
      {userId && (
        <Link href={`/profile/${userId}/posts`} className="block md:px-3 px-0">
          <SidebarRow
            active={pathname === `/profile/${userId}/posts`}
            Icon={CurrencyDollarIcon}
            title="Sales"
          />
        </Link>
      )}
      <Link href="/saved" className="block md:px-3 px-0">
        <SidebarRow active={pathname === "/saved"} Icon={BookmarkIcon} title="Saved" />
      </Link>    
      <Link href="/guide" className="block md:px-3 px-0">
        <SidebarRow active={pathname === "/guide"} Icon={BookOpenIcon} title="Guideline" />
      </Link>
      <Link href="/feedback" className="block md:px-3 px-0">
        <SidebarRow active={pathname === "/feedback"} Icon={PencilAltIcon} title="Project Feedback" />
      </Link>
      <button onClick={logout} className="w-full -my-2 block md:px-3 px-0">
        <span className="">
          <SidebarRow Icon={LogoutIcon} title="Logout" />
        </span>
      </button>
    </div>
  );
}

export default Sidebar;
