import { Global, Module } from '@nestjs/common';
import { prisma } from '@reportwise/database';

//Re-export the existing prisma instance as a provider
export const PRISMA_CLIENT = 'PRISMA_CLIENT';

@Global()
@Module({
    providers: [
        {
            provide: PRISMA_CLIENT,
            useValue: prisma
        }
    ],
    exports: [PRISMA_CLIENT]
})
export class PrismaModule {}