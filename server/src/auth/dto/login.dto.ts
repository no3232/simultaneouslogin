import { User } from '@prisma/client';

// Prisma가 생성한 타입을 그대로 사용
export type LoginDto = Pick<User, 'userid' | 'password'>;
