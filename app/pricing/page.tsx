"use client";

import Link from "next/link";
import { useI18n } from "@/components/providers/i18n";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Check, Star, MessageCircle, ArrowRight } from "lucide-react";

export default function PricingPage() {
  const { t } = useI18n();
  const phone = "+971555000000"; // TODO: replace with your WhatsApp number
  const msg = encodeURIComponent(t("pricing.whatsapp.message", "Hi! I'm interested in your language courses and would like to know more about pricing and enrollment."));
  const wa = `https://wa.me/${phone}?text=${msg}`;

  const plan = {
    name: t("pricing.plan.name", "Language Learning Program"),
    description: t("pricing.plan.description", "Comprehensive language learning with expert teachers and flexible scheduling"),
    features: [
      t("pricing.plan.feature1", "Flexible lesson scheduling"),
      t("pricing.plan.feature2", "Expert native-speaking teachers"),
      t("pricing.plan.feature3", "Personalized curriculum"),
      t("pricing.plan.feature4", "Small group or 1-on-1 classes"),
      t("pricing.plan.feature5", "All skill levels welcome"),
      t("pricing.plan.feature6", "Progress tracking & assessments"),
      t("pricing.plan.feature7", "Learning materials included"),
      t("pricing.plan.feature8", "Ongoing support & guidance"),
    ],
    ctaText: t("pricing.plan.cta", "Get Started"),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/50 via-white to-green-50/30 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {t("pricing.title", "Start Your Language Journey")}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t("pricing.subtitle", "Join our comprehensive language learning program designed for all skill levels. Contact us for personalized pricing.")}
          </p>
        </motion.div>

        {/* Single Plan Card */}
        <div className="max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            whileHover={{ y: -5 }}
          >
            <Card className="shadow-2xl border-0 bg-gradient-to-br from-white to-green-50/30">
              <CardHeader className="text-center pb-8">
                <div className="mb-4">
                  <Badge className="bg-green-600 text-white px-6 py-2 text-sm">
                    <Star className="h-4 w-4 mr-2" />
                    {t("pricing.featured_plan", "Our Program")}
                  </Badge>
                </div>
                <CardTitle className="text-3xl font-bold text-gray-900 mb-4">
                  {plan.name}
                </CardTitle>
                <p className="text-lg text-gray-600 max-w-lg mx-auto">{plan.description}</p>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid md:grid-cols-2 gap-4">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start">
                      <Check className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
                <div className="text-center pt-4">
                  <Button
                    className="bg-green-600 hover:bg-green-700 px-8"
                    size="lg"
                    asChild
                  >
                    <a href={wa} target="_blank" rel="noreferrer">
                      <MessageCircle className="mr-2 h-5 w-5" />
                      {t("pricing.contact_whatsapp", "Get Pricing via WhatsApp")}
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            {t("pricing.faq.title", "Frequently Asked Questions")}
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="text-left">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t("pricing.faq.q1", "Can I change my plan anytime?")}
              </h3>
              <p className="text-gray-600">
                {t("pricing.faq.a1", "Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the next billing cycle.")}
              </p>
            </div>
            <div className="text-left">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t("pricing.faq.q2", "Is there a free trial?")}
              </h3>
              <p className="text-gray-600">
                {t("pricing.faq.a2", "We offer a 7-day free trial for all new students. No credit card required to start.")}
              </p>
            </div>
            <div className="text-left">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t("pricing.faq.q3", "What if I miss a lesson?")}
              </h3>
              <p className="text-gray-600">
                {t("pricing.faq.a3", "All lessons are recorded and available for 30 days. You can also reschedule with 24-hour notice.")}
              </p>
            </div>
            <div className="text-left">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t("pricing.faq.q4", "Do you offer refunds?")}
              </h3>
              <p className="text-gray-600">
                {t("pricing.faq.a4", "We offer a 30-day money-back guarantee if you're not satisfied with our service.")}
              </p>
            </div>
          </div>
        </motion.div>

        {/* WhatsApp CTA */}
        <motion.div
          className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 text-center text-white"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <MessageCircle className="h-16 w-16 mx-auto mb-4 text-green-100" />
          <h2 className="text-2xl font-bold mb-4">
            {t("pricing.whatsapp.title", "Have questions? Let's chat!")}
          </h2>
          <p className="text-green-100 mb-6 max-w-2xl mx-auto">
            {t("pricing.whatsapp.subtitle", "Get personalized recommendations and answers to all your questions via WhatsApp.")}
          </p>
          <Button
            size="lg"
            className="bg-white text-green-600 hover:bg-green-50"
            asChild
          >
            <a href={wa} target="_blank" rel="noreferrer">
              <MessageCircle className="mr-2 h-5 w-5" />
              {t("pricing.whatsapp.cta", "Chat on WhatsApp")}
            </a>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
