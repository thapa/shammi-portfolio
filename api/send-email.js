import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { name, email, phone, budget, projectType } = req.body

  if (!name || !email || !phone || !budget || !projectType) {
    return res.status(400).json({ error: 'All fields are required' })
  }

  try {
    await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: 'thapa.shammi@gmail.com',
      reply_to: email,
      subject: `New Project Inquiry — ${projectType} from ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          </head>
          <body style="margin:0;padding:0;background:#f5f5f5;font-family:'Inter',Arial,sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 0;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;max-width:600px;width:100%;">

                    <!-- Header -->
                    <tr>
                      <td style="background:#0E0E0E;padding:32px 40px;">
                        <p style="margin:0;color:#5c51fe;font-size:13px;font-weight:700;letter-spacing:3px;text-transform:uppercase;">New Inquiry</p>
                        <h1 style="margin:8px 0 0;color:#ffffff;font-size:28px;font-weight:800;line-height:1.2;">${projectType}</h1>
                      </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                      <td style="padding:40px;">

                        <!-- Fields -->
                        <table width="100%" cellpadding="0" cellspacing="0">

                          <tr>
                            <td style="padding-bottom:24px;border-bottom:1px solid #f0f0f0;">
                              <p style="margin:0 0 4px;color:#999;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">Name</p>
                              <p style="margin:0;color:#0E0E0E;font-size:16px;font-weight:600;">${name}</p>
                            </td>
                          </tr>

                          <tr>
                            <td style="padding:24px 0;border-bottom:1px solid #f0f0f0;">
                              <p style="margin:0 0 4px;color:#999;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">Email</p>
                              <a href="mailto:${email}" style="color:#0E0E0E;font-size:16px;font-weight:600;text-decoration:none;">${email}</a>
                            </td>
                          </tr>

                          <tr>
                            <td style="padding:24px 0;border-bottom:1px solid #f0f0f0;">
                              <p style="margin:0 0 4px;color:#999;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">Phone</p>
                              <a href="tel:${phone}" style="color:#0E0E0E;font-size:16px;font-weight:600;text-decoration:none;">${phone}</a>
                            </td>
                          </tr>

                          <tr>
                            <td style="padding:24px 0;border-bottom:1px solid #f0f0f0;">
                              <p style="margin:0 0 4px;color:#999;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">Budget</p>
                              <p style="margin:0;color:#0E0E0E;font-size:16px;font-weight:600;">${budget}</p>
                            </td>
                          </tr>

                          <tr>
                            <td style="padding:24px 0;">
                              <p style="margin:0 0 4px;color:#999;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">Project Type</p>
                              <p style="margin:0;">
                                <span style="display:inline-block;background:#5c51fe;color:#0E0E0E;font-size:13px;font-weight:700;padding:6px 14px;border-radius:100px;">${projectType}</span>
                              </p>
                            </td>
                          </tr>

                        </table>

                        <!-- Reply CTA -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:32px;">
                          <tr>
                            <td>
                              <a href="mailto:${email}"
                                style="display:inline-block;background:#0E0E0E;color:#ffffff;font-size:14px;font-weight:700;padding:14px 28px;border-radius:100px;text-decoration:none;">
                                Reply to ${name} →
                              </a>
                            </td>
                          </tr>
                        </table>

                      </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                      <td style="background:#f9f9f9;padding:24px 40px;border-top:1px solid #f0f0f0;">
                        <p style="margin:0;color:#999;font-size:12px;">Sent from your portfolio contact form · <a href="https://shammi.vercel.app" style="color:#999;">shammi.vercel.app</a></p>
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

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error('Resend error:', error)
    return res.status(500).json({ error: 'Failed to send email. Please try again.' })
  }
}
