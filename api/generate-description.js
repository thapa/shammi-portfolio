export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { title, url, techStack } = req.body
  if (!title) return res.status(400).json({ error: 'Missing title' })

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'Missing GROQ_API_KEY' })

  const prompt = [
    `Write a concise 2-sentence project description for a portfolio website.`,
    `Project title: ${title}`,
    url ? `Website URL: ${url}` : '',
    techStack ? `Tech stack: ${techStack}` : '',
    `Keep it professional, highlight what the project does and its key value. No bullet points, no fluff.`,
  ].filter(Boolean).join('\n')

  try {
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 120,
        temperature: 0.7,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!groqRes.ok) {
      const text = await groqRes.text()
      return res.status(500).json({ error: `Groq error: ${text}` })
    }

    const data = await groqRes.json()
    const description = data.choices?.[0]?.message?.content?.trim() || ''
    res.json({ description })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
