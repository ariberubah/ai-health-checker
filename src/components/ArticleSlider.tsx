"use client";

import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { NavigationOptions, Swiper as SwiperClass } from "swiper/types";
import "swiper/css";
import "swiper/css/navigation";
import Image from "next/image";
import { motion } from "framer-motion";

const articles = [
  {
    title: "AI in Preventive Healthcare",
    desc: "How artificial intelligence is transforming early detection and health management.",
    image: "/asset/article-1.jpg",
  },
  {
    title: "Personalized Nutrition Insights",
    desc: "Understanding how AI tailors dietary plans based on your health data.",
    image: "/asset/article-2.jpg",
  },
  {
    title: "Mental Health Meets Technology",
    desc: "Exploring how digital tools enhance emotional wellness and therapy access.",
    image: "/asset/article-3.jpg",
  },
  {
    title: "Future of Remote Monitoring",
    desc: "Wearable devices and AI predicting illness before symptoms appear.",
    image: "/asset/article-4.jpg",
  },
  {
    title: "Building Trust in Health AI",
    desc: "The ethics behind AI-driven healthcare and patient data transparency.",
    image: "/asset/article-5.jpg",
  },
];

export default function ArticleSlider() {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  const initNavigation = (swiper: SwiperClass) => {
    const nav = swiper.params.navigation;

    if (prevRef.current && nextRef.current && typeof nav !== "boolean") {
      (nav as NavigationOptions).prevEl = prevRef.current;
      (nav as NavigationOptions).nextEl = nextRef.current;

      swiper.navigation.init();
      swiper.navigation.update();
    }
  };
  return (
    <section className="py-24 bg-white border-t border-green-100">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header + navigasi sejajar */}
        <div className="flex items-center justify-between mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-semibold text-gray-800"
          >
            Explore Our <span className="text-green-600">Latest Articles</span>
          </motion.h2>

          <div className="flex items-center gap-3">
            <button
              ref={prevRef}
              className="bg-green-100 hover:bg-green-200 text-green-700 p-2 rounded-full transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              ref={nextRef}
              className="bg-green-100 hover:bg-green-200 text-green-700 p-2 rounded-full transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>

        <Swiper
          modules={[Navigation]}
          spaceBetween={24}
          breakpoints={{
            320: { slidesPerView: 1.1 },
            640: { slidesPerView: 2 },
            1280: { slidesPerView: 3 },
          }}
          loop={true}
          onSwiper={initNavigation}
          className="pb-12"
        >
          {articles.map((a, i) => (
            <SwiperSlide key={i}>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-green-50 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative w-full h-48">
                  <Image
                    src={a.image}
                    alt={a.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 text-left">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {a.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{a.desc}</p>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
