import { PlayerDto, CreatePlayerDto } from "../dto";
import { IPlayerService } from ".";
import { IPlayerRepository } from "../repository";
import { CursorPagination } from "@types";

export class PlayerService implements IPlayerService {
  constructor(private readonly PlayerRepository: IPlayerRepository) {}

  async create(createPlayerDto: CreatePlayerDto): Promise<PlayerDto> {
    return await this.PlayerRepository.create(createPlayerDto);
  }
  getLatestPlayer(options: CursorPagination): Promise<PlayerDto[]> {
    return this.PlayerRepository.getAllByDatePaginated(options);
  }
}
