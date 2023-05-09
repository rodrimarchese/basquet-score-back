import {IsArray, IsDate, IsNotEmpty, IsString, MaxLength} from "class-validator";

export class CreateGameDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(240)
    awayTeamId!: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(240)
    homeTeamId!: string;

    @IsDate()
    @IsNotEmpty()
    date!: Date;
}
