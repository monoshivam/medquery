import React, { useState, useRef, useEffect } from 'react'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button';
import { CornerDownLeft, Loader2, TextSearch } from 'lucide-react';
import { Badge } from './ui/badge';
import Messages from './messages';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import Markdown from './markdown';

type Props = {
  reportData?: string
}

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
}

const ChatComponent = ({ reportData }: Props) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [retrievals, setRetrievals] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('api/medichatgemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages,
          data: { reportData: reportData ?? '' },
        }),
      });

      const json = await res.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: json.response ?? 'No response received.',
      };

      setMessages(prev => [...prev, assistantMessage]);
      setRetrievals(json.retrievals ?? null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-muted/50 relative rounded-xl p-4 gap-4">
      <Badge
        variant={'outline'}
        className={`absolute right-3 top-1.5 ${reportData && "bg-[#00B612]"}`}
      >
        {reportData ? "✓ Report Added" : "No Report Added"}
      </Badge>

      {/* this is the only scrollable part */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <Messages messages={messages} isLoading={isLoading} />
        <div ref={bottomRef} />
      </div>

      {retrievals && (
        <div className="shrink-0">
          <Accordion type="single" className="text-sm" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <span className="flex flex-row items-center gap-2">
                  <TextSearch /> Relevant Info
                </span>
              </AccordionTrigger>
              <AccordionContent className="whitespace-pre-wrap">
                <Markdown text={retrievals} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}

      <form
        className="shrink-0 relative overflow-hidden rounded-lg border bg-background"
        onSubmit={handleSubmit}
      >
        <Textarea
          value={input}
          onChange={handleInputChange}
          placeholder="Type your query here..."
          className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
        />
        <div className="flex items-center p-3 pt-0">
          <Button disabled={isLoading} type="submit" size="sm" className="ml-auto">
            {isLoading ? "Analysing..." : "3. Ask"}
            {isLoading
              ? <Loader2 className="size-3.5 animate-spin" />
              : <CornerDownLeft className="size-3.5" />
            }
          </Button>
        </div>
      </form>
    </div>
  )
}

export default ChatComponent
