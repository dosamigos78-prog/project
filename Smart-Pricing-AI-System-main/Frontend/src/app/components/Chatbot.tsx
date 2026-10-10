import { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "أهلاً بيك! أنا مساعدك الذكي، مستشار التسعير الذكي الخاص بيك. أقدر أساعدك إزاي النهارده في تسعير منتجاتك أو دراسة السوق؟",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue;
    const userMessage: Message = {
      id: Date.now(),
      text: userText,
      isUser: true,
      timestamp: new Date(),
    };

    // 1. عرض رسالة المستخدم فوراً
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true); // تشغيل أنيميشن الكتابة

    try {
      // 2. محاولة سحب الـ UserID لو التاجر عامل تسجيل دخول
      const userDataStr = localStorage.getItem("user");
      let currentUserId = null;
      if (userDataStr) {
        const userData = JSON.parse(userDataStr);
        currentUserId = userData.UserID || null;
      }

      // 3. إرسال الرسالة للباك-إيند (Gemini)
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          userId: currentUserId,
        }),
      });

      const data = await response.json();

      // 4. عرض رد الذكاء الاصطناعي
      if (data.success) {
        const aiMessage: Message = {
          id: Date.now() + 1,
          text: data.reply,
          isUser: false,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        const errorMessage: Message = {
          id: Date.now() + 1,
          text: "❌ عذراً، حدث خطأ: " + data.error,
          isUser: false,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: "❌ غير قادر على الاتصال بسيرفر الذكاء الاصطناعي. تأكد من تشغيل app.py.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false); // إيقاف أنيميشن الكتابة
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col h-screen" style={{ backgroundColor: "var(--bg-light)" }}>
      {/* Container الرسائل */}
      <div className="flex-1 overflow-y-auto py-6 px-4">
        <div className="max-w-4xl mx-auto flex flex-col gap-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`max-w-[80%] px-6 py-4 rounded-2xl animate-slide-in ${
                message.isUser
                  ? "ml-auto text-white"
                  : "mr-auto shadow-lg border border-gray-100"
              }`}
              style={{
                backgroundColor: message.isUser ? "var(--coral)" : "white",
                color: message.isUser ? "white" : "var(--navy)",
              }}
            >
              <div 
                className="whitespace-pre-line leading-relaxed text-sm md:text-base font-medium"
                dir="auto"
              >
                {message.text}
              </div>
              <div className={`text-[10px] mt-2 opacity-70 ${message.isUser ? "text-right" : "text-left"}`}>
                {formatTime(message.timestamp)}
              </div>
            </div>
          ))}

          {/* أنيميشن "جيمي بيكتب..." */}
          {isTyping && (
            <div
              className="max-w-[80%] px-6 py-4 rounded-2xl mr-auto shadow-lg bg-white border border-gray-100"
              style={{ color: "var(--navy)" }}
            >
              <div className="flex gap-2">
                <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: "var(--coral)", animationDelay: "-0.32s" }} />
                <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: "var(--coral)", animationDelay: "-0.16s" }} />
                <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: "var(--coral)" }} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* الفورم ومربع الإدخال */}
      <div className="bg-white rounded-2xl shadow-2xl p-4 max-w-4xl w-full mx-auto mb-4 border border-gray-100">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="اسألني عن التسعير، السوق، أو استراتيجيات البيع..."
            className="flex-1 px-4 py-3 bg-gray-50 rounded-xl text-sm md:text-base border-none focus:outline-2 focus:outline-[var(--coral)] transition-all font-medium"
            style={{ color: "var(--navy)" }}
            dir="auto"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className="px-6 py-3 rounded-xl text-white flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform active:scale-95"
            style={{ backgroundColor: "var(--coral)" }}
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>

      <style>{`
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}