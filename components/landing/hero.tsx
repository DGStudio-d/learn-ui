"use client";

import Link from "next/link";
import { useI18n } from "@/components/providers/i18n";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Hero() {
  const { locale, t } = useI18n();
  const isRTL = locale === "ar";

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-green-50/50 via-white to-green-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image */}
          <motion.div 
            className={isRTL ? "order-2 lg:order-2" : "order-2 lg:order-1"}
            initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-2xl transform rotate-3" />
              <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden transform -rotate-1 hover:rotate-0 transition-transform duration-300">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop"
                  alt="Students learning languages"
                  className="w-full h-64 sm:h-80 lg:h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div 
            className={`${isRTL ? "order-1 lg:order-1 text-right" : "order-1 lg:order-2"} space-y-6`}
            initial={{ opacity: 0, x: isRTL ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
                {t("hero.tag", "Our Courses")}
              </span>
            </motion.div>
            
            <motion.h1 
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="block">{t("hero.title.line1", "High-quality language")}</span>
              <span className="block text-green-600">{t("hero.title.line2", "courses at reasonable")}</span>
              <span className="block">{t("hero.title.line3", "prices")}</span>
            </motion.h1>
            
            <motion.p 
              className="text-lg text-gray-600 leading-relaxed max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {t("hero.subtitle", "Choose the right language for you - remove barriers or start from scratch.")}
            </motion.p>
            
            <motion.div 
              className={`flex flex-col sm:flex-row gap-4 ${isRTL ? "sm:justify-end" : ""}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Button size="lg" asChild>
                <Link href="/auth/register">
                  {t("hero.enroll", "Enroll now")}
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/languages">
                  {t("hero.explore", "Explore languages")}
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
