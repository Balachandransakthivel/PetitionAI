"""Email notification service via SMTP."""
import logging
import smtplib
from email.mime.text import MIMEText

from app.config import settings

logger = logging.getLogger("petitionai.email")


def send_email(to_email: str, subject: str, body: str) -> bool:
    """Send an email via SMTP. Returns True on success (or if SMTP unconfigured)."""
    if not settings.SMTP_USER or not settings.SMTP_PASSWORD:
        logger.info(
            "[Email] SMTP not configured - would send to=%s subject=%s\n%s",
            to_email, subject, body,
        )
        return True

    msg = MIMEText(body, "plain", "utf-8")
    msg["Subject"] = subject
    msg["From"] = settings.SMTP_FROM or settings.SMTP_USER
    msg["To"] = to_email

    try:
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=15) as server:
            server.starttls()
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.send_message(msg)
        logger.info("[Email] Sent to %s", to_email)
        return True
    except Exception as exc:  # pragma: no cover
        logger.error("[Email] Failed to send to %s: %s", to_email, exc)
        return False


def send_complaint_notification(to_email: str, petition_id: str, title: str, status: str) -> bool:
    subject = f"Petition {petition_id} - Status Update: {status.replace('_', ' ').title()}"
    body = (
        f"Dear Citizen,\n\n"
        f"Your petition '{title}' ({petition_id}) has been updated.\n\n"
        f"Current Status: {status.replace('_', ' ').title()}\n\n"
        f"You can track progress using your Petition ID: {petition_id}\n\n"
        f"Thank you,\nPetitionAI Team"
    )
    return send_email(to_email, subject, body)