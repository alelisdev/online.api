import { UserDto } from '../../users/dto/userDto';

export interface LoginStatus {
  // username: string;
  success: boolean;
  message?: string;
  user?: any;
  accessToken: any;
  // expiresIn: any;
}
