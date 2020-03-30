import { SetMetadata } from '@nestjs/common';

export const Roles = (name: string) => SetMetadata('roles', { name });