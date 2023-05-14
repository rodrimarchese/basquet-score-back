import {ITeamRepository} from '../repository';
import {CreateTeamDto, TeamDto} from '../dto';
import {PrismaClient} from '@prisma/client';
import {CursorPagination} from '@types';
import {ConflictException} from "@utils";
import {PlayerDto} from "@domains/player/dto";
import {paginatedResponse} from "@utils/cursor_pagination";

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
        const teams = await this.db.team.findMany({
            ...paginatedResponse(options)
        });
        return teams.map(team => new TeamDto(team));
    }

    getPlayers(team_id: string): Promise<PlayerDto[]> {
        return this.db.player.findMany({
            where: {
                teamId: team_id
            }
        }).then(players => players.map(player => new PlayerDto(player)));
    }
}
