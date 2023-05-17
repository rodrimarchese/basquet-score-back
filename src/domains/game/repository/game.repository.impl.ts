import {IGameRepository} from '../repository';
import {CreateGameDto, GameDto} from '../dto';
import {PlayerGameDataType, PrismaClient} from '@prisma/client';
import {CursorPagination} from '@types';
import {NotFoundException} from "@utils";
import {PlayerDto} from "@domains/player/dto";
import {paginatedResponse} from "@utils/cursor_pagination";
import {TeamRepository} from "@domains/team/repository";
import {PlayerRepository} from "@domains/player/repository";
import {GameAllInfoDto} from "@domains/game/dto/game-all-info.dto";
import {PlayerGameStatsDto} from "@domains/player/dto/player-game-stats.dto";

export class GameRepository implements IGameRepository {
    constructor(private readonly db: PrismaClient) {
    }

    async create(data: CreateGameDto): Promise<GameDto> {
        return await this.db.game.create({
            data,
        }).then(game => new GameDto(game));
    }

    async getAllByDatePaginated(options?: CursorPagination): Promise<GameDto[]> {
        const games = await this.db.game.findMany({
            ...paginatedResponse(options)
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
        if (!player.teamId){
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

    async getGameLineup(game_id: string,team_id: string): Promise<PlayerDto[]> {
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
        if (!player.teamId){
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
        if (game.awayTeamId === player.teamId){
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
        } else if (game.homeTeamId === player.teamId){
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

    async getAllInfo(game_id: string): Promise<GameAllInfoDto> {
        const game = await this.getGame(game_id)
        if(!game){
            throw new Error('Game not valid');
        }

        const homeTeam = await this.db.team.findUnique({
            where: {
                id: game.homeTeamId,
            }
        })

        if(!homeTeam){
            throw new Error('Team not valid');
        }

        const awayTeam = await this.db.team.findUnique({
            where: {
                id: game.awayTeamId,
            }
        })

        if(!awayTeam){
            throw new Error('Team not valid');
        }
        const teamRepository = new TeamRepository(this.db)
        const playersOfHomeTeam = await teamRepository.getPlayers(homeTeam.id)
        const playersOfAwayTeam = await  teamRepository.getPlayers(awayTeam.id)
        const playersHomeTeamWithInfo = await this.getPlayersByIds(playersOfHomeTeam, game)
        const playersAwayTeamWithInfo = await this.getPlayersByIds(playersOfAwayTeam, game)
       return new GameAllInfoDto(
           game,
           homeTeam,
           awayTeam,
           playersHomeTeamWithInfo,
           playersAwayTeamWithInfo
       )
    }

    async getPlayersByIds(players: PlayerDto[], game: GameDto): Promise<PlayerGameStatsDto[]> {
        const playerRepository = new PlayerRepository(this.db)
        const playerPromise =players.map((player) => {
            return playerRepository.getPlayerGameStats(player.id, game.id)
        })
        return await Promise.all(playerPromise)
    }
}

