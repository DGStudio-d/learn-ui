"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { setToken, http } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useI18n } from "@/components/providers/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { motion } from "framer-motion";
import { User, Mail, Lock, Globe, BookOpen, ArrowRight, CreditCard, MessageCircle, Copy } from "lucide-react";

type Level = { id: number; language_id: number; name: string; order: number };
type Language = { id: number; code: string; name: string; active: boolean; levels?: Level[] };

export default function RegisterPage() {
  const { t, locale } = useI18n();
  const router = useRouter();
  const qc = useQueryClient();
  const [activeTab, setActiveTab] = useState<'register' | 'payment'>('register');
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [languageId, setLanguageId] = useState<string>("");
  const [levelId, setLevelId] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  
  const phone = "+971555000000"; // TODO: replace with your WhatsApp number
  const whatsappMsg = encodeURIComponent(t("register.whatsapp.message", "Hi! I've completed the registration form and would like to confirm my enrollment."));
  const whatsappUrl = `https://wa.me/${phone}?text=${whatsappMsg}`;

  // Fetch languages with levels using current locale
  const langsQuery = useQuery<{ data: Language[] }>({
    queryKey: ["register-languages", locale],
    queryFn: async () => {
      const res = await http.get<{ data: Language[] }>("/languages", {
        params: { locale, with_levels: 1, active: true },
      });
      return res.data;
    },
  });

  const levels = useMemo<Level[]>(() => {
    const lang = (langsQuery.data?.data || []).find(l => String(l.id) === languageId);
    return lang?.levels || [];
  }, [langsQuery.data, languageId]);

  const registerMut = useMutation({
    mutationFn: async () => {
      const res = await http.post<{ token: string; user: any }>("/register", {
        name,
        email,
        password,
        language_id: Number(languageId),
        level_id: Number(levelId),
      });
      return res.data;
    },
    onSuccess: async (data) => {
      setToken(data.token);
      const user = data.user;
      const isAdmin = user && (user.role === "admin" || user.roles?.includes?.("admin"));
      const target = isAdmin ? "/admin" : "/student";
      await qc.invalidateQueries();
      router.replace(target);
      router.refresh();
    },
    onError: (e: any) => setError(e.message || t("auth.register.error", "Registration failed")),
  });

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    registerMut.mutate();
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/50 via-white to-green-50/30 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t("register.title", "Register for Language Courses")}
          </h1>
          <p className="text-gray-600">
            {t("register.subtitle", "Fill out the form below to register for one of our language courses. Our team will contact you as soon as possible to confirm registration and arrange lesson times.")}
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          className="flex bg-gray-100 rounded-lg p-1 mb-8 max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              activeTab === 'register'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {t("register.tab.register", "Register")}
          </button>
          <button
            onClick={() => setActiveTab('payment')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              activeTab === 'payment'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {t("register.tab.payment", "Bank Transfer")}
          </button>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'register' ? (
            <Card className="shadow-xl border-0 max-w-2xl mx-auto">
              <CardContent className="p-8 space-y-6">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Alert variant="error">{error}</Alert>
                  </motion.div>
                )}
            
                <form onSubmit={onSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        <User className="inline h-4 w-4 mr-2" />
                        {t("auth.register.name", "Full Name")}
                      </Label>
                      <Input
                        id="name"
                        placeholder={t("auth.register.name_placeholder", "Enter your full name")}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        disabled={registerMut.isPending}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">
                        <Mail className="inline h-4 w-4 mr-2" />
                        {t("auth.register.email", "Email")}
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder={t("auth.register.email_placeholder", "Enter your email")}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={registerMut.isPending}
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="password">
                        <Lock className="inline h-4 w-4 mr-2" />
                        {t("auth.register.password", "Password")}
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder={t("auth.register.password_placeholder", "Create a password")}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={registerMut.isPending}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="language">
                        <Globe className="inline h-4 w-4 mr-2" />
                        {t("auth.register.language", "Language")}
                      </Label>
                      <Select
                        id="language"
                        value={languageId}
                        onChange={(e) => {
                          setLanguageId(e.target.value);
                          setLevelId("");
                        }}
                        required
                        disabled={langsQuery.isLoading || langsQuery.isError || registerMut.isPending}
                      >
                        <option value="" disabled>
                          {langsQuery.isLoading ? t("common.loading", "Loading...") : t("auth.register.select_language", "Select a language")}
                        </option>
                        {(langsQuery.data?.data || []).map((l) => (
                          <option key={l.id} value={String(l.id)}>
                            {l.name} ({l.code.toUpperCase()})
                          </option>
                        ))}
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="level">
                      <BookOpen className="inline h-4 w-4 mr-2" />
                      {t("auth.register.level", "Level")}
                    </Label>
                    <Select
                      id="level"
                      value={levelId}
                      onChange={(e) => setLevelId(e.target.value)}
                      required
                      disabled={!languageId || langsQuery.isLoading || registerMut.isPending}
                    >
                      <option value="" disabled>
                        {t("auth.register.select_level", "Select your level")}
                      </option>
                      {levels.map((level) => (
                        <option key={level.id} value={String(level.id)}>
                          {level.name}
                        </option>
                      ))}
                    </Select>
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={registerMut.isPending}
                  >
                    {registerMut.isPending ? (
                      t("auth.register.registering", "Creating account...")
                    ) : (
                      <>
                        {t("auth.register.submit", "Register")}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
            
                <div className="text-center pt-4 border-t">
                  <p className="text-sm text-gray-600">
                    {t("auth.register.have_account", "Already have an account?")}{" "}
                    <Link
                      href="/auth/login"
                      className="font-medium text-green-600 hover:text-green-700 transition-colors"
                    >
                      {t("auth.register.sign_in", "Sign in")}
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-xl border-0 max-w-2xl mx-auto">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {t("register.payment.title", "You can pay in advance")}
                  </h2>
                  <p className="text-gray-600">
                    {t("register.payment.subtitle", "Via transfer to one of the banks below")}
                  </p>
                </div>

                <div className="space-y-8">
                  {/* BARID BANK */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-center text-gray-900 mb-6">
                      {t("register.payment.barid_bank", "Via BARID BANK")}
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-700">
                          {t("register.payment.rib", "RIB")}:
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-gray-900">350810000000007352205 97</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard('35081000000000735220597')}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-700">
                          {t("register.payment.iban", "IBAN")}:
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-gray-900">
                            MA64 350 810 <span className="text-green-600 font-bold">000000007352205</span> 597
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard('MA64350810000000007352205597')}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CIH BANK */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-center text-gray-900 mb-6">
                      {t("register.payment.cih_bank", "Via CIH BANK")}
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-700">
                          {t("register.payment.account_holder", "Account Holder")}:
                        </span>
                        <span className="font-semibold text-gray-900">ZAKARIA AFIF</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-700">
                          {t("register.payment.rib", "RIB")}:
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-gray-900">
                            230 610 <span className="text-green-600 font-bold">36784452110016</span> 0 013
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard('230610367844521100160013')}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-700">
                          {t("register.payment.iban", "IBAN")}:
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-gray-900">
                            MA64 <span className="text-green-600 font-bold">2306 1036 7844 5211 0016</span> 0013
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard('MA64230610367844521100160013')}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-700">
                          {t("register.payment.swift_code", "Code SWIFT")}:
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-gray-900">CIHMMAMC</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard('CIHMMAMC')}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-green-50 rounded-lg">
                  <p className="text-center text-gray-700 mb-4">
                    {t("register.payment.contact_note", "After completing the transfer, please contact us via WhatsApp to confirm your registration")}
                  </p>
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700"
                    size="lg"
                    asChild
                  >
                    <a href={whatsappUrl} target="_blank" rel="noreferrer">
                      <MessageCircle className="mr-2 h-5 w-5" />
                      {t("register.payment.contact_whatsapp", "Contact us via WhatsApp")}
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}
