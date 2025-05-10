import { HttpException, Injectable, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role, User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import KcAdminClient from 'keycloak-admin';
import { JwtAuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { RequiredRole } from 'src/common/decorators/roles.decorator';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  private kcAdminClient: KcAdminClient;
  
  constructor() {this.kcAdminClient = new KcAdminClient({
    baseUrl: 'http://keycloak:8080',
    realmName: process.env.KEYCLOAK_REALM,
    });
  }
  
  private async authenticateAdmin() {
    await this.kcAdminClient.auth({
      username: process.env.KEYCLOAK_ADMIN,
      password: process.env.KEYCLOAK_ADMIN_PASSWORD,
      grantType: 'password',
      clientId: 'admin-cli',
    });
  }
  

  async create(createUserDto: CreateUserDto): Promise<User> {
    await this.authenticateAdmin();

    const existing = await this.kcAdminClient.users.find({
      username: createUserDto.username,
    });

    if (existing.length > 0) {
      throw new HttpException(`User already exists`, 409);
    }

    const created = await this.kcAdminClient.users.create({
      username: createUserDto.username,
      email: createUserDto.email,
      enabled: true,
    });

    if (createUserDto.password) {
      await this.kcAdminClient.users.resetPassword({
        id: created.id!,
        credential: {
          temporary: false,
          type: 'password',
          value: createUserDto.password,
        },
      });
    }

    if (createUserDto.role) {
      const targetRole = await this.kcAdminClient.roles.findOneByName({ name: createUserDto.role });
      if (targetRole && targetRole.id && targetRole.name) {
        await this.kcAdminClient.users.addRealmRoleMappings({
          id: created.id!,
          roles: [{ id: targetRole.id, name: targetRole.name }],
        });
      } else {
        throw new HttpException(`Role ${createUserDto.role} not found in Keycloak`, 404);
      }
    }

    const kcUser = await this.kcAdminClient.users.findOne({ id: created.id! });
    const roles = await this.kcAdminClient.users.listRealmRoleMappings({ id: created.id! });
    const roleNames = roles.map(role => role.name);
    const relevantRole = roleNames.find(r => r === 'ADMIN' || r === 'USER') as Role || Role.USER;
  
    const mappedUser: User = {
      id: kcUser.id!,
      username: kcUser.username || '',
      email: kcUser.email || '',
      role: relevantRole,
    };
  
    return mappedUser;
  }

  async findAll(): Promise<User[]> {
    await this.authenticateAdmin();
  
    const kcUsers = await this.kcAdminClient.users.find();
  
    const users: User[] = await Promise.all(
      kcUsers.map(async (kcUser) => {
        const roles = await this.kcAdminClient.users.listRealmRoleMappings({ id: kcUser.id! });
        const roleNames = roles.map(role => role.name);
        const relevantRole = roleNames.find(r => r === 'ADMIN' || r === 'USER');
  
        return {
          id: kcUser.id!,
          username: kcUser.username || '',
          email: kcUser.email || '',
          role: relevantRole as Role || Role.USER,
        };
      })
    );
  
    return users;
  }

  async findOne(id: string): Promise<User> {
    await this.authenticateAdmin();
  
    const kcUser = await this.kcAdminClient.users.findOne({ id });
  
    if (!kcUser || !kcUser.id) {
      throw new HttpException(`User with ID ${id} not found`, 404);
    }
  
    const roles = await this.kcAdminClient.users.listRealmRoleMappings({ id: kcUser.id });
    const roleNames = roles.map(role => role.name);
    const relevantRole = roleNames.find(r => r === 'ADMIN' || r === 'USER') as Role || Role.USER;
  
    const mappedUser: User = {
      id: kcUser.id,
      username: kcUser.username || '',
      email: kcUser.email || '',
      role: relevantRole,
    };
  
    return mappedUser;
  }
  
  async delete(kcId: string): Promise<void> {
    await this.authenticateAdmin();
    await this.kcAdminClient.users.del({ id: kcId });
  }

  async exists(id: string): Promise<void> {
    await this.authenticateAdmin();

    try {
      const user = await this.kcAdminClient.users.findOne({ id });
  
      if (!user || !user.id) {
        throw new HttpException(`User with ID ${id} not found`, 404);
      }
    } catch (error) {
      throw new HttpException(`User with ID ${id} not found`, 404);
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    await this.authenticateAdmin();
    const users = await this.kcAdminClient.users.find({ email });
  
    if (users.length === 0) {
      return null;
    }
  
    const kcUser = users[0];
  
    const roles = await this.kcAdminClient.users.listRealmRoleMappings({ id: kcUser.id! });
    const roleNames = roles.map(role => role.name);
    const relevantRole = roleNames.find(r => r === 'ADMIN' || r === 'USER') as Role || Role.USER;
  
    const mappedUser: User = {
      id: kcUser.id!,
      username: kcUser.username || '',
      email: kcUser.email || '',
      role: relevantRole,
    };
  
    return mappedUser;
  }

  async update(kcId: string, updateUserDto: UpdateUserDto): Promise<User> {
    await this.authenticateAdmin();

    if (updateUserDto.password) {
      await this.kcAdminClient.users.resetPassword({
        id: kcId,
        credential: {
        temporary: false,
        type: 'password',
          value: updateUserDto.password,
        },
      });
    }

    if (updateUserDto.role) {
      const realmRoles = await this.kcAdminClient.users.listRealmRoleMappings({ id: kcId });

      const rolesToRemove = realmRoles.filter(role => role.name === 'ADMIN' || role.name === 'USER');
      if (rolesToRemove.length > 0) {
        await this.kcAdminClient.users.delRealmRoleMappings({ id: kcId, roles: rolesToRemove.map(role => ({ id: role.id!, name: role.name! })) });
      }

      const targetRole = await this.kcAdminClient.roles.findOneByName({ name: updateUserDto.role });
      if (targetRole && targetRole.id && targetRole.name) {
        await this.kcAdminClient.users.addRealmRoleMappings({
          id: kcId,
          roles: [{ id: targetRole.id as string, name: targetRole.name }],
        });
      } else {
        throw new HttpException(`Role ${updateUserDto.role} not found in Keycloak`, 404);
      }
    }
    const kcUser = await this.kcAdminClient.users.findOne({ id: kcId });

    const roles = await this.kcAdminClient.users.listRealmRoleMappings({ id: kcId });
    const roleNames = roles.map(role => role.name);
    const relevantRole = roleNames.find(r => r === 'ADMIN' || r === 'USER') as Role || Role.USER;
  
    const mappedUser: User = {
      id: kcUser.id!,
      username: kcUser.username || '',
      email: kcUser.email || '',
      role: relevantRole,
    };
  
    return mappedUser;
  }
}
