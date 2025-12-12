import { FieldLabel } from './ui/field';

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
  const iconClasses = classNameIcon?.trim() || 'w-4 h-4 text-muted-foreground';

  return (
    <FieldLabel
      htmlFor={htmlFor}
      className={`flex items-center gap-2 ${className}`}
    >
      {Icon && <Icon className={iconClasses} />}
      {children}
      {required && <span className="text-destructive text-xl">*</span>}
    </FieldLabel>
  );
}
