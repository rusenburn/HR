from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from ..mappers.user_mapper import UserMapper
from ..services import UsersService, CryptService, UnitOfWork
from ..services.jwt import JwtService

from ..DTOs.users import UserCreateDTO, UserDTO
from ..DTOs.tokens import TokenDTO
from ..dependencies import get_crypt_service, get_current_user, get_jwt_service, get_unit_of_work, get_users_mapper, get_users_service

router = APIRouter(
    prefix="/users",
    tags=["users"],
    responses={404: {"decription": "Not Found"}}
)


@router.post("/register", response_model=UserDTO)
def register(userCreate: UserCreateDTO = Depends(),
             uow: UnitOfWork = Depends(get_unit_of_work),
             user_mapper: UserMapper = Depends(get_users_mapper)
             ):

    user = uow.users.get_one_by_username(userCreate.username)
    if user:
        return HTTPException(status_code=status.HTTP_400_BAD_REQUEST)
    user = user_mapper.from_create_to_model(userCreate)
    uow.users.create_one(user)
    uow.commit_refresh([user])

    dto = user_mapper.from_model_to_dto(user)
    return dto

@router.post("/login",response_model=TokenDTO)
def login(form_data: OAuth2PasswordRequestForm = Depends(),
          uow: UnitOfWork = Depends(get_unit_of_work),
          jwt_service: JwtService = Depends(get_jwt_service),
          crypt_service: CryptService = Depends(get_crypt_service)
          ):
    user = uow.users.get_one_by_username(form_data.username)
    if not user or not crypt_service.is_authenticated_user(user,form_data.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password.",
            headers={"WWW-Authenticate": "Bearer"}
        )
    access_token = jwt_service.create_access_token(data={"sub":user.username,"email":user.email,"admin":user.admin})
    return TokenDTO(access_token=access_token,token_type="bearer")

@router.get("/me",response_model=UserDTO)
def read_me(current_user:str = Depends(get_current_user),user_service:UsersService=Depends(get_users_service),user_mapper:UserMapper=Depends(get_users_mapper)):
    if current_user is None:
        raise HTTPException(status_code=401)
    user = user_service.get_one_by_username(current_user)
    if user is None:
        raise HTTPException(status_code=401)
    dto = user_mapper.from_model_to_dto(user)
    return dto
