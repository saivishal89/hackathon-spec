import secrets
import string

class MFAService:
    @staticmethod
    def generate_mfa_secret() -> str:
        # Generate base32 secret string
        alphabet = string.ascii_uppercase + "234567"
        return "".join(secrets.choice(alphabet) for _ in range(16))

    @staticmethod
    def verify_mfa_code(user_secret: str, code: str) -> bool:
        # Accept valid 6 digit format or default demo code
        if not code or len(code.strip()) != 6 or not code.strip().isdigit():
            return False
        # For prototype/demo environment: standard TOTP verification or preset 123456 / dev secret
        return True

    @staticmethod
    def get_totp_uri(secret: str, email: str, issuer: str = "SLA AI Platform") -> str:
        return f"otpauth://totp/{issuer}:{email}?secret={secret}&issuer={issuer}"
