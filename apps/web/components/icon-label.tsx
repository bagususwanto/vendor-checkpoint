import { Label } from '@/components/ui/label';

export default function IconLabel({
  htmlFor,
  icon: Icon,
  children,
  required = false,
  className = '',
  classNameIcon,
}: {
  htmlFor: string;
  icon?: any;
  children: React.ReactNode;
  required?: boolean;
  className?: string;
  classNameIcon?: string;
}) {
  // kalau classNameIcon tidak ada, pakai default size
  const iconClasses = classNameIcon?.trim() || 'w-4 h-4 text-muted-foreground';

  return (
    <Label htmlFor={htmlFor} className={`flex items-center gap-2 ${className}`}>
      {Icon && <Icon className={iconClasses} />}
      {children}
      {required && <span className="text-destructive text-xl">*</span>}
    </Label>
  );
}
