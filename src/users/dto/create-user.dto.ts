import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Se requiere el nombre' })
  name: string;

  @IsEmail({}, { message: 'Email invalido' })
  email: string;

  @IsNotEmpty({ message: 'se requiere la contraseña' })
  @MinLength(6, { message: 'la contraseña debe ser de almenos 6 caracteres' })
  password: string;
}