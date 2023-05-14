import {GameDto, CreateGameDto} from '../dto';
import {CursorPagination} from '@types';
import {PlayerGameDataType} from "@prisma/client";
import {PlayerDto} from "@domains/player/dto";

export abstract class IGameRepository {
    abstract create(createGameDto: CreateGameDto): Promise<GameDto>;

    abstract getAllByDatePaginated(options: CursorPagination): Promise<GameDto[]>;

    abstract endGame(gameId: string): Promise<GameDto>

    abstract getGame(game_id: string): Promise<GameDto | undefined>;

    abstract addPlayerGameData(game_id: string, player_id: string, data_type: PlayerGameDataType, data_value?: string): Promise<void>

    abstract getGameLineup(game_id: string,team_id: string): Promise<PlayerDto[]>
    abstract addPoints(game_id: string, team_id: string, points: string): Promise<GameDto>
}

