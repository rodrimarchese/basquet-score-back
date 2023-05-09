import {GameDto, CreateGameDto} from '../dto';
import {IGameService} from '../service';
import {IGameRepository} from '../repository';
import {CursorPagination} from "@types";
import {PlayerGameDataType} from "@prisma/client";
import {PlayerDto} from "@domains/player/dto";

export class GameService implements IGameService {
    constructor(private readonly gameRepository: IGameRepository) {
    }

    async create(createGameDto: CreateGameDto): Promise<GameDto> {
        return await this.gameRepository.create(createGameDto);
    }

    getLatestGame(userId: string, options: CursorPagination): Promise<GameDto[]> {
        return this.gameRepository.getAllByDatePaginated(options);
    }

    endGame(gameId: string): Promise<GameDto> {
        return this.gameRepository.endGame(gameId);
    }

    addPlayerScore(game_id: string, player_id: string, score: string): Promise<void> {
        return this.gameRepository.addPlayerGameData(game_id, player_id,PlayerGameDataType.SCORE_GOAL, score);
    }

    addPlayerFoul(game_id: string, player_id: string, foul: string): Promise<void> {
        return this.gameRepository.addPlayerGameData(game_id, player_id,PlayerGameDataType.FOUL, foul);
    }

    async addPlayerChange(game_id: string, player_id: string, player_in: string,player_out: string): Promise<void> {
        await this.gameRepository.addPlayerGameData(game_id, player_id,PlayerGameDataType.SUBBED_IN);
        await this.gameRepository.addPlayerGameData(game_id, player_id,PlayerGameDataType.SUBBED_OUT);
    }

    getGame(game_id: string): Promise<GameDto | undefined> {
        return this.gameRepository.getGame(game_id);
    }

    getGameLineup(game_id: string,team_id: string): Promise<PlayerDto[]> {
        return this.gameRepository.getGameLineup(game_id,team_id);
    }

}
