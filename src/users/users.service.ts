import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './users.model';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { name, email, password } = createUserDto;
    const existingUser = await this.userModel.findOne({ where: { email } });
    if (existingUser) {
      throw new Error('El email ya está registrado');
    }
    const hashedPassword = await User.hashPassword(password);
    const user = await this.userModel.create({name: name, email: email, password: hashedPassword});

    const { password: _, ...userSinPassword } = user.toJSON();
    return userSinPassword;
    
  }

  async getUsers(page: number = 1, limit: number = 10): Promise<User[]> {
    const offset = (page - 1) * limit;

    return this.userModel.findAll({
      limit,
      offset,
      attributes: { exclude: ['password'] },
    });
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.userModel.findOne({
      where: { id },
      attributes: { exclude: ['password'] },
    });
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    return user;
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userModel.findByPk(id);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    user.name = updateUserDto.name || user.name;
    user.email = updateUserDto.email || user.email;
    if (updateUserDto.password) {
      user.password = await User.hashPassword(updateUserDto.password);
    }

    await user.save();
    const { password: _, ...userSinPassword } = user.toJSON();
    return userSinPassword;
  }

  async deleteUser(id: number): Promise<void> {
    const user = await this.userModel.findByPk(id);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    await user.destroy();
  }
}
