import { User } from '../users/entity/userEntity';
import { UserDto } from '../users/dto/userDto';

export const toUserDto = (data: User): UserDto => {
  const { id, username, email, role, status, avatar, background } = data;
  const userDto: UserDto = {
    id,
    username,
    email,
    role,
    status,
    avatar,
    background,
  };
  if (avatar) {
    userDto['avatar'] = `${process.env.SERVER_URL}/uploads/${avatar}`;
  }
  if (background) {
    userDto['background'] = `${process.env.SERVER_URL}/uploads/${background}`;
  }
  return userDto;
};
