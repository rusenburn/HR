from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm

from ..services.unit_of_work import UnitOfWork0
from ..mappers.user_mapper import UserMapper
from ..services import UsersService, CryptService, UnitOfWork
from ..services.jwt import JwtContainer, JwtService

from ..DTOs.users import UserCreateDTO, UserDTO
from ..DTOs.tokens import TokenDTO
from ..dependencies import get_crypt_service, get_jwt_service, get_unit_of_work, get_unit_of_work_async, get_users_mapper, get_users_service, require_logged_in_user

router = APIRouter(
    prefix="/users",
    tags=["users"],
    responses={404: {"decription": "Not Found"}}
)


@router.post("/register", response_model=UserDTO)
async def register(userCreate: UserCreateDTO,
             uow: UnitOfWork0 = Depends(get_unit_of_work_async),
             user_mapper: UserMapper = Depends(get_users_mapper)
             ):

    user = await uow.users.get_one_by_username_async(userCreate.username)
    if user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)
    user = user_mapper.from_create_to_model(userCreate)
    usersCount =  await uow.users.get_users_count_async()
    # TODO remove this adming logic
    if usersCount == 0:
        user.admin = True
    await uow.users.create_one_async(user)
    await uow.commit_async(user)

    dto = user_mapper.from_model_to_dto(user)
    return dto

@router.post("/login",response_model=TokenDTO)
async def login(form_data: OAuth2PasswordRequestForm = Depends(),
          uow: UnitOfWork0 = Depends(get_unit_of_work_async),
          jwt_service: JwtService = Depends(get_jwt_service),
          crypt_service: CryptService = Depends(get_crypt_service)
          ):
    user = await uow.users.get_one_by_username_async(form_data.username)
    if not user or not crypt_service.is_authenticated_user(user,form_data.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password.",
            headers={"WWW-Authenticate": "Bearer"}
        )
    access_token = jwt_service.create_access_token(data={"sub":user.username,"email":user.email,"admin":user.admin})
    return TokenDTO(access_token=access_token,token_type="bearer")

@router.get("/me",response_model=UserDTO)
async def read_me(jwt:JwtContainer = Depends(require_logged_in_user),uow:UnitOfWork0=Depends(get_unit_of_work_async),user_mapper:UserMapper=Depends(get_users_mapper)):
    user = await uow.users.get_one_by_username_async(jwt.username)
    if user is None:
        raise HTTPException(status_code=400)
    dto = user_mapper.from_model_to_dto(user)
    return dto
