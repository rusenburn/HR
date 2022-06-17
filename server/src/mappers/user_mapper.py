from models import User
from DTOs.users import UserDTO,UserCreateDTO
from services import CryptService
class UserMapper:
    def __init__(self,crypt_service:CryptService) -> None:
        self._crypt_service = crypt_service
    
    def from_model_to_dto(self,user:User)->UserDTO:
        dto = UserDTO(username=user.username,email=user.email)
        return dto

    def from_create_to_model(self,user:UserCreateDTO)->User:
        model = User()
        model.username = user.username 
        model.hashed_password = self._crypt_service.get_password_hash(user.password)
        model.email = user.email
        return model