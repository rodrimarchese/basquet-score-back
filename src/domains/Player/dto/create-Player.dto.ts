import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

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
    position! : string;

    @IsString()
    @IsNotEmpty()
    shirtNum! :string ;


    @IsString()
    @IsNotEmpty()
    shirtNum! :string ;
}
