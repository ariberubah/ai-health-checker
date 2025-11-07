"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Footer() {
  const links = [
    { label: "Home", href: "/" },
    { label: "Articles", href: "/articles" },
    { label: "Consult", href: "/consult" },
    { label: "About", href: "/about" },
  ];

  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <footer className="bg-white p-4">
      {/* Section 1: CTA */}
      <motion.div
        className="bg-green-50 py-16 px-6 text-center rounded-3xl"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Take Control of Your Health Today
        </h2>
        <p className="text-gray-700 mb-6 max-w-xl mx-auto">
          Connect with your virtual AI health assistant anytime, anywhere.  
          Get personalized advice, track your progress, and feel confident about your health decisions.
        </p>
        <motion.button
          className="bg-green-600 text-white px-6 py-3 rounded-full font-semibold shadow"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          Start Your Journey
        </motion.button>
      </motion.div>

      {/* Section 2: Logo + Menu */}
      <motion.div
        className="py-12 flex flex-col items-center gap-6"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {/* Logo */}
        <div className="text-2xl font-bold text-green-600">
          <Image
            src="/asset/logo.png"
            alt="AI Health Care Logo"
            width={150}
            height={50}
          />
        </div>

        {/* Menu */}
        <ul className="flex gap-8 text-gray-700">
          {links.map((link) => (
            <motion.li
              key={link.href}
              whileHover={{ y: -3, color: "#16a34a" }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Link href={link.href}>{link.label}</Link>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </footer>
  );
}
