import {IPlayerRepository} from ".";
import {CreatePlayerDto, PlayerDto} from "../dto";
import {PlayerGameDataType, PrismaClient} from "@prisma/client";
import {CursorPagination} from "@types";
import {PlayerGameStatsDto} from "@domains/player/dto/player-game-stats.dto";

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
        const players = await this.db.player.findMany(
            options.after || options.before
                ? {
                    cursor: {
                        id: options.after
                            ? options.after
                            : options.before
                                ? options.before
                                : undefined,
                    },
                    skip: options.after || options.before ? 1 : undefined,
                    take: options.limit
                        ? options.before
                            ? -options.limit
                            : options.limit
                        : undefined,
                    orderBy: [
                        {
                            createdAt: "desc",
                        },
                        {
                            id: "asc",
                        },
                    ],
                }
                : undefined
        );
        return players.map((player) => new PlayerDto(player));
    }

    async getPlayerGameStats(id: string, game_id: string): Promise<PlayerGameStatsDto> {
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
            points: sumOfPoints
        })
    }
}
