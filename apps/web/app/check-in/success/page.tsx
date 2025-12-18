'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { InteractiveBackground } from '@/components/interactive-background';
import { useChecklistStore } from '@/stores/use-checklist.store';
import { SuccessCard } from './components/success-card';

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
    <div className="relative flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-br from-background to-muted/20 overflow-hidden">
      <InteractiveBackground color="34, 197, 94" /> {/* Green for success */}
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md"
      >
        <SuccessCard 
          data={successData}
          onCheckStatus={handleStatus}
          onGoHome={handleHome}
        />
      </motion.div>
    </div>
  );
}
