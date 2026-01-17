"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  UserCredential,
} from "firebase/auth";
import { auth, googleProvider } from "@/config/firebaseClient";
import toast from "react-hot-toast";

// --- UI Components ---
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Loader2, Quote, Eye, EyeOff } from "lucide-react";
import { GoogleIcon } from "./icons"; // Ensure this path is correct for your project

// --- Zod Schemas ---
const loginSchema = z.object({
  email: z.string().email("Invalid email address.").trim(),
  password: z.string().min(1, "Password is required."),
});

const signupSchema = z.object({
  firstName: z.string().min(1, "First name is required.").trim(),
  lastName: z.string().min(1, "Last name is required.").trim(),
  email: z.string().email("Invalid email address.").trim(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .regex(/[a-z]/, "Must have lowercase")
    .regex(/[A-Z]/, "Must have uppercase")
    .regex(/[0-9]/, "Must have number"),
});

type AuthView = "login" | "signup";

export default function AuthPage({
  initialView = "login",
}: {
  initialView?: AuthView;
}) {
  const [view, setView] = useState<AuthView>(initialView);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: { firstName: "", lastName: "", email: "", password: "" },
  });

  // --- Core Auth Logic ---

  // Helper: Syncs Firebase User with your Postgres DB & Sets Session Cookie
  const handleServerSync = async (userCredential: UserCredential) => {
    try {
      const token = await userCredential.user.getIdToken(true); // Force refresh to get latest claims (like name)

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: token }),
      });

      if (!response.ok) {
        throw new Error("Failed to create session");
      }

      toast.success(view === "login" ? "Welcome back!" : "Account created!");
      router.refresh(); // Crucial: Updates middleware state
      router.push("/dashboard");
    } catch (error) {
      console.error("Sync Error:", error);
      toast.error(
        "Login successful, but server sync failed. Please try again."
      );
      setIsLoading(false);
    }
  };

  const onLogin = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      await handleServerSync(cred);
    } catch (error: any) {
      console.error(error);
      if (error.code === "auth/invalid-credential") {
        toast.error("Invalid email or password.");
      } else if (error.code === "auth/too-many-requests") {
        toast.error("Too many attempts. Reset password or try later.");
      } else {
        toast.error("Login failed. Please try again.");
      }
      setIsLoading(false);
    }
  };

  const onSignup = async (values: z.infer<typeof signupSchema>) => {
    setIsLoading(true);
    try {
      // 1. Create User
      const cred = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );

      // 2. Update Profile immediately so Backend receives the name
      await updateProfile(cred.user, {
        displayName: `${values.firstName} ${values.lastName}`,
      });

      // 3. Sync to Backend
      await handleServerSync(cred);
    } catch (error: any) {
      console.error(error);
      if (error.code === "auth/email-already-in-use") {
        toast.error("Email already exists. Please login.");
        setView("login");
      } else {
        toast.error("Registration failed. Please try again.");
      }
      setIsLoading(false);
    }
  };

  const onGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      await handleServerSync(cred);
    } catch (error: any) {
      console.error(error);
      if (error.code !== "auth/popup-closed-by-user") {
        toast.error("Google sign-in failed.");
      }
      setIsLoading(false);
    }
  };

  // --- Render ---
  return (
    <div className="container min-h-screen flex-col fixed items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0 bg-[#05050A]">
      {/* --- LEFT PANEL: Visuals & Branding --- */}
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r border-white/5">
        <div className="absolute inset-0 bg-[#0B0C15]" />

        {/* Abstract Background Image */}
        <div className="absolute inset-0 z-0 opacity-40">
          <img
            src="/aldiyar-LbMpHvKkbQg-unsplash.jpg"
            alt="Cybersecurity Background"
            className="object-cover h-full w-full"
          />
          <div className="absolute inset-0 " />
        </div>

        {/* Logo Area */}
        <Link
          href={"/"}
          className="relative z-20 flex items-center text-lg font-medium"
        >
          <img src="/logo.png" alt="logo" width={140} height={40} />
        </Link>

        {/* Testimonial */}
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-4">
            <Quote className="h-8 w-8 text-violet-500/50 mb-4" />
            <p className="text-lg font-light leading-relaxed text-slate-200">
              &ldquo;Pentellia has completely revolutionized our vulnerability
              management workflow. The automated scanning and real-time
              reporting give us the confidence to deploy faster.&rdquo;
            </p>
            <footer className="text-sm font-medium text-slate-400">
              <div className="text-white">Sandeep Verma | Parth Awasthi</div>
              <div className="text-violet-400">Encoderspro, Pvt Limited.</div>
            </footer>
          </blockquote>
        </div>
      </div>

      {/* --- RIGHT PANEL: Form --- */}
      <div className="lg:p-8 relative flex items-center justify-center h-full">
        {/* Ambient Glows */}
        <div className="absolute top-[-20%] right-[-10%] w-[300px] h-[300px] bg-violet-600/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[300px] h-[300px] bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px] relative z-10 p-4 sm:p-0">
          {/* Header */}
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tighter text-white">
              {view === "login" ? "Welcome back" : "Create an account"}
            </h1>
            <p className="text-sm text-slate-400">
              {view === "login"
                ? "Enter your credentials to access your command center."
                : "Enter your email below to start your security journey."}
            </p>
          </div>

          {/* Glass Card Container */}
          <div
            className={cn(
              "grid gap-6 p-6 md:p-8 rounded-2xl border border-white/10 bg-[#0B0C15]/40 backdrop-blur-xl shadow-2xl transition-all duration-500"
            )}
          >
            {/* --- LOGIN FORM --- */}
            {view === "login" && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <Form {...loginForm}>
                  <form
                    onSubmit={loginForm.handleSubmit(onLogin)}
                    className="space-y-4"
                  >
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-300 text-xs uppercase tracking-wider font-semibold">
                            Email
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="name@company.com"
                              {...field}
                              className="h-10 bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus-visible:ring-violet-500 focus-visible:border-violet-500/50"
                            />
                          </FormControl>
                          <FormMessage className="text-red-400 text-xs" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <FormLabel className="text-slate-300 text-xs uppercase tracking-wider font-semibold">
                              Password
                            </FormLabel>
                            <Link
                              href="/forgot-password"
                              className="text-xs text-violet-400 hover:text-violet-300"
                            >
                              Forgot?
                            </Link>
                          </div>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                {...field}
                                className="h-10 bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus-visible:ring-violet-500 focus-visible:border-violet-500/50 pr-10"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-slate-400 hover:text-white"
                                onClick={() => setShowPassword((prev) => !prev)}
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-400 text-xs" />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-10 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all"
                    >
                      {isLoading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}{" "}
                      Sign In
                    </Button>
                  </form>
                </Form>
              </div>
            )}

            {/* --- SIGNUP FORM --- */}
            {view === "signup" && (
              <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                <Form {...signupForm}>
                  <form
                    onSubmit={signupForm.handleSubmit(onSignup)}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={signupForm.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-300 text-xs uppercase tracking-wider font-semibold">
                              First Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="John"
                                {...field}
                                className="h-10 bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus-visible:ring-violet-500"
                              />
                            </FormControl>
                            <FormMessage className="text-red-400 text-xs" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={signupForm.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-300 text-xs uppercase tracking-wider font-semibold">
                              Last Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Doe"
                                {...field}
                                className="h-10 bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus-visible:ring-violet-500"
                              />
                            </FormControl>
                            <FormMessage className="text-red-400 text-xs" />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={signupForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-300 text-xs uppercase tracking-wider font-semibold">
                            Email
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="name@company.com"
                              {...field}
                              className="h-10 bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus-visible:ring-violet-500"
                            />
                          </FormControl>
                          <FormMessage className="text-red-400 text-xs" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signupForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-300 text-xs uppercase tracking-wider font-semibold">
                            Password
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                {...field}
                                className="h-10 bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus-visible:ring-violet-500 focus-visible:border-violet-500/50 pr-10"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-slate-400 hover:text-white"
                                onClick={() => setShowPassword((prev) => !prev)}
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-400 text-xs" />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-10 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all"
                    >
                      {isLoading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}{" "}
                      Create Account
                    </Button>
                  </form>
                </Form>
              </div>
            )}

            {/* Separator */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#0e0f18] px-2 text-slate-500">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Google Button */}
            <Button
              variant="outline"
              type="button"
              disabled={isLoading}
              onClick={onGoogleSignIn}
              className="w-full bg-white/5 border-white/10 hover:bg-white/10 hover:text-white text-slate-300 h-10"
            >
              <GoogleIcon className="mr-2 h-4 w-4" />
              Google
            </Button>
          </div>

          <p className="px-8 text-center text-sm text-slate-400">
            {view === "login"
              ? "New to Pentellia? "
              : "Already have an account? "}
            <button
              onClick={() => {
                setView(view === "login" ? "signup" : "login");
                setShowPassword(false);
              }}
              className="underline underline-offset-4 hover:text-violet-400 transition-colors font-medium text-white"
            >
              {view === "login" ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
