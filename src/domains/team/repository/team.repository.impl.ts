import {ITeamRepository} from '../repository';
import {CreateTeamDto, TeamDto} from '../dto';
import {PrismaClient} from '@prisma/client';
import {CursorPagination} from '@types';

export class TeamRepository implements ITeamRepository {
    constructor(private readonly db: PrismaClient) {
    }

    async create(data: CreateTeamDto): Promise<TeamDto> {
        return await this.db.team.create({
            data,
        }).then(team => new TeamDto(team));
    }

    async getAllByDatePaginated(options: CursorPagination): Promise<TeamDto[]> {
        const teams = await this.db.team.findMany({
            cursor: {
                id: options.after ? options.after : options.before ? options.before : undefined,
            },
            skip: options.after || options.before ? 1 : undefined,
            take: options.limit ? (options.before ? -options.limit : options.limit) : undefined,
            orderBy: [
                {
                    createdAt: 'desc',
                },
                {
                    id: 'asc',
                },
            ],
        });
        return teams.map(team => new TeamDto(team));
    }
}
