
	import { TeamDto, CreateTeamDto } from '../dto';
    import { CursorPagination } from '@types';
	
	export abstract class ITeamRepository {
		abstract create(createTeamDto: CreateTeamDto): Promise<TeamDto>;
		abstract getAllByDatePaginated(options: CursorPagination): Promise<TeamDto[]>;
	}
	