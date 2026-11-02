<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><title>New message</title></head>
<body style="margin:0;padding:24px;background:#f7f7fa;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#101012;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #ececf2;border-radius:12px;">
    <tr>
      <td style="padding:24px 26px;">
        <h1 style="margin:0 0 4px;font-size:18px;">New message from the website</h1>
        <p style="margin:0 0 16px;font-size:13px;color:#6f6f7c;">
          {{ now()->format('d M Y, H:i') }}
        </p>

        <p style="margin:0 0 4px;font-size:13px;color:#6f6f7c;">From</p>
        <p style="margin:0 0 12px;font-size:15px;font-weight:600;">
          {{ $contactMessage->name ?: 'Unknown' }}
        </p>

        <p style="margin:0 0 4px;font-size:13px;color:#6f6f7c;">Email</p>
        <p style="margin:0 0 12px;font-size:15px;">
          <a href="mailto:{{ $contactMessage->email }}" style="color:#0141c5;">{{ $contactMessage->email }}</a>
        </p>

        <p style="margin:0 0 4px;font-size:13px;color:#6f6f7c;">Phone</p>
        <p style="margin:0 0 16px;font-size:15px;">{{ $contactMessage->phone }}</p>

        <p style="margin:0 0 6px;font-size:13px;color:#6f6f7c;">Message</p>
        <blockquote style="margin:0;padding:12px 16px;border-left:3px solid #e7eefb;background:#f7f9fd;border-radius:8px;font-size:14px;line-height:1.6;">
          {{ $contactMessage->question }}
        </blockquote>
      </td>
    </tr>
  </table>
</body>
</html>
