import { SYSTEM_PROMPT, AGENT_CONFIG } from '../config/agentRules.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { messages, userInfo } = req.body
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'No messages provided' })
  }

  // Determine API endpoint — supports Groq (free) or OpenAI (paid)
  const apiKey = process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'No AI API key configured. Add GROQ_API_KEY or OPENAI_API_KEY to environment variables.' })
  }

  const apiUrl = process.env.OPENAI_API_KEY
    ? 'https://api.openai.com/v1/chat/completions'
    : 'https://api.groq.com/openai/v1/chat/completions'

  // Build system prompt with visitor context
  const userContext = `
== CURRENT VISITOR ==
Name: ${userInfo?.name || 'Visitor'}
Email: ${userInfo?.email || 'Not provided'}
Phone: ${userInfo?.phone || 'Not provided'}
`.trim()

  // After N user turns, instruct AI to wrap up and mention follow-up
  const userTurns = messages.filter((m) => m.role === 'user').length
  const wrapUp = userTurns >= AGENT_CONFIG.followUpAfterTurns
    ? `\n\nIMPORTANT: The visitor has been chatting for a while. Naturally wrap up this response by telling them that Shammi will reach out to them at ${userInfo?.email || 'their email'} soon. Be warm and encouraging.`
    : ''

  const systemContent = `${SYSTEM_PROMPT}\n\n${userContext}${wrapUp}`

  // Limit history to last 10 messages to stay within token budget
  const recentMessages = messages.slice(-10)

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: AGENT_CONFIG.model,
        messages: [
          { role: 'system', content: systemContent },
          ...recentMessages,
        ],
        max_tokens: AGENT_CONFIG.maxTokens,
        temperature: AGENT_CONFIG.temperature,
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('AI API error:', err)
      return res.status(500).json({ error: 'AI service error. Please try again.' })
    }

    const data = await response.json()
    const reply = data.choices?.[0]?.message?.content

    if (!reply) return res.status(500).json({ error: 'Empty response from AI' })

    res.json({ reply })
  } catch (err) {
    console.error('Chat handler error:', err)
    res.status(500).json({ error: 'Something went wrong. Please try again.' })
  }
}
