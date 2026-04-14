import { useState } from 'react'
import { askChatbot } from '../services/api'

const quickPrompts = [
  'Which FD plan is best for medium risk?',
  'Calculate FD return for 3 lakh savings.',
  'How to improve FD conversion for low-income segment?',
]

function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Hi! I am your FD AI assistant. Ask me about FD plans, returns, or risk strategy.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ])

  const sendMessage = async (seedText) => {
    const text = (seedText ?? input).trim()
    if (!text || isLoading) return

    setMessages((prev) => [
      ...prev,
      {
        role: 'user',
        text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ])
    setInput('')
    setIsLoading(true)

    try {
      const result = await askChatbot(text)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: result.reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ])
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'Chatbot unavailable right now. Please check backend/OpenRouter configuration.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="mb-3 w-[340px] rounded-2xl border border-slate-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between rounded-t-2xl bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] px-4 py-3 text-white">
            <p className="text-sm font-semibold">FD AI Assistant</p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setMessages([
                    {
                      role: 'assistant',
                      text: 'Chat reset complete. Ask your next FD advisory question.',
                      time: new Date().toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      }),
                    },
                  ])
                }
                className="rounded-md bg-white/15 px-2 py-1 text-xs"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-md bg-white/15 px-2 py-1 text-xs"
              >
                Close
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 border-b border-slate-200 p-3">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => sendMessage(prompt)}
                className="rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-700 transition hover:bg-blue-100"
              >
                {prompt}
              </button>
            ))}
          </div>

          <div className="h-80 space-y-3 overflow-y-auto p-4">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`max-w-[90%] rounded-xl px-3 py-2 text-sm ${
                  message.role === 'user'
                    ? 'ml-auto bg-[#1E3A8A] text-white'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                {message.text}
                <p
                  className={`mt-1 text-[10px] ${
                    message.role === 'user' ? 'text-blue-100' : 'text-slate-400'
                  }`}
                >
                  {message.time}
                </p>
              </div>
            ))}
            {isLoading ? (
              <div className="inline-block rounded-xl bg-slate-100 px-3 py-2 text-sm text-slate-600">
                Thinking...
              </div>
            ) : null}
          </div>

          <div className="flex gap-2 border-t border-slate-200 p-3">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') sendMessage()
              }}
              placeholder="Ask about FD plans..."
              className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
            />
            <button
              type="button"
              onClick={sendMessage}
              disabled={isLoading}
              className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              Send
            </button>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="rounded-full bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] px-5 py-3 text-sm font-semibold text-white shadow-xl"
      >
        AI Chat
      </button>
    </div>
  )
}

export default ChatbotWidget
