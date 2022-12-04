import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Profile } from './profile.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateProfileDto } from './dto/create-profile.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
  ) {}

  async getUsers() {
    return await this.userRepository.find();
  }

  async getUser(id: number) {
    const userFound = await this.userRepository.findOne({
      where: { id },
      relations: ['posts', 'profile'],
    });

    if (!userFound) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return userFound;
  }

  async createUser(user: CreateUserDto) {
    const userFound = await this.userRepository.findOne({
      where: {
        username: user.username,
      },
    });

    if (userFound) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }

    const newUser = this.userRepository.create(user);
    return this.userRepository.save(newUser);
  }

  async updateUser(id: number, user: UpdateUserDto) {
    const userFound = await this.userRepository.findOne({
      where: { id },
    });

    if (!userFound) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const updatedUser = Object.assign(userFound, user);

    return await this.userRepository.save(updatedUser);
  }

  async deleteUser(id: number) {
    const userFound = await this.userRepository.findOne({
      where: { id },
    });

    if (!userFound) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return await this.userRepository.delete(id);
  }

  async createProfile(id: number, profile: CreateProfileDto) {
    const userFound = await this.userRepository.findOne({
      where: { id },
    });

    if (!userFound) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const newProfile = this.profileRepository.create(profile);

    const savedProfile = await this.profileRepository.save(newProfile);

    userFound.profile = savedProfile;

    return await this.userRepository.save(userFound);
  }
}
