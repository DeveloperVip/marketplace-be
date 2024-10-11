import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './domain/users.entity';
import { Repository } from 'typeorm';
import { isDefined } from 'class-validator';

@Injectable()
export class UserServices {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  public async findOrCreateUser(userAddress: string): Promise<string> {
    const user: UserEntity = await this.userRepository.findOne({
      where: { address: userAddress },
    });
    if (!isDefined(user)) {
      const newUser = await this.userRepository.save({
        address: userAddress,
        create_at: new Date(),
        update_at: new Date(),
      });
      return newUser.id
    }
    return user.id
  }
  public async getUserByAddress(userAddress: string): Promise<UserEntity> {
    return await this.userRepository.findOne({ where: { address: userAddress } });
  }
  public async getUserById(userId: string): Promise<UserEntity> {
    return await this.userRepository.findOne({ where: { address: userId } });
  }
}
