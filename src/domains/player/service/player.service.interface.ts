
	import { PlayerDto, CreatePlayerDto } from '../dto';
	
        export abstract class IPlayerService {
            abstract create(createPlayerDto: CreatePlayerDto): Promise<PlayerDto>;
            abstract getLatestPlayer( options:
                { limit?: number; before?: string; after?: string }): Promise<PlayerDto[]>;
        }


	