"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function SmartHealthSection() {
  const sections = [
    {
      title: "Smart AI Health Chat Bot",
      desc: "Your intelligent health companion that listens, understands, and guides you toward better wellbeing — anytime, anywhere.",
      button: "Try the Chat Bot",
      image: "/asset/ai-chatbot.png",
      reverse: false,
    },
    {
      title: "Predictive Health Monitoring",
      desc: "Stay ahead of potential risks with real-time AI predictions, giving you actionable insights before symptoms appear.",
      button: "Start Live Monitoring",
      accuracy: "Accuracy 96.4%",
      image: "/asset/health-monitoring.png",
      reverse: true,
    },
  ];

  return (
    <section className="py-24 bg-white border-t border-green-100">
      <div className="max-w-6xl mx-auto px-6 space-y-32">
        {sections.map((sec, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`flex flex-col lg:flex-row items-center gap-12 ${
              sec.reverse ? "lg:flex-row-reverse" : ""
            }`}
          >
            {/* Gambar */}
            <div className="lg:w-1/2 flex justify-center">
              <div className="relative w-full max-w-[500px] aspect-square rounded-3xl overflow-hidden flex items-center justify-center">
                <Image
                  src={sec.image}
                  alt={sec.title}
                  fill
                  className="object-contain p-4"
                />
              </div>
            </div>

            {/* Konten */}
            <div className="lg:w-1/2 text-center lg:text-left">
              <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-4">
                {sec.title}
              </h2>
              <p className="text-gray-600 mb-6">{sec.desc}</p>
              {sec.accuracy && (
                <p className="text-green-600 font-semibold mb-6">
                  {sec.accuracy}
                </p>
              )}
              <button className="bg-green-600 text-white px-6 py-3 rounded-lg shadow hover:bg-green-700 transition">
                {sec.button}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
