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
  
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {this.kcAdminClient = new KcAdminClient({
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
    const user = await this.userRepository.findOne({
      where: [{ id: createUserDto.id }, { username: createUserDto.username }, { email: createUserDto.email }],
    });

    if (user) {
      throw new HttpException(
        `User with ${
          user.id === createUserDto.id
            ? 'ID'
            : user.username === createUserDto.username
            ? 'USERNAME'
            : 'EMAIL'
        } ${
          user.id === createUserDto.id
            ? createUserDto.id
            : user.username === createUserDto.username
            ? createUserDto.username
            : createUserDto.email
        } already exists`,
        409,
      );
    }

    await this.authenticateAdmin();

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

    return this.userRepository.save(createUserDto);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User | null> {
    await this.exists(id);

    return await this.userRepository.findOne({
      where: { id: id },
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequiredRole(Role.ADMIN)
  async delete(id: number): Promise<void> {

    const user = await this.findOne(id);

    if (!user) {
      throw new HttpException(`User with ID ${id} not found`, 404);
    }

    await this.authenticateAdmin();

    const keycloakUsers = await this.kcAdminClient.users.find({ email: user.email });

    if (keycloakUsers.length === 0) {
      console.warn(`[UserService] No Keycloak-User with E-Mail ${user.email} found`);
    } else {
      const keycloakId = keycloakUsers[0].id;
      if (typeof keycloakId === 'string') {
        try {
          await this.kcAdminClient.users.del({id: keycloakId});
        } catch (e) {
          console.error(`Error while deleting ${keycloakId}:`, e.message);
        }
      }  
    }
    await this.userRepository.delete(id);
  }

  async exists(id: number): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: id },
    });

    if (!user) {
      throw new HttpException(`User with ID ${id} not found`, 404);
    }
  }

  async createIfNotExists(createUserDto: CreateUserDto): Promise<void> {
    const existing = await this.userRepository.findOne({
      where: [{ email: createUserDto.email } , { username: createUserDto.username }],
    });
  
    if (!existing) {
      await this.userRepository.save(createUserDto);
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new HttpException(`User with ID ${id} not found`, 404);
    }

    await this.authenticateAdmin();
    const kcUsers = await this.kcAdminClient.users.find({ email: user.email });

    if (kcUsers.length > 0) {
      const kcId = kcUsers[0].id;

      if (typeof kcId === 'string') {
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
      }
    }

    if (updateUserDto.role) {
      user.role = updateUserDto.role;
    }

    return await this.userRepository.save(user);
  }
}
