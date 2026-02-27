"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Activity, ArrowRight, Github, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  const handleGithubLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Illustration/Branding */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-black/40 border-r border-white/10 items-center justify-center p-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        
        <div className="relative z-10 max-w-lg">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-[0_0_30px_rgba(var(--primary),0.5)]">
              <Activity className="w-7 h-7 text-white" />
            </div>
            <span className="font-bold text-3xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">TechIntel</span>
          </div>
          <h1 className="text-4xl font-bold mb-6 leading-tight">
            Access the world's most advanced technology forecasting engine.
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Join industry leaders using predictive analytics to stay ahead of the technology curve.
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-card p-4">
              <div className="text-2xl font-bold text-primary mb-1">100+</div>
              <div className="text-sm text-muted-foreground">Technologies Tracked</div>
            </div>
            <div className="glass-card p-4">
              <div className="text-2xl font-bold text-accent mb-1">4</div>
              <div className="text-sm text-muted-foreground">Data Pillars</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-8 relative z-10"
        >
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight mb-2">Welcome back</h2>
            <p className="text-muted-foreground">Enter your credentials to access your dashboard.</p>
          </div>

          <div className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full h-12 glass hover:bg-white/5 border-white/10 flex items-center gap-3"
              onClick={handleGithubLogin}
            >
              <Github className="w-5 h-5" />
              Continue with GitHub
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleLogin}>
            {error && (
              <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input 
                  type="email" 
                  placeholder="name@company.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full h-12 bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-muted-foreground">Password</label>
                <Link href="#" className="text-xs text-primary hover:underline">Forgot password?</Link>
              </div>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full h-12 bg-black/20 border border-white/10 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>
            
            <div className="pt-2">
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground text-base font-medium shadow-[0_0_20px_-5px_rgba(var(--primary),0.4)]"
              >
                {loading ? "Signing in..." : "Sign In"} <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account? <Link href="/signup" className="text-primary hover:underline font-medium">Request access</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
