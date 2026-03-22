import { Resend } from 'resend'
import { AGENT_CONFIG } from '../config/agentRules.js'

const resend = new Resend(process.env.RESEND_API_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { messages, userInfo } = req.body
  if (!userInfo?.email || !messages?.length) {
    return res.status(400).json({ error: 'Missing data' })
  }

  // Only send if there was at least one user message
  const userMessages = messages.filter((m) => m.role === 'user')
  if (!userMessages.length) return res.json({ ok: true, skipped: true })

  // ── Generate AI summary ────────────────────────────────────────────
  const apiKey = process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY
  const apiUrl = process.env.OPENAI_API_KEY
    ? 'https://api.openai.com/v1/chat/completions'
    : 'https://api.groq.com/openai/v1/chat/completions'

  let summary = 'No summary generated.'

  if (apiKey) {
    try {
      const transcript = messages
        .map((m) => `${m.role === 'user' ? 'Visitor' : 'Assistant'}: ${m.content}`)
        .join('\n')

      const aiRes = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: AGENT_CONFIG.model,
          messages: [
            {
              role: 'system',
              content:
                'Summarize this chat conversation in 2–3 sentences. Focus on what the visitor needs, their project type, and any budget or timeline mentioned. Be concise.',
            },
            { role: 'user', content: transcript },
          ],
          max_tokens: 150,
          temperature: 0.3,
        }),
      })

      if (aiRes.ok) {
        const data = await aiRes.json()
        summary = data.choices?.[0]?.message?.content || summary
      }
    } catch (_) {}
  }

  // ── Build conversation HTML ────────────────────────────────────────
  const conversationHtml = messages
    .map((m) => {
      const isUser = m.role === 'user'
      return `
        <tr>
          <td style="padding: 6px 0; text-align: ${isUser ? 'right' : 'left'};">
            <span style="
              display: inline-block;
              background: ${isUser ? '#5c51fe' : '#f0f0f0'};
              color: #0E0E0E;
              padding: 10px 16px;
              border-radius: 14px;
              border-${isUser ? 'bottom-right' : 'bottom-left'}-radius: 4px;
              font-size: 14px;
              line-height: 1.5;
              max-width: 80%;
              text-align: left;
            ">
              <strong style="font-size:11px; display:block; margin-bottom:4px; opacity:0.6; text-transform:uppercase; letter-spacing:1px;">
                ${isUser ? userInfo.name || 'Visitor' : "Shammi's AI"}
              </strong>
              ${m.content}
            </span>
          </td>
        </tr>`
    })
    .join('')

  // ── Send email ─────────────────────────────────────────────────────
  try {
    await resend.emails.send({
      from: 'Portfolio Chat <onboarding@resend.dev>',
      to: 'thapa.shammi@gmail.com',
      reply_to: userInfo.email,
      subject: `💬 New Chat Lead: ${userInfo.name || userInfo.email}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
          <body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 0;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;max-width:600px;width:100%;">

                    <!-- Header -->
                    <tr>
                      <td style="background:#0E0E0E;padding:32px 40px;">
                        <p style="margin:0;color:#5c51fe;font-size:12px;font-weight:700;letter-spacing:3px;text-transform:uppercase;">New Chat Lead</p>
                        <h1 style="margin:8px 0 0;color:#fff;font-size:26px;font-weight:800;line-height:1.2;">
                          ${userInfo.name || 'Someone'} wants to connect
                        </h1>
                      </td>
                    </tr>

                    <!-- Contact info -->
                    <tr>
                      <td style="padding:32px 40px 0;">
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="padding-bottom:20px;border-bottom:1px solid #f0f0f0;">
                              <p style="margin:0 0 4px;color:#999;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">Name</p>
                              <p style="margin:0;color:#0E0E0E;font-size:16px;font-weight:600;">${userInfo.name || '—'}</p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding:20px 0;border-bottom:1px solid #f0f0f0;">
                              <p style="margin:0 0 4px;color:#999;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">Email</p>
                              <a href="mailto:${userInfo.email}" style="color:#0E0E0E;font-size:16px;font-weight:600;text-decoration:none;">${userInfo.email}</a>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding:20px 0;border-bottom:1px solid #f0f0f0;">
                              <p style="margin:0 0 4px;color:#999;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">Phone</p>
                              ${
                                userInfo.phone
                                  ? `<a href="tel:${userInfo.phone}" style="color:#0E0E0E;font-size:16px;font-weight:600;text-decoration:none;">${userInfo.phone}</a>`
                                  : `<p style="margin:0;color:#999;font-size:15px;">Not provided</p>`
                              }
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>

                    <!-- AI Summary -->
                    <tr>
                      <td style="padding:28px 40px 0;">
                        <p style="margin:0 0 10px;color:#999;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">AI Summary</p>
                        <div style="background:#efedff;border-left:3px solid #5c51fe;padding:16px 20px;border-radius:8px;">
                          <p style="margin:0;color:#0E0E0E;font-size:14px;line-height:1.6;">${summary}</p>
                        </div>
                      </td>
                    </tr>

                    <!-- Full conversation -->
                    <tr>
                      <td style="padding:28px 40px 0;">
                        <p style="margin:0 0 16px;color:#999;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">Full Conversation</p>
                        <table width="100%" cellpadding="0" cellspacing="0">
                          ${conversationHtml}
                        </table>
                      </td>
                    </tr>

                    <!-- Reply CTA -->
                    <tr>
                      <td style="padding:32px 40px;">
                        <a href="mailto:${userInfo.email}"
                          style="display:inline-block;background:#0E0E0E;color:#fff;font-size:14px;font-weight:700;padding:14px 28px;border-radius:100px;text-decoration:none;">
                          Reply to ${userInfo.name || 'Visitor'} →
                        </a>
                      </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                      <td style="background:#f9f9f9;padding:20px 40px;border-top:1px solid #f0f0f0;">
                        <p style="margin:0;color:#aaa;font-size:12px;">Sent from your portfolio chat widget · <a href="https://shammi.vercel.app" style="color:#aaa;">shammi.vercel.app</a></p>
                      </td>
                    </tr>

                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    })

    res.json({ ok: true })
  } catch (err) {
    console.error('chat-summary email error:', err)
    res.status(500).json({ error: 'Failed to send summary email' })
  }
}
