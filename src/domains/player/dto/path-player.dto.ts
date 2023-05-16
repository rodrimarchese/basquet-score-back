import {IsNotEmpty, IsNumber, IsString, MaxLength} from "class-validator";

export class PatchPlayerDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(240)
    playerId!: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(240)
    teamId!: string;
}