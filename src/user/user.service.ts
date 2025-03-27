import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { username: createUserDto.username },
    });

    if (user) {
      throw new HttpException(
        `User with username ${createUserDto.username} already exists`,
        409,
      );
    }

    return this.userRepository.save(createUserDto);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { id: id },
    });

    if (!user) {
      throw new HttpException(`User with userId ${id} not found`, 404);
    }

    return user;
  }

  async delete(id: number): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: id },
    });

    if (!user) {
      throw new HttpException(`User with userId ${id} not found`, 404);
    }

    await this.userRepository.delete(id);
  }
}
