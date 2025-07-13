import { prisma } from "@/lib/prisma";

export interface CreateUserData {
  email: string;
  firstName: string;
  lastName: string;
  googleId?: string;
  provider: string;
  password?: string;
  isAdmin?: boolean;
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  googleId?: string;
  password?: string;
  isAdmin?: boolean;
}

export interface UserWithoutPassword {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  googleId: string | null;
  provider: string;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class UserRepository {
  async findByEmail(email: string): Promise<UserWithoutPassword | null> {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        googleId: true,
        provider: true,
        isAdmin: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  async findById(id: string): Promise<UserWithoutPassword | null> {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        googleId: true,
        provider: true,
        isAdmin: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  async create(data: CreateUserData): Promise<UserWithoutPassword> {
    const user = await prisma.user.create({
      data: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        googleId: data.googleId || null,
        provider: data.provider,
        password: data.password || null,
        isAdmin: false,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        googleId: true,
        provider: true,
        isAdmin: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  async updateByEmail(
    email: string,
    data: UpdateUserData
  ): Promise<UserWithoutPassword | null> {
    const user = await prisma.user.update({
      where: { email },
      data,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        googleId: true,
        provider: true,
        isAdmin: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  async updateById(
    id: string,
    data: UpdateUserData
  ): Promise<UserWithoutPassword | null> {
    const user = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        googleId: true,
        provider: true,
        isAdmin: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  async deleteById(id: string): Promise<void> {
    await prisma.user.delete({
      where: { id },
    });
  }

  async count(): Promise<number> {
    return await prisma.user.count();
  }

  async findMany(options?: {
    skip?: number;
    take?: number;
    orderBy?: { [key: string]: "asc" | "desc" };
  }): Promise<UserWithoutPassword[]> {
    const users = await prisma.user.findMany({
      ...options,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        googleId: true,
        provider: true,
        isAdmin: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return users;
  }
}

// Export a singleton instance
export const userRepository = new UserRepository();
