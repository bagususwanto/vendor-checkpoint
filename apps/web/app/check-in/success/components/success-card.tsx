'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Home, Search, Clock, Building2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SuccessData } from '@/stores/use-checklist.store';

interface SuccessCardProps {
  data: SuccessData;
  onCheckStatus: () => void;
  onGoHome: () => void;
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export function SuccessCard({ data, onCheckStatus, onGoHome }: SuccessCardProps) {
  return (
    <Card className="backdrop-blur-xl bg-background/60 border-white/20 shadow-2xl overflow-hidden w-full max-w-md">
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
              {data.queueNumber}
            </motion.div>
          </div>
        </div>

        {/* Receipt Details */}
        <motion.div 
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.5 }}
          className="w-full space-y-4 border-t pt-6"
        >
          <div className="grid grid-cols-2 gap-4 text-left">
            <InfoItem 
              icon={<User className="w-3.5 h-3.5" />} 
              label="Driver" 
              value={data.driverName} 
            />
            <InfoItem 
              icon={<Building2 className="w-3.5 h-3.5" />} 
              label="Perusahaan" 
              value={data.companyName} 
            />
            <InfoItem 
              icon={<Clock className="w-3.5 h-3.5" />} 
              label="Waktu Submit" 
              value={data.submitTime} 
            />
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Status</span>
              </div>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500">
                {data.status}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div 
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.6 }}
          className="w-full space-y-3 pt-2"
        >
          <Button 
            onClick={onCheckStatus}
            variant="outline"
            className="w-full"
            size="lg"
          >
            <Search className="mr-2 w-4 h-4" />
            Cek Status Antrean
          </Button>

          <Button 
            onClick={onGoHome} 
            className="w-full"
            size="lg"
          >
            <Home className="mr-2 w-4 h-4" />
            Kembali ke Beranda
          </Button>
        </motion.div>
      </div>
    </Card>
  );
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      <p className="font-medium text-sm truncate">{value}</p>
    </div>
  );
}
