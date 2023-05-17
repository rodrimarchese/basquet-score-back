import {GameDto, CreateGameDto} from '../dto';
import {PlayerDto} from "@domains/player/dto";

export abstract class IGameService {
    abstract create(createGameDto: CreateGameDto): Promise<GameDto>;

    abstract getLatestGame(options: {
        limit?: number;
        page?: number;
        page_size?: number;
    }): Promise<GameDto[]>;

    abstract endGame(gameId: string): Promise<GameDto>

    abstract addPlayerScore(game_id: string, player_id: string, score: string): Promise<void>

    abstract addPlayerFoul(game_id: string, player_id: string, foul: string): Promise<void>

    abstract getGame(game_id: string): Promise<GameDto | undefined>

    abstract addPlayerChange(game_id: string, player_in: string, player_out: string): Promise<void>
    abstract addPlayerInGame(game_id: string, player_in: string): Promise<void>

    abstract getGameLineup(game_id: string,team_id: string): Promise<PlayerDto[]>

    abstract getGameCount(): Promise<number>

    abstract getEndedGames(options: { limit: number; page: number }): Promise<GameDto[]>
    abstract getActiveGames(options: { limit: number; page: number }): Promise<GameDto[]>
}
