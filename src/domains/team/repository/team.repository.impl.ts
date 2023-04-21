import {ITeamRepository} from '../repository';
import {CreateTeamDto, TeamDto} from '../dto';
import {PrismaClient} from '@prisma/client';
import {CursorPagination} from '@types';
import {ConflictException} from "@utils";

export class TeamRepository implements ITeamRepository {
    constructor(private readonly db: PrismaClient) {
    }

    async create(data: CreateTeamDto): Promise<TeamDto> {
        // Check if team already exists
        const team = await this.db.team.findUnique({
            where: {
                name: data.name,
            }
        })
        if (team) {
            throw new ConflictException('Team already exists');
        }
        return await this.db.team.create({
            data,
        }).then(team => new TeamDto(team));
    }

    async getAllByDatePaginated(options: CursorPagination): Promise<TeamDto[]> {
        const teams = await this.db.team.findMany(options.after || options.before ? {
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
        } : undefined);
        return teams.map(team => new TeamDto(team));
    }
}
