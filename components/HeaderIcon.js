function HeaderIcon({ active, Icon }) {
  return (
    <div className="flex items-center md:px-10 sm:h-14 cursor-pointer md:hover:bg-gray-100 rounded-xl group active:border-b-2 active:border-red-500">
      <div className="hidden md:block">
        <Icon
          className={`${
            active ? "text-red-500" : "text-gray-500"
          } text-center h-5 sm:h-7 mx-auto my-auto group-hover:text-red-500`}
        />
      </div>
    </div>
  );
}

export default HeaderIcon;
