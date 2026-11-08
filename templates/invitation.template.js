export const invitationTemplate = ({ companyName, role, invitationUrl }) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>SiteRelay Invitation</title>
      </head>

      <body style="
        margin: 0;
        padding: 40px 16px;
        background-color: #f4f6f8;
        font-family: Arial, Helvetica, sans-serif;
        color: #263238;
      ">

        <div style="
          max-width: 560px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid #e5e7eb;
        ">

          <div style="
            padding: 28px;
            background-color: #172554;
            text-align: center;
          ">
            <h1 style="
              margin: 0;
              color: #ffffff;
              font-size: 26px;
              letter-spacing: 1px;
            ">
              SiteRelay
            </h1>
            <p style="
              margin: 8px 0 0;
              color: #cbd5e1;
              font-size: 14px;
            ">
              Work management made simpler
            </p>
          </div>

          <div style="padding: 32px 28px;">

            <h2 style="
              margin-top: 0;
              font-size: 22px;
              color: #172554;
            ">
              You're invited!
            </h2>

            <p style="font-size: 15px; line-height: 1.7;">
              You've been invited to join
              <strong>${companyName}</strong> on SiteRelay.
            </p>

            <p style="font-size: 15px; line-height: 1.7;">
              Your assigned company role is:
              <strong>${role}</strong>.
            </p>

            <div style="text-align: center; margin: 32px 0;">
              <a
                href="${invitationUrl}"
                style="
                  display: inline-block;
                  padding: 14px 28px;
                  background-color: #2563eb;
                  color: #ffffff;
                  text-decoration: none;
                  border-radius: 7px;
                  font-size: 15px;
                  font-weight: bold;
                "
              >
                Accept Invitation
              </a>
            </div>

            <p style="
              font-size: 13px;
              color: #64748b;
              line-height: 1.6;
            ">
              This invitation expires in 7 days.
              If you weren't expecting this invitation,
              you can safely ignore this email.
            </p>

            <hr style="
              border: none;
              border-top: 1px solid #e5e7eb;
              margin: 28px 0;
            " />

            <p style="
              font-size: 12px;
              color: #94a3b8;
              line-height: 1.6;
            ">
              If the button doesn't work, copy and paste this link
              into your browser:
              <br />
              <a href="${invitationUrl}" style="color: #2563eb;">
                ${invitationUrl}
              </a>
            </p>

          </div>

          <div style="
            padding: 18px;
            background-color: #f8fafc;
            text-align: center;
          ">
            <p style="
              margin: 0;
              font-size: 12px;
              color: #94a3b8;
            ">
              © ${new Date().getFullYear()} SiteRelay. All rights reserved.
            </p>
          </div>

        </div>
      </body>
    </html>
  `;
};
