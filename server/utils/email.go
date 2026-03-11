package utils

import (
	"crypto/tls"
	"fmt"
	"log"
	"net"
	"net/smtp"
	"os"
	"strings"
)

const (
	smtpFromEmail = "jaison7373@gmail.com"
	smtpFromName  = "BIT Resume System"
	smtpHost      = "smtp.gmail.com"
	smtpPort      = "587"
)

// SendMail sends an HTML email via Gmail SMTP (STARTTLS on port 587).
// Set GMAIL_APP_PASSWORD in your .env file (use a Gmail App Password, not your regular password).
func SendMail(to []string, subject, htmlBody string) error {
	password := os.Getenv("GMAIL_APP_PASSWORD")
	if password == "" {
		log.Println("[email] GMAIL_APP_PASSWORD not set — email skipped")
		return nil
	}

	// Build the raw MIME message
	msg := buildMIMEMessage(to, subject, htmlBody)

	addr := smtpHost + ":" + smtpPort

	// Dial plain TCP first; Go's smtp.SendMail upgrades to STARTTLS automatically
	conn, err := net.Dial("tcp", addr)
	if err != nil {
		log.Printf("[email] dial error: %v", err)
		return fmt.Errorf("smtp dial: %w", err)
	}

	client, err := smtp.NewClient(conn, smtpHost)
	if err != nil {
		log.Printf("[email] smtp.NewClient error: %v", err)
		return fmt.Errorf("smtp client: %w", err)
	}
	defer client.Close()

	// Upgrade to TLS via STARTTLS
	tlsCfg := &tls.Config{ServerName: smtpHost}
	if err = client.StartTLS(tlsCfg); err != nil {
		log.Printf("[email] StartTLS error: %v", err)
		return fmt.Errorf("starttls: %w", err)
	}

	auth := smtp.PlainAuth("", smtpFromEmail, password, smtpHost)
	if err = client.Auth(auth); err != nil {
		log.Printf("[email] auth error: %v", err)
		return fmt.Errorf("smtp auth: %w", err)
	}

	if err = client.Mail(smtpFromEmail); err != nil {
		return fmt.Errorf("smtp MAIL FROM: %w", err)
	}
	for _, addr := range to {
		if err = client.Rcpt(addr); err != nil {
			return fmt.Errorf("smtp RCPT TO <%s>: %w", addr, err)
		}
	}

	w, err := client.Data()
	if err != nil {
		return fmt.Errorf("smtp DATA: %w", err)
	}
	if _, err = fmt.Fprint(w, msg); err != nil {
		return fmt.Errorf("smtp write: %w", err)
	}
	if err = w.Close(); err != nil {
		return fmt.Errorf("smtp write close: %w", err)
	}

	if err = client.Quit(); err != nil {
		log.Printf("[email] QUIT warning: %v", err)
	}

	log.Printf("[email] sent to %v | subject: %s", to, subject)
	return nil
}

// SendMailAsync sends email in a background goroutine so it never blocks the HTTP handler.
func SendMailAsync(to []string, subject, htmlBody string) {
	go func() {
		if err := SendMail(to, subject, htmlBody); err != nil {
			log.Printf("[email] async send failed: %v", err)
		}
	}()
}

func buildMIMEMessage(to []string, subject, htmlBody string) string {
	var sb strings.Builder
	sb.WriteString(fmt.Sprintf("From: %s <%s>\r\n", smtpFromName, smtpFromEmail))
	sb.WriteString(fmt.Sprintf("To: %s\r\n", strings.Join(to, ", ")))
	sb.WriteString(fmt.Sprintf("Subject: %s\r\n", subject))
	sb.WriteString("MIME-Version: 1.0\r\n")
	sb.WriteString("Content-Type: text/html; charset=\"UTF-8\"\r\n")
	sb.WriteString("\r\n")
	sb.WriteString(htmlBody)
	return sb.String()
}

// ─── Email template helpers ──────────────────────────────────────────────────

func appURL() string {
	if u := os.Getenv("APP_URL"); u != "" {
		return u
	}
	return "http://localhost:5173"
}

