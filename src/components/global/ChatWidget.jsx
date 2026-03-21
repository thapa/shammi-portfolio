import { useState, useRef, useEffect } from 'react'
import { HiX, HiArrowRight } from 'react-icons/hi'
import { HiChatBubbleLeftRight } from 'react-icons/hi2'
import { supabase } from '../../lib/supabase'

const inputClass =
  'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-primary transition-colors'
const labelClass =
  'text-xs font-bold uppercase tracking-widest text-neutral-500 block mb-2'

// ── Typing indicator ─────────────────────────────────────────────────────────
const TypingDots = () => (
  <div className="flex justify-start">
    <div className="bg-neutral-900 border border-white/5 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5">
      {[0, 150, 300].map((delay) => (
        <span
          key={delay}
          className="w-2 h-2 rounded-full bg-neutral-500 animate-bounce"
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </div>
  </div>
)

// ── Chat Widget ──────────────────────────────────────────────────────────────
const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [stage, setStage] = useState('pre-chat') // 'pre-chat' | 'chat'
  const [form, setForm] = useState({ name: '', email: '', phone: '' })
  const [formSaving, setFormSaving] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [userInfo, setUserInfo] = useState(null)

  const bottomRef = useRef(null)
  const inputRef = useRef(null)
  const textareaRef = useRef(null)

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, sending])

  // Focus input when chat stage opens
  useEffect(() => {
    if (stage === 'chat' && isOpen) {
      setTimeout(() => textareaRef.current?.focus(), 150)
    }
  }, [stage, isOpen])

  // Auto-resize textarea
  const handleInputChange = (e) => {
    setInput(e.target.value)
    const el = e.target
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 96)}px`
  }

  const handleFormChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setFormSaving(true)

    try {
      await supabase.from('leads').insert({
        name: form.name,
        email: form.email,
        phone: form.phone || null,
        source: 'chat_widget',
      })
    } catch (_) {
      // Non-blocking — chat still starts even if save fails
    }

    const info = { ...form }
    setUserInfo(info)
    setMessages([
      {
        role: 'assistant',
        content: `Hi ${form.name}! 👋 I'm Shammi's AI assistant. Tell me about your project — I'd love to help figure out what you need!`,
      },
    ])
    setStage('chat')
    setFormSaving(false)
  }

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || sending) return

    const userMsg = { role: 'user', content: text }
    const updated = [...messages, userMsg]
    setMessages(updated)
    setInput('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
    setSending(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updated, userInfo }),
      })
      const data = await res.json()
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.reply || 'Sorry, something went wrong.' },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Oops! I ran into an issue. You can reach Shammi directly at thapa.shammi@gmail.com.',
        },
      ])
    }

    setSending(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      {/* ── Chat Panel ─────────────────────────────────────────── */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-6 z-[9990] flex flex-col rounded-2xl border border-white/10 bg-[#0E0E0E] shadow-2xl overflow-hidden"
          style={{ width: '360px', maxWidth: 'calc(100vw - 32px)', height: '520px' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center font-display font-bold text-[#0E0E0E] text-sm flex-shrink-0">
                S
              </div>
              <div>
                <p className="text-white text-sm font-semibold leading-tight">
                  Shammi's Assistant
                </p>
                <p className="text-xs text-neutral-500 flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block animate-pulse" />
                  Online now
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-500 hover:text-white hover:bg-white/10 transition-all"
              aria-label="Close chat"
            >
              <HiX size={16} />
            </button>
          </div>

          {/* Body */}
          {stage === 'pre-chat' ? (
            /* ── Pre-chat form ── */
            <div className="flex-1 overflow-y-auto p-5">
              <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                Before we start, please leave your details so Shammi can follow up with you.
              </p>
              <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
                <div>
                  <label className={labelClass}>Your Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={form.name}
                    onChange={handleFormChange}
                    placeholder="John Doe"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleFormChange}
                    placeholder="john@example.com"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>
                    Phone Number{' '}
                    <span className="normal-case font-normal tracking-normal opacity-60">(optional)</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleFormChange}
                    placeholder="+1 234 567 8900"
                    className={inputClass}
                  />
                </div>
                <button
                  type="submit"
                  disabled={formSaving}
                  className="inline-flex items-center justify-center gap-2 w-full bg-primary text-[#0E0E0E] text-sm font-bold py-3 rounded-full hover:bg-primary-light transition-colors disabled:opacity-60"
                >
                  {formSaving ? 'Starting…' : <>Start Chat <HiArrowRight size={15} /></>}
                </button>
              </form>
            </div>
          ) : (
            /* ── Chat messages ── */
            <>
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-primary text-[#0E0E0E] font-medium rounded-br-sm'
                          : 'bg-neutral-900 text-neutral-200 rounded-bl-sm border border-white/5'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                {sending && <TypingDots />}
                <div ref={bottomRef} />
              </div>

              {/* Input row */}
              <div className="flex-shrink-0 px-4 py-3 border-t border-white/10 flex gap-2 items-end">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message…"
                  rows={1}
                  disabled={sending}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-primary transition-colors resize-none leading-relaxed disabled:opacity-50"
                  style={{ maxHeight: '96px' }}
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || sending}
                  className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0 hover:bg-primary-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Send message"
                >
                  <HiArrowRight size={16} className="text-[#0E0E0E]" />
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── Floating toggle button ─────────────────────────────── */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-[9991] w-14 h-14 rounded-full bg-primary shadow-xl flex items-center justify-center hover:bg-primary-light hover:scale-110 transition-all"
        aria-label="Chat with Shammi's AI"
      >
        {isOpen ? (
          <HiX size={22} className="text-[#0E0E0E]" />
        ) : (
          <HiChatBubbleLeftRight size={22} className="text-[#0E0E0E]" />
        )}
      </button>
    </>
  )
}

export default ChatWidget
