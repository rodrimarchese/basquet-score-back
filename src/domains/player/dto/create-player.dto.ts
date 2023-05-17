import { IsNotEmpty, IsString, MaxLength, IsNumber } from "class-validator";

export class CreatePlayerDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(240)
  name!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(240)
  surname!: string;

  @IsString()
  @IsNotEmpty()
  position!: string;

  @IsNumber()
  @IsNotEmpty()
  shirtNum!: number;

  teamId?: string;
}
