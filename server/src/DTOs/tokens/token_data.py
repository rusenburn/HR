from pydantic import BaseModel


class TokenDataDTO(BaseModel):
    username: str | None = None
