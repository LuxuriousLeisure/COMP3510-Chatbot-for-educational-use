import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ScrollArea } from "@/components/ui/scroll-area";
import MessageBubble from '@/components/chat/MessageBubble';
import ChatInput from '@/components/chat/ChatInput';
import TypingIndicator from '@/components/chat/TypingIndicator';
import WelcomeScreen from '@/components/chat/WelcomeScreen';
import { CATEGORIES } from '@/components/chat/CategoryTabs';

// Keys of the 4 visible (non-general) categories
const VISIBLE_CATEGORY_KEYS = ['programming', 'language', 'math', 'science'];

export default function Chat() {
  const [isLoading, setIsLoading] = useState(false);
  const [localMessages, setLocalMessages] = useState([]);
  // null means no tag pre-selected (auto-detect mode)
  const [activeCategory, setActiveCategory] = useState(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const urlParams = new URLSearchParams(window.location.search);
  const conversationId = urlParams.get('id');

  const { data: conversation } = useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: () => base44.entities.Conversation.filter({ id: conversationId }),
    enabled: !!conversationId,
    select: (data) => data?.[0],
  });

  useEffect(() => {
    if (conversation) {
      setLocalMessages(conversation.messages || []);
      setActiveCategory(conversation.subject || null);
    } else if (!conversationId) {
      setLocalMessages([]);
      setActiveCategory(null);
    }
  }, [conversation, conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [localMessages, isLoading]);

  const getSystemPrompt = (key) => {
    const cat = CATEGORIES.find(c => c.key === key);
    return cat ? cat.systemPrompt : CATEGORIES.find(c => c.key === 'general').systemPrompt;
  };

  const handleCategorySelect = (key) => {
    setActiveCategory(prev => prev === key ? null : key);
  };

  const sendMessage = async (content) => {
    const userMsg = { role: 'user', content, timestamp: new Date().toISOString() };
    const updatedMessages = [...localMessages, userMsg];
    setLocalMessages(updatedMessages);
    setIsLoading(true);

    // Step 1: Classify the question into one of the 5 categories
    const classifyResp = await base44.integrations.Core.InvokeLLM({
      prompt: `Classify the following student question into exactly one of these categories: programming, language, math, science, general.
- programming: coding, software, algorithms, data structures, computer science concepts
- language: learning a language, grammar, vocabulary, translation, writing, linguistics
- math: mathematics, calculations, geometry, algebra, statistics, calculus
- science: physics, chemistry, biology, astronomy, earth science, scientific concepts
- general: anything that doesn't clearly fit the above four

Question: "${content}"

Reply with only the single category key, nothing else.`,
    });

    const detectedKey = classifyResp.trim().toLowerCase().replace(/[^a-z]/g, '');
    const validKeys = ['programming', 'language', 'math', 'science', 'general'];
    const detectedCategory = validKeys.includes(detectedKey) ? detectedKey : 'general';

    let assistantMsg;
    let resolvedCategory;

    if (!activeCategory) {
      // Auto mode: use detected category
      resolvedCategory = detectedCategory;
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `${getSystemPrompt(resolvedCategory)}\n\nConversation so far:\n${updatedMessages.map(m => `${m.role === 'user' ? 'Student' : 'Tutor'}: ${m.content}`).join('\n\n')}\n\nPlease respond to the student's latest message. Be clear, educational, and engaging. Use markdown formatting for better readability.`,
      });
      assistantMsg = { role: 'assistant', content: response, timestamp: new Date().toISOString() };
    } else {
      // Tag pre-selected — check if it matches
      const isMatch = detectedCategory === activeCategory || detectedCategory === 'general';
      if (isMatch) {
        resolvedCategory = activeCategory;
        const response = await base44.integrations.Core.InvokeLLM({
          prompt: `${getSystemPrompt(resolvedCategory)}\n\nConversation so far:\n${updatedMessages.map(m => `${m.role === 'user' ? 'Student' : 'Tutor'}: ${m.content}`).join('\n\n')}\n\nPlease respond to the student's latest message. Be clear, educational, and engaging. Use markdown formatting for better readability.`,
        });
        assistantMsg = { role: 'assistant', content: response, timestamp: new Date().toISOString() };
      } else {
        // Mismatch — redirect the user
        resolvedCategory = activeCategory;
        const selectedCat = CATEGORIES.find(c => c.key === activeCategory);
        const detectedCat = CATEGORIES.find(c => c.key === detectedCategory);
        const detectedLabel = detectedCat ? detectedCat.label : 'General Q&A';
        const redirectMsg = `I'm not really great at **${selectedCat?.label}** questions for this topic~ 😅\n\nThis looks more like a **${detectedLabel}** question! Please switch to the **${detectedLabel}** tag and ask again~ 🎯`;
        assistantMsg = { role: 'assistant', content: redirectMsg, timestamp: new Date().toISOString() };
      }
    }

    const allMessages = [...updatedMessages, assistantMsg];
    setLocalMessages(allMessages);
    setIsLoading(false);

    // Save to database
    if (conversationId) {
      await base44.entities.Conversation.update(conversationId, { messages: allMessages, subject: resolvedCategory });
    } else {
      const titleResponse = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate a short title (max 5 words) for a conversation that starts with: "${content}". Return only the title, nothing else.`,
      });
      const newConv = await base44.entities.Conversation.create({
        title: titleResponse.trim().replace(/^["']|["']$/g, ''),
        subject: resolvedCategory,
        messages: allMessages,
      });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      navigate(`/Chat?id=${newConv.id}`, { replace: true });
    }

    queryClient.invalidateQueries({ queryKey: ['conversation', conversationId] });
  };

  const hasMessages = localMessages.length > 0;

  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      {!hasMessages ? (
        <WelcomeScreen
          onSuggestionClick={sendMessage}
          onCategorySelect={handleCategorySelect}
          activeCategory={activeCategory}
        />
      ) : (
        <ScrollArea className="flex-1 px-4 md:px-6">
          <div className="max-w-3xl mx-auto py-6 space-y-6">
            {localMessages.map((msg, i) => (
              <MessageBubble key={i} message={msg} />
            ))}
            {isLoading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      )}

      {/* Input area */}
      <div className="p-4 md:px-6 max-w-3xl mx-auto w-full">
        <ChatInput onSend={sendMessage} isLoading={isLoading} />
        <p className="text-[11px] text-muted-foreground text-center mt-2">
          AI responses are for learning purposes. Always verify important information.
        </p>
      </div>
    </div>
  );
}