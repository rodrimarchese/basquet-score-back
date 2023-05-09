import {PlayerDto, CreatePlayerDto} from '../dto';
import {PlayerGameStatsDto} from "@domains/player/dto/player-game-stats.dto";

export abstract class IPlayerService {
    abstract create(createPlayerDto: CreatePlayerDto): Promise<PlayerDto>;

    abstract getLatestPlayer(options:
                                 { limit?: number; before?: string; after?: string }): Promise<PlayerDto[]>;

    abstract getPlayerGameStats(id: string, game_id: string): Promise<PlayerGameStatsDto>
}



