import {TeamDto, CreateTeamDto} from '../dto';
import {CursorPagination} from '@types';
import {PlayerDto} from "@domains/player/dto";

export abstract class ITeamRepository {
    abstract create(createTeamDto: CreateTeamDto): Promise<TeamDto>;

    abstract getAllByDatePaginated(options?: CursorPagination): Promise<TeamDto[]>;

    abstract getPlayers(team_id: string): Promise<PlayerDto[]>

    abstract checkIfExists(teamId: string): Promise<boolean>
}
