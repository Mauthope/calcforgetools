import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ResultPanelProps extends HTMLMotionProps<"div"> {
  title: string;
  value: string | number;
  highlight?: boolean;
}

export function ResultPanel({ title, value, highlight = false, className, ...props }: ResultPanelProps) {
  // Convert string values to string so we can count length
  const valStr = String(value);
  const isLong = valStr.length > 12;

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={cn(
        "relative overflow-hidden p-5 md:p-6 rounded-2xl flex flex-col justify-center transition-shadow duration-300",
        highlight
          ? 'bg-gradient-to-br from-[#007AFF] to-[#0056b3] text-white border border-white/20 shadow-lg shadow-[#007AFF]/20 hover:shadow-[#007AFF]/40'
          : 'bg-white border border-[var(--color-border)] shadow-sm hover:shadow-md',
        className
      )}
      {...props}
    >
      {highlight && <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />}

      <h3 className={cn(
        "text-xs md:text-sm font-medium tracking-wide leading-tight",
        highlight ? "text-white/80" : "text-[var(--color-text-secondary)]"
      )}>
        {title}
      </h3>

      <div className={cn(
        "font-bold tracking-tight mt-1 break-words line-clamp-2",
        isLong ? "text-2xl md:text-3xl" : "text-3xl md:text-4xl",
        highlight ? "text-white drop-shadow-sm" : "text-[var(--color-text-primary)]"
      )}>
        {value}
      </div>
    </motion.div>
  );
}
