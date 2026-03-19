import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';

export default function TypingIndicator() {
  return (
    <div className="flex gap-3 max-w-3xl">
      <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center shrink-0 mt-1">
        <GraduationCap className="h-4 w-4 text-accent-foreground" />
      </div>
      <div className="bg-card border border-border rounded-2xl px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-muted-foreground/40"
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}