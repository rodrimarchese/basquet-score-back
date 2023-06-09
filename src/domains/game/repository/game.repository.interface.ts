import {GameDto, CreateGameDto} from '../dto';
import {OffsetPagination} from '@types';
import {PlayerGameDataType} from "@prisma/client";
import {PlayerDto} from "@domains/player/dto";
import {GameAllInfoDto} from "@domains/game/dto/game-all-info.dto";

export abstract class IGameRepository {
    abstract create(createGameDto: CreateGameDto): Promise<GameDto>;

    abstract getAllByDatePaginated(options?: OffsetPagination): Promise<GameDto[]>;

    abstract endGame(gameId: string): Promise<GameDto>

    abstract getGame(game_id: string): Promise<GameDto | undefined>;

    abstract addPlayerGameData(game_id: string, player_id: string, data_type: PlayerGameDataType, data_value?: string): Promise<void>

    abstract getGameLineup(game_id: string,team_id: string): Promise<PlayerDto[]>
    abstract addPoints(game_id: string, team_id: string, points: string): Promise<GameDto>
    abstract getAllInfo(game_id: string): Promise<GameAllInfoDto>


    abstract getGameCount() : Promise<number>
    abstract getActiveGameCount() : Promise<number>
    abstract getEndedGameCount() : Promise<number>

    abstract getActiveGames(options: OffsetPagination): Promise<GameDto[]>
    abstract getEndedGames(options: OffsetPagination): Promise<GameDto[]>

}

