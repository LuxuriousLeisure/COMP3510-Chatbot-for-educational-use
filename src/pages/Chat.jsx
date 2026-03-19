import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ScrollArea } from "@/components/ui/scroll-area";
import MessageBubble from '@/components/chat/MessageBubble';
import ChatInput from '@/components/chat/ChatInput';
import TypingIndicator from '@/components/chat/TypingIndicator';
import WelcomeScreen from '@/components/chat/WelcomeScreen';
import { CATEGORIES } from '@/components/chat/CategoryTabs';

export default function Chat() {
  const [isLoading, setIsLoading] = useState(false);
  const [localMessages, setLocalMessages] = useState([]);
  const [activeCategory, setActiveCategory] = useState('programming');
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
      if (conversation.subject) setActiveCategory(conversation.subject);
    } else if (!conversationId) {
      setLocalMessages([]);
    }
  }, [conversation, conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [localMessages, isLoading]);

  const getSystemPrompt = () => {
    const cat = CATEGORIES.find(c => c.key === activeCategory);
    return cat ? cat.systemPrompt : CATEGORIES[0].systemPrompt;
  };

  const handleCategorySelect = (key) => {
    setActiveCategory(key);
  };

  const sendMessage = async (content) => {
    const userMsg = { role: 'user', content, timestamp: new Date().toISOString() };
    const updatedMessages = [...localMessages, userMsg];
    setLocalMessages(updatedMessages);
    setIsLoading(true);

    // Build conversation context (last 10 messages for context)
    const recentMessages = updatedMessages.slice(-10);
    const contextStr = recentMessages
      .map(m => `${m.role === 'user' ? 'Student' : 'Tutor'}: ${m.content}`)
      .join('\n\n');

    const response = await base44.integrations.Core.InvokeLLM({
      prompt: `${getSystemPrompt()}\n\nConversation so far:\n${contextStr}\n\nPlease respond to the student's latest message. Be clear, educational, and engaging. Use markdown formatting for better readability.`,
    });

    const assistantMsg = { role: 'assistant', content: response, timestamp: new Date().toISOString() };
    const allMessages = [...updatedMessages, assistantMsg];
    setLocalMessages(allMessages);
    setIsLoading(false);

    // Save to database
    if (conversationId) {
      await base44.entities.Conversation.update(conversationId, { messages: allMessages });
    } else {
      // Create new conversation with auto-generated title
      const titleResponse = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate a short title (max 5 words) for a conversation that starts with: "${content}". Return only the title, nothing else.`,
      });
      const newConv = await base44.entities.Conversation.create({
        title: titleResponse.trim().replace(/^["']|["']$/g, ''),
        subject: activeCategory,
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