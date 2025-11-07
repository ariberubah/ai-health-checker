"use client";

import { motion } from "framer-motion";

export default function AnimatedBlurText({
  text,
  duration = 1.2,
}: {
  text: string;
  duration?: number;
}) {
  const letters = text.split("");

  return (
    <span className="inline-block">
      {letters.map((char, i) => (
        <motion.span
          key={i}
          initial={{ filter: "blur(8px)", opacity: 0, y: 10 }}
          animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
          transition={{
            delay: i * 0.04,
            duration,
            ease: "easeOut",
          }}
          className="inline-block"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}
