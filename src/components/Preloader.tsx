"use client";

import { useEffect, useState, startTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Preloader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    startTransition(() => {
      setLoading(true);
    });

    const timer = setTimeout(() => {
      startTransition(() => {
        setLoading(false);
      });
    }, 1200);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <AnimatePresence mode="wait">
      {loading && (
        <motion.div
          key={pathname}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-white"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6 } }}
        >
          <motion.div
            initial={{ scale: 0, rotate: 0, opacity: 0 }}
            animate={{
              scale: [0, 1.1, 1],
              rotate: [0, 360, 720],
              opacity: [0, 1, 1],
              transition: {
                duration: 1.2,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "loop",
              },
            }}
            exit={{
              scale: 0.8,
              opacity: 0,
              rotate: 180,
              transition: { duration: 0.6 },
            }}
          >
            <Image
              src="/asset/favicon.png"
              alt="Loading..."
              width={150}
              height={150}
              priority
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
