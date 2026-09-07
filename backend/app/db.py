import socket
import struct
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from app.config import get_settings

# Ensure resilient DNS resolution for cloud DB endpoints (e.g. Neon) behind restrictive ISP DNS
_orig_getaddrinfo = socket.getaddrinfo

def _fallback_getaddrinfo(host, port, family=0, type=0, proto=0, flags=0):
    try:
        return _orig_getaddrinfo(host, port, family, type, proto, flags)
    except socket.gaierror:
        try:
            packet = b'\x12\x34\x01\x00\x00\x01\x00\x00\x00\x00\x00\x00'
            for part in str(host).split('.'):
                packet += bytes([len(part)]) + part.encode('ascii')
            packet += b'\x00\x00\x01\x00\x01'
            sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            sock.settimeout(4.0)
            sock.sendto(packet, ('8.8.8.8', 53))
            data, _ = sock.recvfrom(2048)
            sock.close()

            i = 12
            while data[i] != 0:
                i += 1 + data[i]
            i += 5
            while i < len(data):
                if (data[i] & 0xC0) == 0xC0:
                    i += 2
                else:
                    while data[i] != 0:
                        i += 1 + data[i]
                    i += 1
                rtype, rclass, ttl, rdlen = struct.unpack('!HHIH', data[i:i+10])
                i += 10
                if rtype == 1 and rdlen == 4:
                    ip = socket.inet_ntoa(data[i:i+4])
                    return [(socket.AF_INET, socket.SOCK_STREAM, 6, '', (ip, port))]
                i += rdlen
        except Exception:
            pass
        raise

socket.getaddrinfo = _fallback_getaddrinfo

settings = get_settings()

engine = create_async_engine(settings.DATABASE_URL, echo=False, pool_pre_ping=True)

AsyncSessionLocal = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


async def get_db():
    """FastAPI dependency that yields an async database session."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
