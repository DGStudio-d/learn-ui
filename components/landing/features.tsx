"use client";

import { useI18n } from "@/components/providers/i18n";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Users, Clock, DollarSign, Star } from "lucide-react";

export default function Features() {
  const { locale, t } = useI18n();
  
  const features = [
    {
      icon: Users,
      titleKey: "features.small_groups.title",
      descKey: "features.small_groups.desc",
      defaultTitle: "Small groups",
      defaultDesc: "Limited students for better interaction",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      icon: Clock,
      titleKey: "features.flexible_schedules.title",
      descKey: "features.flexible_schedules.desc",
      defaultTitle: "Flexible schedules",
      defaultDesc: "Morning and evening courses",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      icon: DollarSign,
      titleKey: "features.affordable_prices.title",
      descKey: "features.affordable_prices.desc",
      defaultTitle: "Affordable prices",
      defaultDesc: "Options for everyone",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      icon: Star,
      titleKey: "features.high_quality.title",
      descKey: "features.high_quality.desc",
      defaultTitle: "High quality",
      defaultDesc: "Expert teachers and quality content",
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-[var(--foreground)] mb-4">
            {t("features.title", "Why choose us?")}
          </h2>
          <p className="text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto">
            {t("features.subtitle", "We provide the best learning experience with our comprehensive approach")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full border-0 shadow-md hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${feature.bgColor} mb-4`}>
                      <Icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {t(feature.titleKey, feature.defaultTitle)}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {t(feature.descKey, feature.defaultDesc)}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}