import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getGeminiModel } from "@/lib/gemini-tools";
import { Send, Bot, User, Loader2, X, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTransactions } from "@/features/transactions/hooks/useTransactions";
import { transactionToolFunctions } from "@/lib/transaction-tool-functions";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm your AI assistant. I can help you manage transactions, view your financial overview, and answer questions about your finances. What would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { refetchTransactions } = useTransactions();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const model = getGeminiModel();

      // Build history from previous messages, ensuring it starts with a user message
      // Find the first user message index and only include messages from that point
      const firstUserIndex = messages.findIndex((msg) => msg.role === "user");

      // If no user messages exist yet, use empty history (this is the first user message)
      // Otherwise, skip any assistant messages before the first user message
      const previousMessages =
        firstUserIndex === -1 ? [] : messages.slice(firstUserIndex);

      const conversationHistory = previousMessages.map((msg) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      }));

      const chat = model.startChat({
        history: conversationHistory,
      });

      const result = await chat.sendMessage(userMessage.content);
      const response = result.response;

      // Handle tool calls if any
      const functionCalls = response.functionCalls();
      if (functionCalls && functionCalls.length > 0) {
        const functionResponseParts = [];

        for (const functionCall of functionCalls) {
          const functionName = functionCall.name;
          const args = functionCall.args as Record<string, unknown>;

          if (transactionToolFunctions[functionName]) {
            const result = await transactionToolFunctions[functionName](args);
            functionResponseParts.push({
              functionResponse: {
                name: functionName,
                response: result,
              },
            });
          }
        }

        // Send function responses back to the model
        const followUpResult = await chat.sendMessage(functionResponseParts);
        const followUpResponse = followUpResult.response;
        const assistantMessage: Message = {
          role: "assistant",
          content:
            followUpResponse.text() || "Transaction completed successfully.",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);

        // Refetch transactions if any transaction was modified
        if (
          functionCalls.some(
            (fc) =>
              fc.name === "createTransaction" ||
              fc.name === "updateTransaction" ||
              fc.name === "deleteTransaction",
          )
        ) {
          refetchTransactions();
        }
      } else {
        // No tool calls, just display the response
        const assistantMessage: Message = {
          role: "assistant",
          content: response.text(),
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }
    } catch (error) {
      const errorMessage: Message = {
        role: "assistant",
        content: `Sorry, I encountered an error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="icon"
        className={cn(
          "fixed bottom-4 right-4 sm:bottom-6 sm:right-6 h-14 w-14 rounded-full shadow-lg z-50 transition-all hover:scale-110 bg-violet-600 text-white hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600 border border-violet-700 dark:border-violet-400",
          isOpen && "scale-0 opacity-0 pointer-events-none",
        )}
        aria-label="Open AI Chat"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      {/* Chat Box */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-[90vw] sm:w-[400px] h-[600px] max-h-[85vh] z-50 flex flex-col animate-in slide-in-from-bottom-4 fade-in-0 duration-300">
          <Card className="h-full flex flex-col shadow-2xl bg-card text-card-foreground border-border">
            <CardHeader className="pb-3 shrink-0 border-b border-border">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-card-foreground">
                  <Bot className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                  AI Assistant
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 hover:bg-accent hover:text-accent-foreground"
                  aria-label="Close chat"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden p-4">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex gap-3",
                      message.role === "user" ? "justify-end" : "justify-start",
                    )}
                  >
                    {message.role === "assistant" && (
                      <div className="shrink-0">
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center border border-border">
                          <Bot className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    )}
                    <div
                      className={cn(
                        "rounded-lg px-4 py-2 max-w-[80%]",
                        message.role === "user"
                          ? "bg-violet-600 text-white dark:bg-violet-500 dark:text-white"
                          : "bg-muted text-muted-foreground border border-border",
                      )}
                    >
                      <p className="text-sm whitespace-pre-wrap">
                        {message.content}
                      </p>
                    </div>
                    {message.role === "user" && (
                      <div className="shrink-0">
                        <div className="h-8 w-8 rounded-full bg-violet-100 dark:bg-violet-950/50 flex items-center justify-center border border-violet-300 dark:border-violet-700">
                          <User className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <div className="shrink-0">
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center border border-border">
                        <Bot className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="rounded-lg px-4 py-2 bg-muted text-muted-foreground border border-border">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="flex gap-2 shrink-0">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about your transactions..."
                  disabled={isLoading}
                  className="flex-1 bg-background border-input text-foreground placeholder:text-muted-foreground"
                />
                <Button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  size="icon"
                  className="bg-violet-600 text-white hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600 disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
