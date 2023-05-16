import {PlayerDto, CreatePlayerDto} from '../dto';
import {CursorPagination} from '@types';
import {PlayerGameStatsDto} from "@domains/player/dto/player-game-stats.dto";

export abstract class IPlayerRepository {
    abstract create(createPlayerDto: CreatePlayerDto): Promise<PlayerDto>;

    abstract defineTeam(teamId: string, playerId: string): Promise<PlayerDto>;

    abstract getAllByDatePaginated(options: CursorPagination): Promise<PlayerDto[]>;

    abstract getPlayerGameStats(id: string, game_id: string): Promise<PlayerGameStatsDto>;
}

