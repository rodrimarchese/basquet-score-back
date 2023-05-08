import {IsEnum, IsNotEmpty, IsString, MaxLength} from "class-validator";
import {PlayerGameDataType} from "@prisma/client";

export class PlayerActionDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(240)
    playerId!: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(240)
    gameId!: string;


    @IsEnum(PlayerGameDataType)
    data_type!: PlayerGameDataType;
}
