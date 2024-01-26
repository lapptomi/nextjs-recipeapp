import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { S3Service } from 'src/s3/s3.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private s3Service: S3Service,
  ) {}

  create(createUserDto: CreateUserDto) {
    return this.userRepository.save({
      email: createUserDto.email,
      username: createUserDto.username,
      password: bcrypt.hashSync(createUserDto.password, 10),
    });
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
