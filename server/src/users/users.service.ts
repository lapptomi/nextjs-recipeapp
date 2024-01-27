import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { S3Service } from '../s3/s3.service';
import { validate } from 'class-validator';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private s3Service: S3Service,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = new User();
    user.email = createUserDto.email;
    user.username = createUserDto.username;
    user.password = bcrypt.hashSync(createUserDto.password, 10);

    const errors = await validate(user);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    return this.userRepository.save(user);
  }

  findAll() {
    return this.userRepository.find({
      relations: {
        recipes: {
          author: true,
        },
      },
    });
  }

  async findById(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: {
        recipes: {
          ratings: true,
          author: true,
        },
      },
    });

    return {
      ...user,
      recipes: await this.s3Service.withImages(user.recipes),
    };
  }

  findByEmail(email: string) {
    return this.userRepository.findOneByOrFail({ email });
  }

  deleteAll() {
    return this.userRepository.delete({});
  }
}
