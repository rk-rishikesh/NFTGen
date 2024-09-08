"use client"
import Image from "next/image";
import Link from 'next/link'

const Header = () => {
  return (
    <div className="fixed top-0 w-full bg-blue-600 h-20 flex items-center z-10">
      <div className="relative left-4">
        <Link href="/">
          <Image
            className="cursor-pointer hidden lg:block"
            src="/assets/logos/logo.png"
            width={250}
            height={250}
            alt="FIL-B Logo"
          />
          <div
            className="lg:hidden text-black items-center inline-flex bg-white border-2 border-black duration-200 ease-in-out focus:outline-none hover:bg-black hover:shadow-none hover:text-white justify-center rounded-full shadow-[5px_5px_black] text-center transform transition w-full px-2 py-2"
          >
            
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Header;
