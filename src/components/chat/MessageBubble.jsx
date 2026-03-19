import ReactMarkdown from 'react-markdown';
import { cn } from "@/lib/utils";
import { User, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn("flex gap-3 max-w-3xl", isUser ? "ml-auto flex-row-reverse" : "")}
    >
      <div className={cn(
        "h-8 w-8 rounded-full flex items-center justify-center shrink-0 mt-1",
        isUser ? "bg-primary/10" : "bg-accent"
      )}>
        {isUser ? (
          <User className="h-4 w-4 text-primary" />
        ) : (
          <GraduationCap className="h-4 w-4 text-accent-foreground" />
        )}
      </div>

      <div className={cn(
        "rounded-2xl px-4 py-3 max-w-[80%]",
        isUser
          ? "bg-primary text-primary-foreground"
          : "bg-card border border-border shadow-sm"
      )}>
        {isUser ? (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        ) : (
          <ReactMarkdown
            className={cn(
              "text-sm prose prose-sm max-w-none",
              "[&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
            )}
            components={{
              p: ({ children }) => <p className="my-1.5 leading-relaxed text-foreground">{children}</p>,
              ul: ({ children }) => <ul className="my-1.5 ml-4 list-disc text-foreground">{children}</ul>,
              ol: ({ children }) => <ol className="my-1.5 ml-4 list-decimal text-foreground">{children}</ol>,
              li: ({ children }) => <li className="my-0.5 text-foreground">{children}</li>,
              h1: ({ children }) => <h1 className="text-lg font-semibold my-2 text-foreground">{children}</h1>,
              h2: ({ children }) => <h2 className="text-base font-semibold my-2 text-foreground">{children}</h2>,
              h3: ({ children }) => <h3 className="text-sm font-semibold my-1.5 text-foreground">{children}</h3>,
              strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
              code: ({ inline, children }) =>
                inline ? (
                  <code className="px-1.5 py-0.5 rounded bg-muted text-accent-foreground text-xs font-mono">{children}</code>
                ) : (
                  <pre className="bg-muted rounded-lg p-3 overflow-x-auto my-2">
                    <code className="text-xs font-mono text-foreground">{children}</code>
                  </pre>
                ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-2 border-primary/30 pl-3 my-2 text-muted-foreground italic">
                  {children}
                </blockquote>
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
        )}
      </div>
    </motion.div>
  );
}