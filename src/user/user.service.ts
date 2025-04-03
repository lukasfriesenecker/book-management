import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({
      where: [{ id: createUserDto.id }, { username: createUserDto.username }],
    });

    if (user) {
      throw new HttpException(
        `User with ${user.id === createUserDto.id ? 'ID' : 'USERNAME'} ${user.id === createUserDto.id ? createUserDto.id : createUserDto.username} already exists`,
        409,
      );
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

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User | null> {
    await this.exists(id);

    await this.userRepository.update(id, updateUserDto);

    return this.userRepository.findOne({ where: { id: id } });
  }

  async delete(id: number): Promise<void> {
    await this.exists(id);

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
}
