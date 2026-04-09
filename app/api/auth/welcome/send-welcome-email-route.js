import nodemailer from 'nodemailer'
import path from 'path'
import { createSupabaseServerClient } from '@/lib/auth/supabase-server'

function getMailerConfig() {
  const host = process.env.SMTP_HOST
  const port = Number(process.env.SMTP_PORT || 587)
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  const from = process.env.SMTP_FROM || 'Nexzen <no-reply@nexzen.com>'

  if (!host || !user || !pass) {
    return null
  }

  return {
    host,
    port,
    secure: `${process.env.SMTP_SECURE || 'false'}` === 'true',
    auth: { user, pass },
    from,
  }
}

function buildWelcomeEmail({ name, email, logoUrl }) {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    'https://www.nexzenindia.com'

  return {
    subject: 'Welcome to Nexzen',
    html: `
      <div style="margin:0;padding:32px;background:#eef4ff;font-family:Segoe UI,Arial,sans-serif;color:#0f172a;">
        <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:28px;overflow:hidden;box-shadow:0 24px 80px rgba(15,23,42,0.12);">
          <div style="padding:28px 32px;background:radial-gradient(circle at top,#2155ff 0%,#0f172a 62%,#020617 100%);color:#ffffff;">
            <img src="${logoUrl || 'cid:nexzen-logo'}" alt="Nexzen" style="width:72px;height:72px;border-radius:20px;display:block;background:#020617;padding:8px;" />
            <h1 style="margin:18px 0 0;font-size:32px;line-height:1.2;font-weight:700;">Welcome to Nexzen</h1>
            <p style="margin:12px 0 0;font-size:16px;line-height:1.7;color:#dbeafe;">
              Your account is now active and ready for boards, kits, sensors, and faster reorders.
            </p>
          </div>
          <div style="padding:32px;">
            <p style="margin:0 0 16px;font-size:17px;line-height:1.7;">Hi ${name || email},</p>
            <p style="margin:0 0 16px;font-size:15px;line-height:1.8;color:#334155;">
              Congratulations. Your Nexzen account has been created successfully. You can now save carts, track orders, and manage your hardware purchases from one place.
            </p>
            <div style="margin:28px 0;">
              <a href="${siteUrl}" style="display:inline-block;background:#0f172a;color:#ffffff;text-decoration:none;padding:14px 22px;border-radius:999px;font-weight:600;">Start exploring Nexzen</a>
            </div>
            <p style="margin:0;font-size:13px;line-height:1.7;color:#64748b;">
              If you did not create this account, please contact Nexzen support immediately.
            </p>
          </div>
        </div>
      </div>
    `,
  }
}

export async function POST(request) {
  try {
    const authHeader = request.headers.get('authorization') || ''
    const token = authHeader.replace(/^Bearer\s+/i, '').trim()

    if (!token) {
      return Response.json({ error: 'Missing session token.' }, { status: 401 })
    }

    const supabase = createSupabaseServerClient()
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token)

    if (error || !user?.email) {
      return Response.json({ error: 'Unauthorized.' }, { status: 401 })
    }

    const mailerConfig = getMailerConfig()

    if (!mailerConfig) {
      return Response.json({ ok: false, skipped: true, reason: 'SMTP not configured.' })
    }

    const body = await request.json().catch(() => ({}))
    const transporter = nodemailer.createTransport({
      host: mailerConfig.host,
      port: mailerConfig.port,
      secure: mailerConfig.secure,
      auth: mailerConfig.auth,
    })
    const publicLogoUrl = process.env.NEXT_PUBLIC_SUPABASE_BRAND_LOGO_URL || ''

    const emailContent = buildWelcomeEmail({
      name: body?.name || user.user_metadata?.full_name || user.email,
      email: user.email,
      logoUrl: publicLogoUrl,
    })
    const logoPath = path.join(process.cwd(), 'public', 'nexzen-logo.png')

    await transporter.sendMail({
      from: mailerConfig.from,
      to: user.email,
      subject: emailContent.subject,
      html: emailContent.html,
      attachments: publicLogoUrl
        ? []
        : [
            {
              filename: 'nexzen-logo.png',
              path: logoPath,
              cid: 'nexzen-logo',
            },
          ],
    })

    return Response.json({ ok: true })
  } catch (error) {
    return Response.json(
      {
        error: error instanceof Error ? error.message : 'Could not send welcome email.',
      },
      { status: 500 }
    )
  }
}
