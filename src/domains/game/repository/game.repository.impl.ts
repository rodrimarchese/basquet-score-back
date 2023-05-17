import {IGameRepository} from '../repository';
import {CreateGameDto, GameDto} from '../dto';
import {PlayerGameDataType, PrismaClient} from '@prisma/client';
import {OffsetPagination} from '@types';
import {NotFoundException, ValidationException} from "@utils";
import {PlayerDto} from "@domains/player/dto";
import {offsetPaginatedResponse} from "@utils/cursor_pagination";

export class GameRepository implements IGameRepository {
    constructor(private readonly db: PrismaClient) {
    }

    async create(data: CreateGameDto): Promise<GameDto> {
        if (data.homeTeamId === data.awayTeamId || !data.homeTeamId || !data.awayTeamId) {
            throw new ValidationException([{game: 'Home team and away team cannot be the same'}]);
        }
        const game = await this.db.game.findFirst({
            where: {
                OR: [
                    {
                        homeTeamId: data.homeTeamId,
                        awayTeamId: data.awayTeamId,
                    },
                    {
                        homeTeamId: data.awayTeamId,
                        awayTeamId: data.homeTeamId,
                    }
                ],
                endedAt: null,
            }
        })
        if (game) {
            throw new ValidationException([{game: 'Game already exists'}]);
        }
        return await this.db.game.create({
            data,
        }).then(game => new GameDto(game));
    }

    async getAllByDatePaginated(options?: OffsetPagination): Promise<GameDto[]> {
        const games = await this.db.game.findMany({
            ...offsetPaginatedResponse(options),
            include: {
                homeTeam: true,
                awayTeam: true,
            }
        });
        return games.map(game => new GameDto({
            ...game,
            homeTeamName: game.homeTeam.name,
            awayTeamName: game.awayTeam.name,
        }))
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
        if (!player.teamId) {
            throw new NotFoundException('Player team not found');
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
                teamId: player.teamId,
                data_type,
                data_value,
                gameId,
                playerId
            }
        })
    }

    async getGameLineup(game_id: string, team_id: string): Promise<PlayerDto[]> {
        const subbedOutPlayers = await this.db.playerGameData.findMany({
            where: {
                gameId: game_id,
                teamId: team_id,
                data_type: PlayerGameDataType.SUBBED_OUT
            }
        })
        const subbedInPlayers = await this.db.playerGameData.findMany({
            where: {
                gameId: game_id,
                teamId: team_id,
                data_type: PlayerGameDataType.SUBBED_IN
            }
        })
        const subbedOutPlayerIds = subbedOutPlayers.map(player => player.playerId)
        const formation = subbedInPlayers.filter(player => !subbedOutPlayerIds.includes(player.playerId))
        return this.db.player.findMany({
            where: {
                id: {
                    in: formation.map(player => player.playerId)
                }
            }
        })
    }

    async addPoints(game_id: string, player_id: string, points: string): Promise<GameDto> {
        const player = await this.db.player.findUnique({
            where: {
                id: player_id,
            }
        })
        if (!player) {
            throw new NotFoundException('Player not found');
        }
        if (!player.teamId) {
            throw new NotFoundException('Player team not found');
        }
        const game = await this.db.game.findUnique({
            where: {
                id: game_id,
            }
        })
        if (!game) {
            throw new NotFoundException('Game not found');
        }
        if (game.endedAt !== null) {
            throw new Error('Game already ended');
        }
        if (game.awayTeamId === player.teamId) {
            return this.db.game.update({
                where: {
                    id: game_id,
                },
                data: {
                    awayScore: {
                        increment: parseInt(points)
                    }
                }
            })
        } else if (game.homeTeamId === player.teamId) {
            return this.db.game.update({
                where: {
                    id: game_id,
                },
                data: {
                    homeScore: {
                        increment: parseInt(points)
                    }
                }
            })
        } else {
            throw new Error('Player not in game');
        }
    }

    getGameCount(): Promise<number> {
        return this.db.game.count();
    }

    async getActiveGames(options: OffsetPagination): Promise<GameDto[]> {
        const games = await this.db.game.findMany({
            ...offsetPaginatedResponse(options),
            where: {
                endedAt: null,
            },
            include: {
                homeTeam: true,
                awayTeam: true,
            }
        });
        return games.map(game => new GameDto({
            ...game,
            homeTeamName: game.homeTeam.name,
            awayTeamName: game.awayTeam.name,
        }))
    }

    async getEndedGames(options: OffsetPagination): Promise<GameDto[]> {
        const games = await this.db.game.findMany({
            ...offsetPaginatedResponse(options),
            where: {
                endedAt: {
                    not: null,
                },
            },
            include: {
                homeTeam: true,
                awayTeam: true,
            }
        });
        return games.map(game => new GameDto({
            ...game,
            homeTeamName: game.homeTeam.name,
            awayTeamName: game.awayTeam.name,
        }))
    }

}

