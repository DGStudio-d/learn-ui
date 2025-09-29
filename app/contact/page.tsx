"use client";

import { useState } from "react";
import { useI18n } from "@/components/providers/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Mail, User, MessageSquare, Send, MapPin, Phone, Clock } from "lucide-react";

export default function ContactPage() {
  const { t } = useI18n();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    alert(t("contact.success", "Message sent successfully!"));
    setName("");
    setEmail("");
    setMessage("");
    setIsSubmitting(false);
  }

  const contactInfo = [
    {
      icon: MapPin,
      title: t("contact.address.title", "Address"),
      content: t("contact.address.content", "123 Learning Street, Education City"),
    },
    {
      icon: Phone,
      title: t("contact.phone.title", "Phone"),
      content: t("contact.phone.content", "+1 (555) 123-4567"),
    },
    {
      icon: Clock,
      title: t("contact.hours.title", "Office Hours"),
      content: t("contact.hours.content", "Mon-Fri: 9AM-6PM"),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/50 via-white to-green-50/30 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {t("contact.title", "Get in touch")}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t("contact.subtitle", "Have questions about our courses? We'd love to hear from you.")}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  {t("contact.form.title", "Send us a message")}
                </CardTitle>
                <p className="text-gray-600">
                  {t("contact.form.subtitle", "Fill out the form below and we'll get back to you soon.")}
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={onSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="contact-name">
                      <User className="inline h-4 w-4 mr-2" />
                      {t("contact.form.name", "Name")}
                    </Label>
                    <Input
                      id="contact-name"
                      placeholder={t("contact.form.name_placeholder", "Your full name")}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="contact-email">
                      <Mail className="inline h-4 w-4 mr-2" />
                      {t("contact.form.email", "Email")}
                    </Label>
                    <Input
                      id="contact-email"
                      type="email"
                      placeholder={t("contact.form.email_placeholder", "your@email.com")}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="contact-message">
                      <MessageSquare className="inline h-4 w-4 mr-2" />
                      {t("contact.form.message", "Message")}
                    </Label>
                    <Textarea
                      id="contact-message"
                      placeholder={t("contact.form.message_placeholder", "Tell us about your language learning goals...")}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      disabled={isSubmitting}
                      className="min-h-[120px]"
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      t("contact.form.sending", "Sending...")
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        {t("contact.form.submit", "Send message")}
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t("contact.info.title", "Contact Information")}
              </h2>
              <p className="text-gray-600 mb-8">
                {t("contact.info.subtitle", "Reach out to us through any of these channels.")}
              </p>
            </div>
            
            <div className="space-y-6">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <motion.div
                    key={index}
                    className="flex items-start space-x-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                  >
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <Icon className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {info.title}
                      </h3>
                      <p className="text-gray-600">{info.content}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            
            <motion.div
              className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {t("contact.cta.title", "Ready to start learning?")}
              </h3>
              <p className="text-gray-600 mb-6">
                {t("contact.cta.subtitle", "Join thousands of students who have improved their language skills with us.")}
              </p>
              <Button size="lg" asChild>
                <a href="/auth/register">
                  {t("contact.cta.button", "Get started today")}
                </a>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
