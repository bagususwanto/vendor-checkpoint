'use client';

import { motion, Variants } from 'framer-motion';
import { CheckCircle2, Home, Search, Clock, Building2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SuccessData } from '@/stores/use-checklist.store';
import { cn } from '@/lib/utils';
import QRCode from "react-qr-code";
import { useEffect, useState } from 'react';

interface SuccessCardProps {
  data: SuccessData;
  onCheckStatus: () => void;
  onGoHome: () => void;
}

const ticketVariants: Variants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      type: "spring",
      damping: 25,
      stiffness: 300,
      duration: 0.5
    }
  },
};

const contentVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { delay: 0.2, duration: 0.3 }
  }
};

export function SuccessCard({ data, onCheckStatus, onGoHome }: SuccessCardProps) {
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  const queueUrl = origin ? `${origin}/queue-status?queueNumber=${data.queueNumber}` : '';

  return (
    <div className="w-full max-w-md mx-auto perspective-1000">
      <motion.div
        variants={ticketVariants}
        initial="hidden"
        animate="visible"
        className="relative w-full drop-shadow-2xl"
      >
        {/* Ticket Header */}
        <div className="bg-primary text-primary-foreground p-6 rounded-t-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <CheckCircle2 className="w-32 h-32 transform translate-x-8 -translate-y-8" />
          </div>
          
          <motion.div 
            variants={contentVariants}
            className="relative z-10 flex flex-col items-center text-center space-y-2"
          >
            <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm mb-2">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-sm font-medium opacity-90 uppercase tracking-widest">Nomor Antrean Anda</h2>
            <div className="text-5xl font-mono font-bold tracking-tighter">
              {data.queueNumber}
            </div>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-xs font-medium backdrop-blur-md mt-2">
              <span className="w-2 h-2 rounded-full bg-yellow-400 mr-2 animate-pulse" />
              {data.status_display_text}
            </div>
          </motion.div>
        </div>

        {/* Ticket Divider with Cutouts */}
        <div className="relative bg-background h-4 w-full flex items-center justify-between">
          <div className="h-6 w-6 rounded-full bg-muted absolute -left-3 top-1/2 -translate-y-1/2" />
          <div className="w-full border-b-2 border-dashed border-muted-foreground/20 mx-4" />
          <div className="h-6 w-6 rounded-full bg-muted absolute -right-3 top-1/2 -translate-y-1/2" />
        </div>

        {/* Ticket Body */}
        <div className="bg-background p-6 rounded-b-3xl relative">
          <motion.div 
            variants={contentVariants}
            className="space-y-6"
          >
            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
              <InfoItem 
                icon={<User className="w-3.5 h-3.5" />} 
                label="Driver" 
                value={data.driverName} 
              />
              <InfoItem 
                icon={<Clock className="w-3.5 h-3.5" />} 
                label="Waktu" 
                value={data.submitTime} 
              />
              <InfoItem 
                icon={<Building2 className="w-3.5 h-3.5" />} 
                label="Perusahaan" 
                value={data.companyName} 
              />
              <InfoItem 
                icon={<Clock className="w-3.5 h-3.5" />} 
                label="Waktu Antrean" 
                value={`${data.estimatedWaitMinutes} Menit`} 
              />
            </div>

            {/* QR Code Section */}
            <div className="pt-6 border-t border-dashed border-muted-foreground/20 flex flex-col items-center gap-2">
              <div className="bg-white p-2 rounded-xl shadow-sm border">
                {queueUrl && (
                   <QRCode
                    size={256}
                    style={{ height: "auto", maxWidth: "100%", width: "120px" }}
                    value={queueUrl}
                    viewBox={`0 0 256 256`}
                    level="H"
                  />
                )}
              </div>
              <p className="text-[10px] text-muted-foreground font-mono tracking-wider uppercase">
                Scan untuk cek status
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button 
                onClick={onCheckStatus}
                variant="outline"
                size="lg"
                className="flex-1"
              >
                <Search className="mr-2 w-4 h-4" />
                Status
              </Button>
              <Button 
                onClick={onGoHome} 
                className="flex-1"
                size="lg"
              >
                <Home className="mr-2 w-4 h-4" />
                Beranda
              </Button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

function InfoItem({ 
  icon, 
  label, 
  value, 
  className 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground uppercase tracking-wide">
        {icon}
        <span>{label}</span>
      </div>
      <p className="font-semibold text-sm break-words leading-tight">{value}</p>
    </div>
  );
}
