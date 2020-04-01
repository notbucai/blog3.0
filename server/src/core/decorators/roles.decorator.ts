import { SetMetadata } from '@nestjs/common';

export const Roles = (name: string, isAdmin?: boolean) => SetMetadata('roles', { name, isAdmin });