
	import { PlayerDto, CreatePlayerDto } from '../dto';
    import { CursorPagination } from '@types';
	
	export abstract class IPlayerRepository {
		abstract create(createPlayerDto: CreatePlayerDto): Promise<PlayerDto>;
		abstract getAllByDatePaginated(options: CursorPagination): Promise<PlayerDto[]>;
	}
	
