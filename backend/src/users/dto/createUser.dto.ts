import {
  IsEmail,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsAlpha,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(20)
  @IsAlpha()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,20}$/, {
    message: 'password too weak',
  })
  password: string;
}
