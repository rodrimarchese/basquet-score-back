import { PlayerDto, CreatePlayerDto } from "../dto";
import { IPlayerService } from ".";
import { IPlayerRepository } from "../repository";
import { CursorPagination } from "@types";
import {PlayerGameStatsDto} from "@domains/player/dto/player-game-stats.dto";

export class PlayerService implements IPlayerService {
  constructor(private readonly PlayerRepository: IPlayerRepository) {}

  async create(createPlayerDto: CreatePlayerDto): Promise<PlayerDto> {
    return await this.PlayerRepository.create(createPlayerDto);
  }
  getLatestPlayer(options: CursorPagination): Promise<PlayerDto[]> {
    return this.PlayerRepository.getAllByDatePaginated(options);
  }

    getPlayerGameStats(id: string, game_id: string): Promise<PlayerGameStatsDto> {
        return this.PlayerRepository.getPlayerGameStats(id, game_id);
    }
}
