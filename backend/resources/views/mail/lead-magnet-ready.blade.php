<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><title>Your download is ready</title></head>
<body style="margin:0;padding:24px;background:#fdfaf3;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#101012;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #ececf2;border-radius:12px;">
    <tr>
      <td style="padding:28px 28px 8px;">
        <p style="margin:0 0 6px;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#0141c5;">AskPias</p>
        <h1 style="margin:0;font-size:22px;line-height:1.25;">Your download is ready</h1>
      </td>
    </tr>
    <tr>
      <td style="padding:8px 28px 0;font-size:15px;line-height:1.6;color:#3c3c46;">
        <p style="margin:12px 0;">Hi {{ $recipientName }},</p>
        <p style="margin:12px 0;">
          Thanks for requesting {{ $noteTitle ? '“'.$noteTitle.'”' : 'the guide' }}. You can download it here:
        </p>
        <p style="margin:20px 0;">
          <a href="{{ $downloadUrl }}" style="display:inline-block;background:#0141c5;color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;padding:12px 20px;border-radius:8px;">Download now</a>
        </p>
        <p style="margin:16px 0;font-size:13px;color:#6f6f7c;">
          If the button doesn’t work, copy this link:<br>
          <a href="{{ $downloadUrl }}" style="color:#0141c5;">{{ $downloadUrl }}</a>
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding:16px 28px 28px;font-size:13px;color:#6f6f7c;">
        <p style="margin:0;">— Pias Ahmed</p>
        <p style="margin:4px 0 0;">Brand builder &amp; growth marketer</p>
      </td>
    </tr>
  </table>
</body>
</html>
