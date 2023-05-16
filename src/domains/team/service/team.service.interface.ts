import {TeamDto, CreateTeamDto} from '../dto';
import {PlayerDto} from "@domains/player/dto";

export abstract class ITeamService {
    abstract create(createTeamDto: CreateTeamDto): Promise<TeamDto>;

    abstract getLatestTeam( options: {
        limit?: number;
        before?: string;
        after?: string
    }): Promise<TeamDto[]>;

    abstract getPlayers(team_id: string): Promise<PlayerDto[]>

    abstract isValidTeam(team_id: string): Promise<boolean>
}

