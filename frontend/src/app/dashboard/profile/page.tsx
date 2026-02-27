"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Mail, Calendar, Shield, Activity, Clock, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    }
    getUser();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-full">Loading profile...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">User Profile</h1>
        <p className="text-muted-foreground">Manage your account settings and view your activity history.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Info Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-1 space-y-6"
        >
          <div className="glass-card p-6 flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-primary/20 to-accent/20"></div>
            <div className="w-24 h-24 rounded-full bg-background border-4 border-background flex items-center justify-center relative z-10 mt-8 shadow-xl">
              <User className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-bold mt-4">{user?.email?.split('@')[0] || 'User'}</h2>
            <p className="text-sm text-muted-foreground mb-4">{user?.email}</p>
            <div className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
              <Shield className="w-3 h-3" /> Pro Member
            </div>
          </div>

          <div className="glass-card p-6 space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Settings className="w-4 h-4 text-primary" /> Account Details
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-muted-foreground flex items-center gap-2"><Mail className="w-4 h-4" /> Email</span>
                <span className="truncate max-w-[120px]">{user?.email}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-muted-foreground flex items-center gap-2"><Calendar className="w-4 h-4" /> Joined</span>
                <span>{new Date(user?.created_at || Date.now()).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground flex items-center gap-2"><Activity className="w-4 h-4" /> Status</span>
                <span className="text-success">Active</span>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4 glass hover:bg-white/5">Edit Profile</Button>
          </div>
        </motion.div>

        {/* Activity History */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-2"
        >
          <div className="glass-card p-6 h-full">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" /> Recent Activity
            </h3>
            
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
              
              {[
                { title: "Logged in", time: "Just now", desc: "Successfully authenticated via Email.", type: "auth" },
                { title: "Viewed Dashboard", time: "2 hours ago", desc: "Accessed the main intelligence overview.", type: "view" },
                { title: "Analyzed 'Physical AI'", time: "Yesterday", desc: "Deep dive into robotics and physical AI metrics.", type: "action" },
                { title: "Account Created", time: new Date(user?.created_at || Date.now()).toLocaleDateString(), desc: "Welcome to TechIntel.", type: "system" },
              ].map((item, i) => (
                <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-background glass shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl glass-panel border border-white/5 hover:border-primary/30 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-sm text-white">{item.title}</h4>
                      <span className="text-xs text-muted-foreground">{item.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
              
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
