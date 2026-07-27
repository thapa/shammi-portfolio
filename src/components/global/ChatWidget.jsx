import { useState, useRef, useEffect, useLayoutEffect } from 'react'
import { HiX, HiArrowRight } from 'react-icons/hi'
import { HiChatBubbleLeftRight } from 'react-icons/hi2'
import { motion, AnimatePresence } from 'motion/react'
import { supabase } from '../../lib/supabase'

const inputClass =
  'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[var(--ds-accent)] transition-colors'
const labelClass =
  'text-xs font-bold uppercase tracking-widest text-neutral-500 block mb-2'

// ── Typing indicator ─────────────────────────────────────────────────────────
const TypingDots = () => (
  <div className="flex justify-start items-end mb-4">
    <div className="flex-shrink-0 mr-2">
      <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center text-xs font-bold" style={{ background: 'var(--ds-accent)', color: 'var(--ds-bg)' }}>
        S
      </div>
    </div>
    <div className="bg-gray-200 dark:bg-neutral-700 rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-1.5">
      {[0, 150, 300].map((delay) => (
        <span
          key={delay}
          className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce"
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </div>
  </div>
)

// ── Animated chat message bubble ──────────────────────────────────────────────
const ChatBubble = ({ msg, isUser, avatar }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 20 }}
    transition={{ duration: 0.4 }}
    className={`flex mb-4 ${isUser ? 'justify-end' : 'justify-start'} items-end`}
  >
    {!isUser && (
      <div className="flex-shrink-0 mr-2">
        <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center text-xs font-bold" style={{ background: 'var(--ds-accent)', color: 'var(--ds-bg)' }}>
          {avatar || 'S'}
        </div>
      </div>
    )}
    <div
      className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
        isUser
          ? 'bg-blue-500 text-white rounded-br-none'
          : 'bg-gray-200 dark:bg-neutral-700 text-black dark:text-white rounded-bl-none'
      }`}
    >
      {msg.content}
    </div>
    {isUser && <div className="w-2" />}
  </motion.div>
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

  const containerRef = useRef(null)
  const textareaRef = useRef(null)
  const summarySentRef = useRef(false)

  // Auto-scroll to latest message
  useLayoutEffect(() => {
    const el = containerRef.current
    if (el) el.scrollTop = el.scrollHeight
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

  const sendSummary = (currentMessages, info) => {
    if (summarySentRef.current) return
    if (!currentMessages.some((m) => m.role === 'user')) return
    summarySentRef.current = true
    fetch('/api/chat-summary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: currentMessages, userInfo: info }),
    }).catch(() => {})
  }

  const handleClose = () => {
    if (stage === 'chat') sendSummary(messages, userInfo)
    setIsOpen(false)
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
      const aiMsg = { role: 'assistant', content: data.reply || 'Sorry, something went wrong.' }
      const finalMessages = [...updated, aiMsg]
      setMessages(finalMessages)

      // Auto-send summary once AI wraps up conversation
      const userTurns = finalMessages.filter((m) => m.role === 'user').length
      if (userTurns >= 4) sendSummary(finalMessages, userInfo)
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
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed bottom-24 right-6 z-[9990]"
          >
            {/* iPhone-style frame */}
            <div className="relative bg-[#212121] rounded-[44px] shadow-2xl overflow-hidden flex flex-col"
              style={{ width: 350, height: 620, border: '8px solid var(--ds-accent)' }}
            >
              {/* Status Bar */}
              <div className="h-7 flex-shrink-0 px-6 flex justify-between items-center bg-[#212121] text-white text-[10px] font-semibold relative z-20">
                <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[45%] h-[22px] bg-black rounded-b-xl z-30 flex justify-center items-center gap-2 p-1">
                  <div className="w-10 h-1.5 rounded-full bg-neutral-700" />
                  <div className="w-1.5 h-1.5 rounded-full bg-neutral-700" />
                </div>
                <div className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M1.5 8.7l4.85 4.85c2.5-2.49 6.5-2.49 9 0L20.2 8.7C15.94 4.46 8.8 4.46 1.5 8.7zM7.5 14.7l4.25 4.26 4.25-4.26c-2.35-2.35-6.15-2.35-8.5 0zM11.75 23l2.09-2.09c-.58-.58-1.52-.58-2.1 0L11.75 23z"/></svg>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.34C7 21.4 7.6 22 8.33 22h7.34c.73 0 1.33-.6 1.33-1.33V5.33C17 4.6 16.4 4 15.67 4z"/></svg>
                </div>
              </div>

              {/* Chat Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800 flex-shrink-0 bg-[#212121]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center font-display text-sm flex-shrink-0" style={{ background: 'var(--ds-accent)', color: 'var(--ds-bg)' }}>
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
                  onClick={handleClose}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-500 hover:text-white hover:bg-white/10 transition-all"
                  aria-label="Close chat"
                >
                  <HiX size={16} />
                </button>
              </div>

              {/* Body */}
              {stage === 'pre-chat' ? (
                /* ── Pre-chat form ── */
                <div className="flex-1 overflow-y-auto p-5 bg-[#1a1a1a]">
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
                      className="btn-primary w-full disabled:opacity-60"
                    >
                      {formSaving ? 'Starting…' : <>Start Chat <HiArrowRight size={15} /></>}
                    </button>
                  </form>
                </div>
              ) : (
                /* ── Chat messages ── */
                <>
                  <div ref={containerRef} className="flex-1 overflow-y-auto p-3 flex flex-col bg-white dark:bg-[#1a1a1a]" style={{ scrollbarWidth: 'none' }}>
                    <AnimatePresence initial={false} mode="popLayout">
                      {messages.map((msg, i) => (
                        <ChatBubble
                          key={i}
                          msg={msg}
                          isUser={msg.role === 'user'}
                          avatar="S"
                        />
                      ))}
                    </AnimatePresence>
                    {sending && <TypingDots />}
                  </div>

                  {/* Input row */}
                  <div className="flex-shrink-0 px-3 py-2.5 border-t border-neutral-800 flex gap-2 items-end bg-[#212121]">
                    <textarea
                      ref={textareaRef}
                      value={input}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                      placeholder="Type a message…"
                      rows={1}
                      disabled={sending}
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[var(--ds-accent)] transition-colors resize-none leading-relaxed disabled:opacity-50"
                      style={{ maxHeight: '96px', scrollbarWidth: 'none' }}
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!input.trim() || sending}
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-blue-500 hover:bg-blue-600"
                      aria-label="Send message"
                    >
                      <HiArrowRight size={16} className="text-white" />
                    </button>
                  </div>
                </>
              )}

              {/* Home indicator bar */}
              <div className="h-5 flex-shrink-0 flex items-center justify-center bg-[#212121]">
                <div className="w-28 h-1 rounded-full bg-neutral-600" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating toggle button ─────────────────────────────── */}
      <button
        onClick={() => isOpen ? handleClose() : setIsOpen(true)}
        className="fixed bottom-6 right-6 z-[9991] w-14 h-14 flex items-center justify-center transition-colors rounded-full shadow-lg"
        style={{ background: 'var(--ds-accent)', color: 'var(--ds-bg)' }}
        aria-label="Chat with Shammi's AI"
      >
        {isOpen ? (
          <HiX size={22} className="text-white" />
        ) : (
          <HiChatBubbleLeftRight size={22} className="text-white" />
        )}
      </button>
    </>
  )
}

export default ChatWidget
