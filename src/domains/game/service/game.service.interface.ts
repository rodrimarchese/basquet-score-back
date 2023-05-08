import {GameDto, CreateGameDto} from '../dto';

export abstract class IGameService {
    abstract create(createGameDto: CreateGameDto): Promise<GameDto>;

    abstract getLatestGame(userId: string, options: {
        limit?: number;
        before?: string;
        after?: string
    }): Promise<GameDto[]>;

    abstract endGame(gameId: string): Promise<GameDto>

    abstract addPlayerScore(game_id: string, player_id: string, score: string): Promise<void>

    abstract addPlayerFoul(game_id: string, player_id: string, foul: string): Promise<void>

    abstract getGame(game_id: string): Promise<GameDto | undefined>

    abstract addPlayerChange(game_id: string, player_id: string, player_in: string, player_out: string): Promise<void>

}