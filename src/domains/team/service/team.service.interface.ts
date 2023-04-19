import {TeamDto, CreateTeamDto} from '../dto';

export abstract class ITeamService {
    abstract create(createTeamDto: CreateTeamDto): Promise<TeamDto>;

    abstract getLatestTeam( options: {
        limit?: number;
        before?: string;
        after?: string
    }): Promise<TeamDto[]>;
}

