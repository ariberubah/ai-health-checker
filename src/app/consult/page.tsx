"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";

interface Message {
  sender: "user" | "mira";
  text: string;
}

interface StreamEvent {
  type?: string;
  data?: unknown;
}

export default function Page() {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "mira",
      text: "Hai! Aku Mira, asisten kesehatan virtual kamu. Ada yang bisa aku bantu?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    let miraIndex = -1;
    setMessages((prev) => {
      miraIndex = prev.length;
      return [
        ...prev,
        { sender: "mira", text: "Baik, aku sedang menganalisis pertanyaanmu..." },
      ];
    });

    const controller = new AbortController();
    abortRef.current = controller;
    const signal = controller.signal;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
        signal,
      });

      if (!res.ok || !res.body) throw new Error("Gagal memproses streaming.");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let miraReplyAcc = "";

      const updateMira = (text: string) => {
        setMessages((prev) => {
          const copy = [...prev];
          if (miraIndex >= 0 && miraIndex < copy.length) {
            copy[miraIndex] = { sender: "mira", text };
          } else {
            copy.push({ sender: "mira", text });
            miraIndex = copy.length - 1;
          }
          return copy;
        });
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const parts = buffer.split("\n\n");
        for (let i = 0; i < parts.length - 1; i++) {
          const chunk = parts[i].trim();
          if (!chunk) continue;

          const lines = chunk
            .split("\n")
            .map((l) => l.trim())
            .filter(Boolean);

          for (const line of lines) {
            if (!line.startsWith("data:")) continue;
            const dataStr = line.replace(/^data:\s*/, "");
            if (!dataStr) continue;

            let event: StreamEvent = {};
            try {
              event = JSON.parse(dataStr) as StreamEvent;
            } catch {
              event = { type: "partial", data: dataStr };
            }

            const type = event.type ?? "partial";

            if (type === "partial") {
              const piece =
                typeof event.data === "string"
                  ? event.data
                  : JSON.stringify(event.data);
              miraReplyAcc = piece;
              updateMira(miraReplyAcc);
            } else if (type === "final") {
              const data = event.data as { ai_analysis?: string } | undefined;
              const ai_text =
                typeof data?.ai_analysis === "string"
                  ? data.ai_analysis
                  : JSON.stringify(data ?? "");
              miraReplyAcc = ai_text;
              updateMira(miraReplyAcc);
            } else if (type === "error") {
              updateMira("⚠️ Terjadi kesalahan saat memproses permintaan.");
            }
          }
        }
        buffer = parts[parts.length - 1];
      }
    } catch (err) {
      const errorObj = err as Error;
      if (errorObj.name === "AbortError") {
        setMessages((prev) => [
          ...prev,
          { sender: "mira", text: "⚠️ Permintaan dibatalkan." },
        ]);
      } else {
        console.error("Streaming error:", errorObj);
        setMessages((prev) => [
          ...prev,
          { sender: "mira", text: "⚠️ Terjadi kesalahan jaringan. Coba lagi ya." },
        ]);
      }
    } finally {
      setIsLoading(false);
      abortRef.current = null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen text-gray-800 bg-white">
      {/* Header */}
      <header className="pt-20 bg-white border-b border-green-100">
        <div className="flex items-center max-w-6xl gap-3 px-6 py-4 mx-auto">
          <Image
            src="/asset/avatar-mira.png"
            alt="Mira Avatar"
            width={40}
            height={40}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="font-semibold text-gray-800">Mira AI</p>
            <p className="text-xs text-gray-500">Asisten Kesehatan Virtual</p>
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <main
        ref={chatContainerRef}
        className="flex-1 py-6 overflow-y-auto bg-green-50"
      >
        <div className="max-w-6xl px-6 mx-auto space-y-6">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-5 py-3 rounded-2xl max-w-xs md:max-w-md ${
                  msg.sender === "user"
                    ? "bg-green-600 text-white rounded-br-none"
                    : "bg-white border border-green-100 rounded-bl-none shadow-sm"
                }`}
              >
                {msg.sender === "mira" ? (
                  <div className="prose prose-sm max-w-none [&>p]:mt-4 [&>p]:mb-4 leading-relaxed">
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => (
                          <p className="mt-3 mb-3 leading-relaxed">{children}</p>
                        ),
                        li: ({ children }) => (
                          <li className="mb-2 ml-5 list-disc">{children}</li>
                        ),
                        hr: () => <hr className="my-6 border-green-200" />,
                        h3: ({ children }) => (
                          <h3 className="mt-4 mb-2 font-semibold text-green-700">
                            {children}
                          </h3>
                        ),
                      }}
                    >
                      {msg.text}
                    </ReactMarkdown>
                  </div>
                ) : (
                  msg.text
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Input */}
      <footer className="fixed bottom-0 w-full px-6 py-4 bg-white border-t border-green-100">
        <div className="flex items-center max-w-6xl gap-2 mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tulis pesan."
            className="flex-1 px-4 py-2 text-sm border border-green-300 rounded-full focus:outline-none focus:ring-1 focus:ring-green-400"
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={isLoading}
            aria-label="Pesan untuk Mira"
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className={`${
              isLoading
                ? "bg-green-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            } text-white px-4 py-2 rounded-full text-sm transition`}
            aria-disabled={isLoading}
          >
            {isLoading ? "Memproses..." : "Kirim"}
          </button>
        </div>
      </footer>
    </div>
  );
}
