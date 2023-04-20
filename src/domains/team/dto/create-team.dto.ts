import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateTeamDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(240)
    name!: string;

    @IsOptional()
    @MaxLength(4)
    images?: string[];
}
