"use client"
import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import Headroom from "react-headroom";

function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setOpen(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Headroom>
      <header className="flex items-center justify-between w-full p-5 max-w-7xl mx-auto bg-white shadow-md z-[99999] rounded-lg">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/tkfllare-logo.jpg"
            alt="TKLARE Logo"
            width={60}
            height={40}
            className="w-34 h-auto cursor-pointer"
            priority
          />
        </Link>

        {/* Hamburger Menu for Mobile */}
        <div
          className={`md:hidden ${open ? "text-gray-600" : "text-black"}`}
          onClick={() => setOpen(!open)}
        >
          <div className="w-6 h-6 relative">
            <span
              className={`block w-full h-[2px] bg-current transition-transform duration-300 ${
                open ? "rotate-45 translate-y-[2px]" : "-translate-y-1.5"
              }`}
            ></span>
            <span
              className={`block w-full h-[2px] bg-current transition-opacity duration-300 ${
                open ? "opacity-0" : "opacity-100"
              }`}
            ></span>
            <span
              className={`block w-full h-[2px] bg-current transition-transform duration-300 ${
                open ? "-rotate-45 -translate-y-[2px]" : "translate-y-1.5"
              }`}
            ></span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav
          className={`absolute bg-white top-0 right-0 h-screen w-full max-w-xs transform ${
            open ? "translate-x-0" : "translate-x-full"
          } transition-transform duration-300 md:relative md:h-auto md:max-w-none md:translate-x-0 flex flex-col md:flex-row md:items-center md:gap-5 rounded-lg`}
        >
          <ul className="flex flex-col items-center gap-6 p-10 md:flex-row md:p-0 md:gap-5">
            <li onClick={() => setOpen(false)}>
              <Link href="/our-story" className="text-2xl md:text-base text-gray-800 hover:text-blue-600 transition-colors duration-200">
                Our Story
              </Link>
            </li>
            <li onClick={() => setOpen(false)}>
              <Link href="/our-programs" className="text-2xl md:text-base text-gray-800 hover:text-blue-600 transition-colors duration-200">
                Our Programs
              </Link>
            </li>
            <li onClick={() => setOpen(false)}>
              <Link href="/get-involved" className="text-2xl md:text-base text-gray-800 hover:text-blue-600 transition-colors duration-200">
                Get Involved
              </Link>
            </li>
          </ul>
          <Link href="/donate" className="mt-5 md:mt-0 md:ml-auto bg-blue-600 text-white rounded-full px-6 py-2 text-center">
            Donate
          </Link>
        </nav>
      </header>
    </Headroom>
  );
}

export default Header;
