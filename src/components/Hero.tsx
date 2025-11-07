"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Search } from "lucide-react";
import AnimatedBlurText from "@/components/AnimatedBlurText";

export default function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center px-6 pt-32 pb-20 bg-gradient-to-b from-white to-green-50">
      <div className="w-full text-center mx-auto flex flex-col items-center">
        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4 px-4 py-1 rounded-full font-semibold bg-green-100 text-green-700 text-sm"
        >
          AI Healthcare Service
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-2xl md:text-5xl font-normal leading-tight max-w-5xl text-gray-800"
        >
          Experience Smart,{" "}
          <span className="text-green-600">
            <AnimatedBlurText text="AI-Driven Healthcare" />
          </span>{" "}
          <br />
          for Faster, Better Care!
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-6 text-gray-500 text-base md:text-lg max-w-3xl"
        >
          Get real-time medical advice, accurate diagnostics, and personalized
          health insights <br /> powered by advanced AI technology — accessible
          anytime, anywhere.
        </motion.p>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-10 flex items-center bg-white rounded-full shadow-md overflow-hidden w-full max-w-xl"
        >
          <input
            type="text"
            placeholder="Search any question about health and hospital related"
            className="flex-1 px-6 py-3 outline-none text-gray-700"
          />
          <button className="bg-green-500 text-white p-3 rounded-full m-2 hover:bg-green-600 transition-colors">
            <Search size={20} />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
