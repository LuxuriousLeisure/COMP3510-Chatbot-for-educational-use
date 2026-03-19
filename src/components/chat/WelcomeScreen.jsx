import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';
import { CATEGORIES } from './CategoryTabs';

const suggestions = [
  "Explain quantum entanglement in simple terms",
  "Help me understand the French Revolution",
  "What are the fundamentals of recursion?",
  "Analyze the themes in Shakespeare's Hamlet",
];

export default function WelcomeScreen({ onSuggestionClick, onCategorySelect, activeCategory }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-lg"
      >
        <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <GraduationCap className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl font-semibold text-foreground mb-2">
          What would you like to learn?
        </h1>
        <p className="text-muted-foreground text-sm mb-8">
          Select a topic tag to guide me, or just ask and I'll figure it out automatically!
        </p>

        {/* Category pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {CATEGORIES.map(({ key, label, icon: Icon }) => {
            const isActive = activeCategory === key;
            return (
              <motion.button
                key={key}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onCategorySelect(key)}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
                  isActive
                    ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                    : 'bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground hover:bg-accent'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </motion.button>
            );
          })}
        </div>

        {/* Suggestion cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {suggestions.map((text, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSuggestionClick(text)}
              className="text-left p-3 rounded-xl border border-border bg-card hover:bg-accent hover:border-primary/30 transition-all text-sm text-muted-foreground"
            >
              {text}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}