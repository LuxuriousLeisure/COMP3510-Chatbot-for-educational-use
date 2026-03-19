import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, MessageSquare, Trash2, GraduationCap, PanelLeftClose, PanelLeft } from 'lucide-react';
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from 'framer-motion';
import SubjectBadge from '@/components/chat/SubjectBadge';
import { format } from 'date-fns';

export default function Sidebar({ conversations, activeId, onNewChat, onDelete, collapsed, onToggle }) {
  const navigate = useNavigate();

  const groupedConversations = () => {
    const today = new Date();
    const groups = { today: [], yesterday: [], older: [] };

    (conversations || []).forEach(conv => {
      const created = new Date(conv.created_date);
      const diffDays = Math.floor((today - created) / (1000 * 60 * 60 * 24));
      if (diffDays === 0) groups.today.push(conv);
      else if (diffDays === 1) groups.yesterday.push(conv);
      else groups.older.push(conv);
    });

    return groups;
  };

  const groups = groupedConversations();

  const renderGroup = (label, items) => {
    if (!items.length) return null;
    return (
      <div className="mb-4">
        {!collapsed && (
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider px-3 mb-1.5">
            {label}
          </p>
        )}
        <div className="space-y-0.5">
          {items.map(conv => (
            <div
              key={conv.id}
              className={cn(
                "group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors",
                conv.id === activeId
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-muted text-foreground"
              )}
              onClick={() => navigate(`/Chat?id=${conv.id}`)}
            >
              <MessageSquare className="h-4 w-4 shrink-0 text-muted-foreground" />
              {!collapsed && (
                <>
                  <span className="text-sm truncate flex-1">{conv.title || 'New Chat'}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); onDelete(conv.id); }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 60 : 280 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="h-screen border-r border-border bg-sidebar flex flex-col shrink-0"
    >
      {/* Header */}
      <div className={cn("p-3 flex items-center border-b border-border", collapsed ? "justify-center" : "justify-between")}>
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <GraduationCap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-sm">EduChat</span>
          </div>
        )}
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onToggle}>
          {collapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        </Button>
      </div>

      {/* New chat button */}
      <div className="p-3">
        <Button
          onClick={onNewChat}
          variant="outline"
          className={cn("w-full gap-2", collapsed && "px-0")}
          size="sm"
        >
          <Plus className="h-4 w-4" />
          {!collapsed && "New Chat"}
        </Button>
      </div>

      {/* Conversation list */}
      <ScrollArea className="flex-1 px-1.5">
        {renderGroup("Today", groups.today)}
        {renderGroup("Yesterday", groups.yesterday)}
        {renderGroup("Previous", groups.older)}
      </ScrollArea>
    </motion.aside>
  );
}