import { Badge } from "@/components/ui/badge";
import {
  BookOpen, Calculator, FlaskConical, Landmark,
  BookMarked, Code, Languages, Lightbulb
} from 'lucide-react';

const subjectConfig = {
  general: { label: 'General', icon: BookOpen },
  math: { label: 'Math', icon: Calculator },
  science: { label: 'Science', icon: FlaskConical },
  history: { label: 'History', icon: Landmark },
  literature: { label: 'Literature', icon: BookMarked },
  programming: { label: 'Programming', icon: Code },
  languages: { label: 'Languages', icon: Languages },
  philosophy: { label: 'Philosophy', icon: Lightbulb },
};

export default function SubjectBadge({ subject, size = "sm" }) {
  const config = subjectConfig[subject] || subjectConfig.general;
  const Icon = config.icon;

  return (
    <Badge variant="secondary" className="gap-1 font-normal">
      <Icon className={size === "sm" ? "h-3 w-3" : "h-4 w-4"} />
      {config.label}
    </Badge>
  );
}

export { subjectConfig };