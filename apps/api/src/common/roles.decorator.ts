import { SetMetadata } from '@nestjs/common';
import { Role } from '@reportwise/shared';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
