'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle2, Home, Search, Clock, Building2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { InteractiveBackground } from '@/components/interactive-background';
import { useChecklistStore } from '@/stores/use-checklist.store';
import { useEffect } from 'react';

export default function CheckInSuccessPage() {
  const router = useRouter();
  const { successData, clearChecklistData } = useChecklistStore();

  useEffect(() => {
    // If no success data (e.g. direct access), redirect home
    if (!successData) {
      router.replace('/');
    }
  }, [successData, router]);

  const handleHome = () => {
    clearChecklistData();
    router.push('/');
  };

  const handleStatus = () => {
    clearChecklistData();
    // Assuming this is the route for status check, or a placeholder
    router.push('/queue-status'); 
  };

  if (!successData) return null;

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center p-6 bg-linear-to-br from-background to-muted/20 overflow-hidden">
      <InteractiveBackground color="34, 197, 94" /> {/* Green for success */}
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="backdrop-blur-xl bg-background/60 border-white/20 shadow-2xl overflow-hidden">
          <div className="flex flex-col items-center p-8 text-center space-y-6">
            
            {/* Success Icon & Queue Number */}
            <div className="flex flex-col items-center space-y-4">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: 0.2 
                }}
                className="rounded-full bg-green-500/10 p-4 ring-1 ring-green-500/20"
              >
                <CheckCircle2 className="w-16 h-16 text-green-500" />
              </motion.div>
              
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm uppercase tracking-wider">Nomor Antrean Anda</p>
                <motion.div 
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4, type: "spring" }}
                  className="bg-background/50 border rounded-2xl px-6 py-3 font-mono text-4xl font-bold tracking-tight shadow-sm"
                >
                  {successData.queueNumber}
                </motion.div>
              </div>
            </div>

            {/* Receipt Details */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="w-full space-y-4 border-t pt-6"
            >
              <div className="grid grid-cols-2 gap-4 text-left">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <User className="w-3.5 h-3.5" />
                    <span>Driver</span>
                  </div>
                  <p className="font-medium text-sm truncate">{successData.driverName}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Perusahaan</span>
                  </div>
                  <p className="font-medium text-sm truncate">{successData.companyName}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Waktu Submit</span>
                  </div>
                  <p className="font-medium text-sm">{successData.submitTime}</p>
                </div>

                 <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Status</span>
                  </div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500">
                    {successData.status}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="w-full space-y-3 pt-2"
            >
              <Button 
                onClick={handleStatus}
                variant="outline"
                className="w-full h-11 text-base font-medium"
              >
                <Search className="mr-2 h-4 w-4" />
                Cek Status Antrean
              </Button>

              <Button 
                onClick={handleHome} 
                className="w-full h-11 text-base font-medium shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
              >
                <Home className="mr-2 h-4 w-4" />
                Kembali ke Beranda
              </Button>
            </motion.div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
