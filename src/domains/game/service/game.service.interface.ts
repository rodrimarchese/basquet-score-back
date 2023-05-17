import {GameDto, CreateGameDto} from '../dto';
import {PlayerDto} from "@domains/player/dto";
import {GameAllInfoDto} from "@domains/game/dto/game-all-info.dto";

export abstract class IGameService {
    abstract create(createGameDto: CreateGameDto): Promise<GameDto>;

    abstract getLatestGame(options: {
        limit?: number;
        before?: string;
        after?: string
    }): Promise<GameDto[]>;

    abstract endGame(gameId: string): Promise<GameDto>

    abstract addPlayerScore(game_id: string, player_id: string, score: string): Promise<void>
    abstract getGameAllInfo(game_id: string) : Promise<GameAllInfoDto>
    abstract addPlayerFoul(game_id: string, player_id: string, foul: string): Promise<void>

    abstract getGame(game_id: string): Promise<GameDto | undefined>

    abstract addPlayerChange(game_id: string, player_in: string, player_out: string): Promise<void>
    abstract addPlayerInGame(game_id: string, player_in: string): Promise<void>

    abstract getGameLineup(game_id: string,team_id: string): Promise<PlayerDto[]>
}