func ConsultancySubmittedEmailBody(projectTitle, clientOrg, submittedAt string) string {
	loginURL := appURL() + "/login"
	return fmt.Sprintf(`
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family:Arial,sans-serif;background:#f4f6f9;margin:0;padding:0;">
  <table width="100%%" cellpadding="0" cellspacing="0" style="background:#f4f6f9;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08);">
        <tr><td style="background:#1e293b;padding:24px 32px;">
          <h1 style="color:#fff;margin:0;font-size:20px;">BIT Resume — Consultancy Workflow</h1>
        </td></tr>
        <tr><td style="padding:32px;">
          <h2 style="color:#1e293b;margin:0 0 16px;">New Consultancy Work Submitted</h2>
          <p style="color:#475569;margin:0 0 24px;">The Principal has submitted a new consultancy work that requires your review and department assignment.</p>
          <table width="100%%" cellpadding="8" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:6px;margin-bottom:24px;">
            <tr style="background:#f8fafc;">
              <td style="color:#64748b;font-weight:600;width:40%%;padding:12px 16px;">Project Title</td>
              <td style="color:#1e293b;padding:12px 16px;"><strong>%s</strong></td>
            </tr>
            <tr>
              <td style="color:#64748b;font-weight:600;padding:12px 16px;border-top:1px solid #e2e8f0;">Client Organisation</td>
              <td style="color:#1e293b;padding:12px 16px;border-top:1px solid #e2e8f0;">%s</td>
            </tr>
            <tr style="background:#f8fafc;">
              <td style="color:#64748b;font-weight:600;padding:12px 16px;border-top:1px solid #e2e8f0;">Submitted On</td>
              <td style="color:#1e293b;padding:12px 16px;border-top:1px solid #e2e8f0;">%s</td>
            </tr>
          </table>
          <p style="color:#64748b;margin:0 0 24px;">Please log in to the BIT Resume portal to review and assign the consultancy work to the appropriate department.</p>
          <div style="text-align:center;">
            <a href="%s" style="display:inline-block;background:#1e293b;color:#fff;text-decoration:none;padding:12px 32px;border-radius:6px;font-size:15px;font-weight:600;letter-spacing:.3px;">Login to View</a>
          </div>
        </td></tr>
        <tr><td style="background:#f8fafc;padding:16px 32px;border-top:1px solid #e2e8f0;">
          <p style="color:#94a3b8;font-size:13px;margin:0;">This is an automated notification from BIT Resume System. Do not reply to this email.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`, projectTitle, clientOrg, submittedAt, loginURL)
}

func ConsultancyAssignedToHODEmailBody(projectTitle, clientOrg, deptName, workType, iqacRemarks string) string {
	loginURL := appURL() + "/login"
	return fmt.Sprintf(`
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family:Arial,sans-serif;background:#f4f6f9;margin:0;padding:0;">
  <table width="100%%" cellpadding="0" cellspacing="0" style="background:#f4f6f9;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08);">
        <tr><td style="background:#1e3a5f;padding:24px 32px;">
          <h1 style="color:#fff;margin:0;font-size:20px;">BIT Resume — Consultancy Workflow</h1>
        </td></tr>
        <tr><td style="padding:32px;">
          <h2 style="color:#1e293b;margin:0 0 16px;">Consultancy Work Assigned to Your Department</h2>
          <p style="color:#475569;margin:0 0 24px;">IQAC has assigned a consultancy work to your department. Please assign it to a suitable faculty member.</p>
          <table width="100%%" cellpadding="8" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:6px;margin-bottom:24px;">
            <tr style="background:#f8fafc;">
              <td style="color:#64748b;font-weight:600;width:40%%;padding:12px 16px;">Project Title</td>
              <td style="color:#1e293b;padding:12px 16px;"><strong>%s</strong></td>
            </tr>
            <tr>
              <td style="color:#64748b;font-weight:600;padding:12px 16px;border-top:1px solid #e2e8f0;">Client Organisation</td>
              <td style="color:#1e293b;padding:12px 16px;border-top:1px solid #e2e8f0;">%s</td>
            </tr>
            <tr style="background:#f8fafc;">
              <td style="color:#64748b;font-weight:600;padding:12px 16px;border-top:1px solid #e2e8f0;">Assigned Department</td>
              <td style="color:#1e293b;padding:12px 16px;border-top:1px solid #e2e8f0;">%s</td>
            </tr>
            <tr>
              <td style="color:#64748b;font-weight:600;padding:12px 16px;border-top:1px solid #e2e8f0;">Work Type</td>
              <td style="color:#1e293b;padding:12px 16px;border-top:1px solid #e2e8f0;">%s</td>
            </tr>
            <tr style="background:#f8fafc;">
              <td style="color:#64748b;font-weight:600;padding:12px 16px;border-top:1px solid #e2e8f0;">IQAC Remarks</td>
              <td style="color:#1e293b;padding:12px 16px;border-top:1px solid #e2e8f0;">%s</td>
            </tr>
          </table>
          <p style="color:#64748b;margin:0 0 24px;">Please log in to the BIT Resume portal to assign this work to a faculty member.</p>
          <div style="text-align:center;">
            <a href="%s" style="display:inline-block;background:#1e3a5f;color:#fff;text-decoration:none;padding:12px 32px;border-radius:6px;font-size:15px;font-weight:600;letter-spacing:.3px;">Login to View</a>
          </div>
        </td></tr>
        <tr><td style="background:#f8fafc;padding:16px 32px;border-top:1px solid #e2e8f0;">
          <p style="color:#94a3b8;font-size:13px;margin:0;">This is an automated notification from BIT Resume System. Do not reply to this email.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`, projectTitle, clientOrg, deptName, workType, iqacRemarks, loginURL)
}

