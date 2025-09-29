"use client";

import { useState } from "react";
import Link from "next/link";
import { setToken, http } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useI18n } from "@/components/providers/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const { t } = useI18n();
  const router = useRouter();
  const qc = useQueryClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const loginMut = useMutation({
    mutationFn: async () => {
      const res = await http.post<{ token: string; user: any }>("/login", { email, password });
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
    onError: (e: any) => setError(e.message || t("auth.login.error", "Login failed")),
  });

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    loginMut.mutate();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/50 via-white to-green-50/30 flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 text-center pb-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <CardTitle className="text-2xl font-bold text-gray-900">
                {t("auth.login.title", "Welcome back")}
              </CardTitle>
              <p className="text-gray-600 mt-2">
                {t("auth.login.subtitle", "Sign in to your account to continue")}
              </p>
            </motion.div>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Alert variant="error">{error}</Alert>
              </motion.div>
            )}
            
            <form onSubmit={onSubmit} className="space-y-4">
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Label htmlFor="email">
                  <Mail className="inline h-4 w-4 mr-2" />
                  {t("auth.login.email", "Email")}
                </Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    className="pl-9"
                    placeholder={t("auth.login.email_placeholder", "Enter your email")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loginMut.isPending}
                  />
                </div>
              </motion.div>
              
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Label htmlFor="password">
                  <Lock className="inline h-4 w-4 mr-2" />
                  {t("auth.login.password", "Password")}
                </Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    className="pl-9 pr-10"
                    placeholder={t("auth.login.password_placeholder", "Enter your password")}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loginMut.isPending}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700"
                    aria-label={showPassword ? t("auth.login.hide_password", "Hide password") : t("auth.login.show_password", "Show password")}
                    disabled={loginMut.isPending}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <div className="flex justify-end">
                  <Link href="/auth/forgot-password" className="text-sm text-green-600 hover:text-green-700">
                    {t("auth.login.forgot_password", "Forgot password?")}
                  </Link>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={loginMut.isPending}
                >
                  {loginMut.isPending ? (
                    <span className="inline-flex items-center justify-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("auth.login.signing_in", "Signing in...")}
                    </span>
                  ) : (
                    <>
                      {t("auth.login.submit", "Sign in")}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </motion.div>
            </form>
            
            <motion.div
              className="text-center pt-4 border-t"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <p className="text-sm text-gray-600">
                {t("auth.login.no_account", "Don't have an account?")} {" "}
                <Link
                  href="/auth/register"
                  className="font-medium text-green-600 hover:text-green-700 transition-colors"
                >
                  {t("auth.login.sign_up", "Sign up")}
                </Link>
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

