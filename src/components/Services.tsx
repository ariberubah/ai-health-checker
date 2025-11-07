"use client";

import { motion } from "framer-motion";
import {
  Stethoscope,
  HeartPulse,
  Brain,
  Shield,
  BookOpenCheck,
  ActivitySquare,
  Apple,
  Ambulance,
  Lightbulb,
  CalendarCheck2,
} from "lucide-react";

export default function Services() {
  const services = [
    {
      icon: Stethoscope,
      title: "Virtual Consultation",
      desc: "Talk with certified doctors through our secure AI-assisted platform for faster diagnosis and treatment.",
      bg: "bg-green-50",
      iconBg: "bg-green-500",
    },
    {
      icon: HeartPulse,
      title: "Health Monitoring",
      desc: "Track vital signs and health metrics in real-time, powered by personalized AI insights.",
      bg: "bg-green-50",
      iconBg: "bg-green-500",
    },
    {
      icon: Brain,
      title: "AI Diagnostics",
      desc: "Get intelligent health assessments and instant reports using advanced AI algorithms.",
      bg: "bg-green-50",
      iconBg: "bg-green-500",
    },
    {
      icon: Shield,
      title: "Data Security",
      desc: "Your medical data is fully encrypted and safe under industry-leading protection standards.",
      bg: "bg-green-50",
      iconBg: "bg-green-500",
    },
  ];

  const extras = [
    {
      icon: BookOpenCheck,
      title: "Health Library",
      desc: "Access trusted health articles and guides to understand your body better.",
      bg: "bg-green-50",
      iconBg: "bg-green-500",
    },
    {
      icon: ActivitySquare,
      title: "Symptom Analysis",
      desc: "Use our AI-powered checker for quick, educational symptom insights.",
      bg: "bg-sky-50",
      iconBg: "bg-sky-500",
    },
    {
      icon: Apple,
      title: "Nutrition Planner",
      desc: "Create balanced meal plans and track your daily nutrient intake.",
      bg: "bg-amber-50",
      iconBg: "bg-amber-500",
    },
    {
      icon: Ambulance,
      title: "Emergency Help",
      desc: "Find nearby emergency contacts and first-aid steps instantly.",
      bg: "bg-rose-50",
      iconBg: "bg-rose-500",
    },
    {
      icon: Lightbulb,
      title: "AI Health Tips",
      desc: "Get smart, bite-sized wellness advice tailored to your habits.",
      bg: "bg-indigo-50",
      iconBg: "bg-indigo-500",
    },
    {
      icon: CalendarCheck2,
      title: "Daily Health Insight",
      desc: "Stay motivated with personalized daily check-ins and reminders.",
      bg: "bg-teal-50",
      iconBg: "bg-teal-500",
    },
  ];

  return (
    <>
      {/* Section 1 */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-semibold text-gray-800 mb-12"
          >
            Our <span className="text-green-600">Healthcare Services</span>
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, i) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15, duration: 0.6 }}
                  className={`${service.bg} rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col items-center text-center`}
                >
                  <div
                    className={`${service.iconBg} p-3 rounded-full mb-4 text-white`}
                  >
                    <Icon size={28} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{service.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 2 */}
      <section className="py-24 bg-white border-t border-green-100">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-semibold text-gray-800 mb-12"
          >
            Explore Our <span className="text-green-600">Health Features</span>
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {extras.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15, duration: 0.6 }}
                  className={`${feature.bg} rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col items-center text-center border border-green-100`}
                >
                  <div
                    className={`${feature.iconBg} p-3 rounded-full mb-4 text-white`}
                  >
                    <Icon size={28} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{feature.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
