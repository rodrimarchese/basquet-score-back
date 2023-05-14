import {IsArray, IsDate, IsDateString, IsNotEmpty, IsString, MaxLength} from "class-validator";

export class CreateGameDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(240)
    awayTeamId!: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(240)
    homeTeamId!: string;

    @IsDateString({ strict: true } as any) // Example:  "2023-06-01T18:30:00.000Z"
    @IsNotEmpty()
    date!: Date;
}
