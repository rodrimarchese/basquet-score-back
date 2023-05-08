import {IGameRepository} from '../repository';
import {CreateGameDto, GameDto} from '../dto';
import {PlayerGameDataType, PrismaClient} from '@prisma/client';
import {CursorPagination} from '@types';
import {NotFoundException} from "@utils";

export class GameRepository implements IGameRepository {
    constructor(private readonly db: PrismaClient) {
    }

    async create(data: CreateGameDto): Promise<GameDto> {
        return await this.db.game.create({
            data,
        }).then(game => new GameDto(game));
    }

    async getAllByDatePaginated(options: CursorPagination): Promise<GameDto[]> {
        const games = await this.db.game.findMany({
            cursor: {
                id: options.after ? options.after : options.before ? options.before : undefined,
            },
            skip: options.after || options.before ? 1 : undefined,
            take: options.limit ? (options.before ? -options.limit : options.limit) : undefined,
            orderBy: [
                {
                    id: 'asc',
                },
            ],
        });
        return games.map(game => new GameDto(game));
    }

    endGame(gameId: string): Promise<GameDto> {
        return this.db.game.update({
            where: {
                id: gameId,
            },
            data: {
                endedAt: new Date(),
            },
        }).then(game => new GameDto(game));
    }

    async getGame(game_id: string): Promise<GameDto | undefined> {
        return this.db.game.findUnique({
            where: {
                id: game_id,
            }
        }).then(game => game ? new GameDto(game) : undefined);
    }

    async addPlayerGameData(gameId: string, playerId: string, data_type: PlayerGameDataType, data_value?: string): Promise<void> {
        const player = await this.db.player.findUnique({
            where: {
                id: playerId,
            }
        })
        if (!player) {
            throw new NotFoundException('Player not found');
        }
        const game = await this.db.game.findUnique({
            where: {
                id: gameId,
            }
        })
        if (!game) {
            throw new NotFoundException('Game not found');
        }
        if (game.endedAt !== null) {
            throw new Error('Game already ended');
        }
        await this.db.playerGameData.create({
            data: {
                data_type,
                data_value,
                gameId,
                playerId
            }
        })
    }

}
