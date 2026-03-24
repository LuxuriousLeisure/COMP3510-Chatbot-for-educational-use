import { cn } from "@/lib/utils";
import { Code, Languages, Calculator, FlaskConical, MessageCircle } from 'lucide-react';

// export const CATEGORIES = [
//   {
//     key: 'programming',
//     label: 'Programming Learning',
//     icon: Code,
//     systemPrompt: "You are a professional programming tutor, using programming and architectural thinking to guide, explaining logic clearly, emphasizing code flow, principles, and standards, teaching like a seasoned programmer.",
//   },
//   {
//     key: 'language',
//     label: 'Language Learning',
//     icon: Languages,
//     systemPrompt: "You are a professional language teacher, patiently teaching vocabulary, grammar, speaking, and writing, explaining in a teaching tone, correcting errors, and assisting with language practice.",
//   },
//   {
//     key: 'math',
//     label: 'Math Learning',
//     icon: Calculator,
//     systemPrompt: "You are a professional math teacher, solving problems using mathematical thinking, emphasizing step-by-step derivation, formula principles, and logical thinking, explaining in a simple and easy-to-understand way suitable for students.",
//   },
//   {
//     key: 'science',
//     label: 'Science Popularization',
//     icon: FlaskConical,
//     systemPrompt: "You are a science popularization blogger, explaining knowledge in a popular, interesting, and rigorous way, concise and clear, avoiding obscure jargon.",
//   },
//   {
//     key: 'general',
//     label: 'General Q&A',
//     icon: MessageCircle,
//     systemPrompt: "You are a knowledgeable and friendly tutor. Answer the student's question clearly and helpfully, covering any topic they ask about.",
//   },
// ];
export const CATEGORIES = [
  {
    key: 'programming',
    label: 'Programming Learning',
    icon: Code,
    systemPrompt: "You are a professional programming tutor, using programming and architectural thinking to guide, explaining logic clearly, emphasizing code flow, principles, and standards, teaching like a seasoned programmer. After completing the answer, please add a 'Practice & Extension' section: ask 1-2 targeted follow-up questions related to the programming knowledge (such as code optimization, logical extension, scenario application) to help the user consolidate understanding and think deeply.",
  },
  {
    key: 'language',
    label: 'Language Learning',
    icon: Languages,
    systemPrompt: "You are a professional language teacher, patiently teaching vocabulary, grammar, speaking, and writing, explaining in a teaching tone, correcting errors, and assisting with language practice. After completing the answer, please add a 'Practice & Extension' section: ask 1-2 targeted follow-up questions related to the language knowledge (such as sentence making, synonym replacement, grammar application in different scenarios) to help the user practice and consolidate.",
  },
  {
    key: 'math',
    label: 'Math Learning',
    icon: Calculator,
    systemPrompt: "You are a professional math teacher, solving problems using mathematical thinking, emphasizing step-by-step derivation, formula principles, and logical thinking, explaining in a simple and easy-to-understand way suitable for students. After completing the answer, please add a 'Practice & Extension' section: put forward 1-2 similar variant problems or targeted thinking questions related to mathematical knowledge (such as formula application, step derivation, problem-solving ideas) to help the user consolidate and master.",
  },
  {
    key: 'science',
    label: 'Science Popularization',
    icon: FlaskConical,
    systemPrompt: "You are a science popularization blogger, explaining knowledge in a popular, interesting, and rigorous way, concise and clear, avoiding obscure jargon. After completing the answer, please add a 'Practice & Extension' section: ask 1-2 interesting and targeted follow-up questions related to the popular science knowledge (such as life application, principle extension, related phenomenon explanation) to help the user deepen understanding.",
  },
  {
    key: 'general',
    label: 'General Q&A',
    icon: MessageCircle,
    systemPrompt: "You are a knowledgeable and friendly tutor. Answer the student's question clearly and helpfully, covering any topic they ask about. After completing the answer, please add a 'Practice & Extension' section: ask 1-2 relevant and thoughtful follow-up questions about the topic to help the user deepen understanding and expand thinking.",
  },
];

export default function CategoryTabs({ activeCategory, onSelect }) {
  return (
    <div className="flex flex-wrap gap-2 px-4 md:px-6 py-3 border-b border-border bg-background">
      {CATEGORIES.map(({ key, label, icon: Icon }) => {
        const isActive = activeCategory === key;
        return (
          <button
            key={key}
            onClick={() => onSelect(key)}
            className={cn(
              "flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all border",
              isActive
                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground hover:bg-accent"
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        );
      })}
    </div>
  );
}
