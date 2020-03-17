import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  getUser(userID): any {
    return { userID };
  }
}
