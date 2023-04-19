import {TeamDto, CreateTeamDto} from '../dto';
import {ITeamService} from '../service';
import {ITeamRepository} from '../repository';
import {CursorPagination} from "@types";

export class TeamService implements ITeamService {
    constructor(private readonly teamRepository: ITeamRepository) {
    }

    async create(createTeamDto: CreateTeamDto): Promise<TeamDto> {
        return await this.teamRepository.create(createTeamDto);
    }

    getLatestTeam( options: CursorPagination): Promise<TeamDto[]> {
        return this.teamRepository.getAllByDatePaginated(options);
    }
}
