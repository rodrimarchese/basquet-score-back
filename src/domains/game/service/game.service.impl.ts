import {GameDto, CreateGameDto} from '../dto';
import {IGameService} from '../service';
import {IGameRepository} from '../repository';
import {CursorPagination, OffsetPagination} from "@types";
import {PlayerGameDataType} from "@prisma/client";
import {PlayerDto} from "@domains/player/dto";
import {GameAllInfoDto} from "@domains/game/dto/game-all-info.dto";

export class GameService implements IGameService {
    constructor(private readonly gameRepository: IGameRepository) {
    }

    async create(createGameDto: CreateGameDto): Promise<GameDto> {
        return await this.gameRepository.create(createGameDto);
    }

    getLatestGame(options: OffsetPagination): Promise<GameDto[]> {
        return this.gameRepository.getAllByDatePaginated(options);
    }

    endGame(gameId: string): Promise<GameDto> {
        return this.gameRepository.endGame(gameId);
    }

    async addPlayerScore(game_id: string, player_id: string, score: string): Promise<void> {
        await this.gameRepository.addPoints(game_id, player_id, score);
        return this.gameRepository.addPlayerGameData(game_id, player_id,PlayerGameDataType.SCORE_GOAL, score);
    }

    addPlayerFoul(game_id: string, player_id: string, foul: string): Promise<void> {
        return this.gameRepository.addPlayerGameData(game_id, player_id,PlayerGameDataType.FOUL, foul);
    }

    async addPlayerChange(game_id: string, player_in: string,player_out: string): Promise<void> {
        await this.gameRepository.addPlayerGameData(game_id, player_in,PlayerGameDataType.SUBBED_IN);
        await this.gameRepository.addPlayerGameData(game_id, player_out,PlayerGameDataType.SUBBED_OUT);
    }

    async addPlayerInGame(game_id: string, player_in: string): Promise<void> {
        await this.gameRepository.addPlayerGameData(game_id, player_in,PlayerGameDataType.SUBBED_IN);
    }

    getGame(game_id: string): Promise<GameDto | undefined> {
        return this.gameRepository.getGame(game_id);
    }

    getGameLineup(game_id: string,team_id: string): Promise<PlayerDto[]> {
        return this.gameRepository.getGameLineup(game_id,team_id);
    }

    getGameAllInfo(game_id: string) : Promise<GameAllInfoDto> {
        return this.gameRepository.getAllInfo(game_id);
    }

    getGameCount(): Promise<number> {
        return this.gameRepository.getGameCount();
    }

    getActiveGames(options: OffsetPagination): Promise<GameDto[]> {
        return this.gameRepository.getActiveGames(options);
    }

    getEndedGames(options: OffsetPagination): Promise<GameDto[]> {
        return this.gameRepository.getEndedGames(options);
    }

}
