from cryptography.hazmat.primitives.ciphers.aead import AESGCM
import base64, os
from scams_backend.core.config import settings


def encrypt_data(plain_text: str) -> str:
    aes_key = base64.urlsafe_b64decode(settings.AES_KEY)
    aesgcm = AESGCM(aes_key)
    nonce = os.urandom(12)
    cipher_text = aesgcm.encrypt(nonce, plain_text.encode(), None)
    return base64.urlsafe_b64encode(nonce + cipher_text).decode()


def decrypt_data(cipher_text: str) -> str:
    aes_key = base64.urlsafe_b64decode(settings.AES_KEY)
    aesgcm = AESGCM(aes_key)
    data = base64.urlsafe_b64decode(cipher_text)
    nonce = data[:12]
    ct = data[12:]
    plain_text = aesgcm.decrypt(nonce, ct, None)
    return plain_text.decode()
