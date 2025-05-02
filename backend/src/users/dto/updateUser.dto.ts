import {
  MaxLength,
  MinLength,
  Matches,
  IsUrl,
  IsOptional,
} from 'class-validator';

export class UpdateUserDto {
  @MinLength(2)
  @MaxLength(20)
  @IsOptional()
  name: string;

  @MinLength(8)
  @MaxLength(20)
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,20}$/, {
    message: 'newPassword too weak',
  })
  @IsOptional()
  newPassword: string;

  @IsUrl()
  @IsOptional()
  photoURL: string;
}
