"""SMS notification service with pluggable provider.

Currently supports a 'console' provider (logs the message) and a 'twilio'
provider. Extend with additional providers as needed.
"""
import logging

from app.config import settings

logger = logging.getLogger("petitionai.sms")


def send_sms(to_phone: str, message: str) -> bool:
    provider = settings.SMS_PROVIDER.lower()

    if provider == "twilio":
        return _send_via_twilio(to_phone, message)

    logger.info("[SMS] (%s) To=%s: %s", provider, to_phone, message)
    return True


def _send_via_twilio(to_phone: str, message: str) -> bool:
    try:
        from twilio.rest import Client

        client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
        client.messages.create(
            to=to_phone,
            from_=settings.TWILIO_FROM_NUMBER,
            body=message,
        )
        logger.info("[SMS] Sent via Twilio to %s", to_phone)
        return True
    except Exception as exc:  # pragma: no cover
        logger.error("[SMS] Twilio send failed to %s: %s", to_phone, exc)
        return False


def send_complaint_sms(to_phone: str, petition_id: str, status: str) -> bool:
    message = (
        f"PetitionAI: Your petition {petition_id} status is now "
        f"'{status.replace('_', ' ').title()}'. Track with your Petition ID. "
        f"- PetitionAI"
    )
    return send_sms(to_phone, message)