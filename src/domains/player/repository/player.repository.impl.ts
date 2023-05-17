import {IPlayerRepository} from ".";
import {CreatePlayerDto, PlayerDto} from "../dto";
import {PlayerGameDataType, PrismaClient} from "@prisma/client";
import {CursorPagination} from "@types";
import {PlayerGameStatsDto} from "@domains/player/dto/player-game-stats.dto";
import {paginatedResponse} from "@utils/cursor_pagination";
import {NotFoundException} from "@utils";

export class PlayerRepository implements IPlayerRepository {
    constructor(private readonly db: PrismaClient) {
    }

    async create(data: CreatePlayerDto): Promise<PlayerDto> {
        return await this.db.player
            .create({
                data,
            })
            .then((player) => new PlayerDto(player));
    }

    async getAllByDatePaginated(options: CursorPagination): Promise<PlayerDto[]> {
        const players = await this.db.player.findMany({
            ...paginatedResponse(options)
        });
        return players.map((player) => new PlayerDto(player));
    }

    async getPlayerGameStats(id: string, game_id: string): Promise<PlayerGameStatsDto> {
        const player = await this.db.player.findUnique({
            where: {
                id: id
            }
        })
        if (!player) {
            throw new NotFoundException('Player not found');
        }
        const points = await this.db.playerGameData.findMany({
            where: {
                playerId: id,
                gameId: game_id,
                data_type: PlayerGameDataType.SCORE_GOAL
            },
        })
        const sumOfPoints = points.reduce((a, b) => a + Number(b.data_value), 0)
        const fouls = await this.db.playerGameData.findMany({
            where: {
                playerId: id,
                gameId: game_id,
                data_type: PlayerGameDataType.FOUL
            },
        })
        return new PlayerGameStatsDto({
            player_id: id,
            game_id: game_id,
            fouls: fouls.length,
            points: sumOfPoints,
            player_name: player.name,
            player_surname: player.surname
        })
    }

   async defineTeam(teamId: string, playerId: string): Promise<PlayerDto> {
        return await this.db.player.update({
            where: { id: playerId },
            data: { teamId: teamId },
        })
    }
}
