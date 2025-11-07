"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Search } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.nav
        key={isScrolled ? "scrolled" : "top"}
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`${
          isScrolled
            ? "fixed top-0 left-0 w-full bg-white shadow-md backdrop-blur-sm z-50"
            : "absolute top-0 left-0 w-full bg-transparent z-50"
        } transition-all duration-300`}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between p-2.5">
          {/* Left: Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/asset/logo.png"
              alt="HealthAI Logo"
              width={100}
              height={50}
              priority
            />
          </Link>

          {/* Center: Desktop Menu */}
          <ul
            className={`hidden md:flex space-x-6 font-medium ${
              isScrolled ? "text-gray-800" : "text-gray-800"
            }`}
          >
            <li><Link href="/">Home</Link></li>
            <li><Link href="/articles">Articles</Link></li>
            <li><Link href="/consult">Consult</Link></li>
            <li><Link href="/about">About</Link></li>
          </ul>

          {/* Right: Search + Mobile Button */}
          <div className="flex items-center space-x-4">
            {/* Search Icon */}
            <button
              className={`hidden md:block ${
                isScrolled ? "text-gray-800" : "text-gray-800"
              }`}
              onClick={() => setSearchOpen((prev) => !prev)}
            >
              <Search size={22} />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden z-50"
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              {menuOpen ? (
                <X
                  size={28}
                  className={isScrolled ? "text-gray-800" : "text-gray-800"}
                />
              ) : (
                <Menu
                  size={28}
                  className={isScrolled ? "text-gray-800" : "text-gray-800"}
                />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className={`md:hidden flex flex-col items-center gap-6 py-6 ${
                isScrolled ? "bg-white text-gray-800" : "bg-black/80 text-white"
              }`}
            >
              <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
              <Link href="/articles" onClick={() => setMenuOpen(false)}>Articles</Link>
              <Link href="/consult" onClick={() => setMenuOpen(false)}>Consult</Link>
              <Link href="/about" onClick={() => setMenuOpen(false)}>About</Link>

              {/* Search di Mobile */}
              <div className="flex items-center gap-2 mt-2">
                <Search size={20} />
                <input
                  type="text"
                  placeholder="Search..."
                  className="px-3 py-1 rounded-md border text-gray-800 focus:outline-none focus:ring focus:ring-blue-400"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Form (Desktop Overlay) */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="absolute right-4 top-full mt-2 md:block hidden"
            >
              <input
                type="text"
                placeholder="Search..."
                autoFocus
                className="px-4 py-2 border rounded-md shadow focus:outline-none focus:ring focus:ring-blue-400"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </AnimatePresence>
  );
}
