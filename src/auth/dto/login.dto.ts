import { IsEmail, IsNotEmpty} from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Email invalido' })
  email: string;

  @IsNotEmpty({ message: 'se requiere la contraseña' })
  password: string;
}