import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "bot";
  text: string;
  timestamp: Date;
}

const FAQ_RESPONSES: Record<string, string> = {
  "how to submit": "To submit a petition:\n1. Log in as a citizen\n2. Click 'Submit Petition' in the nav\n3. Fill in the title, description, category, and location\n4. Our AI will automatically classify and prioritise your complaint\n5. You'll receive a Petition ID for tracking.",
  "track": "You can track your petition status by going to 'My Petitions'. Each complaint shows its status: Submitted → Under Review → Assigned → In Progress → Resolved → Closed.",
  "status": "Petition statuses:\n• Submitted – Received and AI-analysed\n• Under Review – Being reviewed\n• Assigned – Given to an officer\n• In Progress – Officer working on it\n• Resolved – Issue fixed\n• Closed – Completed & confirmed",
  "ai": "Our AI engine automatically:\n• Classifies your complaint into the right category\n• Predicts the responsible department\n• Detects duplicate complaints\n• Assigns priority (Critical/High/Medium/Low)\n• Analyses sentiment to detect urgency",
  "department": "Departments include:\n• Roads & Infrastructure (potholes, construction)\n• Water Works (water supply, sanitation)\n• Electricity Board (power issues, street lights)\n• Waste Management (garbage, cleaning)\n• Public Safety (noise, safety issues)\n• Health & Education Departments",
  "register": "To register:\n1. Click 'Register' on the homepage\n2. Fill in your name, email, phone and address\n3. Create a password\n4. You're ready to submit petitions!",
  "priority": "AI assigns priority based on:\n• Critical: Accidents, danger, emergencies\n• High: No water/electricity, safety risks\n• Medium: Regular complaints\n• Low: Minor inconveniences",
  "duplicate": "If our AI detects your complaint is similar to existing ones, it will flag it as a possible duplicate and show you the related complaints. Your petition will still be processed.",
  "feedback": "After your complaint is resolved, you can:\n1. Go to 'My Petitions'\n2. Open the resolved petition\n3. Rate the resolution and leave a comment",
  "hello": "Hello! I'm PetitionAI Assistant. I can help you with:\n• Submitting complaints\n• Tracking petition status\n• Understanding AI features\n• Department information\n• Registration guidance\n\nWhat would you like to know?",
  "help": "I can assist you with:\n• How to submit a petition\n• Tracking your complaint status\n• Understanding our AI classification\n• Department information\n• Registration process\n• Priority levels\n\nType your question or choose a topic above.",
};

function getBotResponse(input: string): string {
  const lower = input.toLowerCase();
  for (const [key, response] of Object.entries(FAQ_RESPONSES)) {
    if (lower.includes(key)) return response;
  }
  if (lower.includes("contact") || lower.includes("phone") || lower.includes("email")) {
    return "For direct contact, please reach the Municipal Corporation helpline at 1800-XXX-XXXX (toll-free) or email: grievance@municipality.gov.in. Office hours: Mon–Sat, 9 AM – 5 PM.";
  }
  if (lower.includes("time") || lower.includes("long") || lower.includes("resolve")) {
    return "Average resolution times by priority:\n• Critical: 24–48 hours\n• High: 3–5 days\n• Medium: 7–10 days\n• Low: 15–20 days\n\nTimes may vary based on department workload.";
  }
  return "I'm not sure about that specific query. You can ask me about:\n• Submitting petitions\n• Tracking status\n• AI features\n• Department information\n• Registration\n• Priority levels\n\nOr contact our helpline at 1800-XXX-XXXX.";
}

const QUICK_QUESTIONS = [
  "How to submit a petition?",
  "How to track my complaint?",
  "What does AI do?",
  "Complaint priorities",
];

export default function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [minimised, setMinimised] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "0",
      role: "bot",
      text: "Hello! I'm PetitionAI Assistant 🤖\n\nI can help you with complaint submission, tracking, and more. How can I assist you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && !minimised) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open, minimised]);

  function sendMessage(text: string) {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        text: getBotResponse(text),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMsg]);
      setTyping(false);
    }, 800 + Math.random() * 500);
  }

  return (
    <>
      {/* Floating Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-navy-800 hover:bg-navy-700 text-white rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-110 z-50"
          aria-label="Open AI Chatbot"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse-soft" />
        </button>
      )}

      {/* Chat Window */}
      {open && (
        <div className={cn(
          "fixed right-6 z-50 w-80 bg-white rounded-xl shadow-2xl border border-border flex flex-col transition-all animate-slide-in-right",
          minimised ? "bottom-6 h-14" : "bottom-6 h-[480px]"
        )}>
          {/* Header */}
          <div className="flex items-center gap-2.5 px-4 py-3 bg-navy-800 rounded-t-xl text-white flex-shrink-0">
            <div className="w-8 h-8 bg-gold-400 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-navy-900" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold leading-none">PetitionAI Assistant</p>
              <p className="text-[11px] text-green-400 mt-0.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block" /> Online 24/7
              </p>
            </div>
            <button onClick={() => setMinimised(!minimised)} className="text-white/60 hover:text-white p-1 transition-colors">
              <Minimize2 className="w-4 h-4" />
            </button>
            <button onClick={() => setOpen(false)} className="text-white/60 hover:text-white p-1 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {!minimised && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {messages.map(m => (
                  <div key={m.id} className={cn("flex gap-2", m.role === "user" ? "justify-end" : "justify-start")}>
                    {m.role === "bot" && (
                      <div className="w-6 h-6 bg-navy-700 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Bot className="w-3.5 h-3.5 text-white" />
                      </div>
                    )}
                    <div className={cn(
                      "max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed whitespace-pre-line",
                      m.role === "bot" ? "bg-muted text-foreground rounded-tl-none" : "bg-navy-700 text-white rounded-tr-none"
                    )}>
                      {m.text}
                    </div>
                    {m.role === "user" && (
                      <div className="w-6 h-6 bg-navy-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <User className="w-3.5 h-3.5 text-navy-700" />
                      </div>
                    )}
                  </div>
                ))}
                {typing && (
                  <div className="flex gap-2 items-center">
                    <div className="w-6 h-6 bg-navy-700 rounded-full flex items-center justify-center">
                      <Bot className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="bg-muted rounded-xl px-3 py-2 flex gap-1">
                      {[0, 1, 2].map(i => (
                        <div key={i} className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Quick Questions */}
              <div className="px-3 pb-2 flex flex-wrap gap-1.5">
                {QUICK_QUESTIONS.map(q => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="text-[10px] bg-navy-50 text-navy-700 border border-navy-200 hover:bg-navy-100 px-2 py-1 rounded-full transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Input */}
              <div className="border-t border-border p-3 flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && sendMessage(input)}
                  placeholder="Ask me anything..."
                  className="flex-1 text-xs border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-navy-400"
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim()}
                  className="w-8 h-8 bg-navy-700 hover:bg-navy-800 disabled:opacity-40 text-white rounded-lg flex items-center justify-center transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
