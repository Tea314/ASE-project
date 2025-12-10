from fastapi import HTTPException


class UserAlreadyExistsException(HTTPException):
    def __init__(self, email: str):
        super().__init__(
            status_code=409, detail=f"User with email '{email}' already exists."
        )


class InvalidCredentialsException(HTTPException):
    def __init__(self):
        super().__init__(status_code=401, detail="Invalid email or password.")


class PermissionException(HTTPException):
    def __init__(
        self, message: str = "You do not have permission to perform this action."
    ):
        super().__init__(status_code=403, detail=message)