func ConsultancyAssignedToFacultyEmailBody(projectTitle, clientOrg, hodRemarks string) string {
	loginURL := appURL() + "/login"
	return fmt.Sprintf(`
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family:Arial,sans-serif;background:#f4f6f9;margin:0;padding:0;">
  <table width="100%%" cellpadding="0" cellspacing="0" style="background:#f4f6f9;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08);">
        <tr><td style="background:#1e3a5f;padding:24px 32px;">
          <h1 style="color:#fff;margin:0;font-size:20px;">BIT Resume — Consultancy Workflow</h1>
        </td></tr>
        <tr><td style="padding:32px;">
          <h2 style="color:#1e293b;margin:0 0 16px;">You Have Been Assigned a Consultancy Work</h2>
          <p style="color:#475569;margin:0 0 24px;">The HOD has assigned you to execute a consultancy project. Please review the details and respond at the earliest.</p>
          <table width="100%%" cellpadding="8" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:6px;margin-bottom:24px;">
            <tr style="background:#f8fafc;">
              <td style="color:#64748b;font-weight:600;width:40%%;padding:12px 16px;">Project Title</td>
              <td style="color:#1e293b;padding:12px 16px;"><strong>%s</strong></td>
            </tr>
            <tr>
              <td style="color:#64748b;font-weight:600;padding:12px 16px;border-top:1px solid #e2e8f0;">Client Organisation</td>
              <td style="color:#1e293b;padding:12px 16px;border-top:1px solid #e2e8f0;">%s</td>
            </tr>
            <tr style="background:#f8fafc;">
              <td style="color:#64748b;font-weight:600;padding:12px 16px;border-top:1px solid #e2e8f0;">HOD Remarks</td>
              <td style="color:#1e293b;padding:12px 16px;border-top:1px solid #e2e8f0;">%s</td>
            </tr>
          </table>
          <p style="color:#64748b;margin:0 0 24px;">Please log in to the BIT Resume portal to accept or reject this consultancy assignment and fill in the required form upon completion.</p>
          <div style="text-align:center;">
            <a href="%s" style="display:inline-block;background:#1e3a5f;color:#fff;text-decoration:none;padding:12px 32px;border-radius:6px;font-size:15px;font-weight:600;letter-spacing:.3px;">Login to View</a>
          </div>
        </td></tr>
        <tr><td style="background:#f8fafc;padding:16px 32px;border-top:1px solid #e2e8f0;">
          <p style="color:#94a3b8;font-size:13px;margin:0;">This is an automated notification from BIT Resume System. Do not reply to this email.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`, projectTitle, clientOrg, hodRemarks, loginURL)
}
