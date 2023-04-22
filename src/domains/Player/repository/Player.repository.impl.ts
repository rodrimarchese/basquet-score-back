
	import { IPlayerRepository } from '../repository';
	import { CreatePlayerDto, PlayerDto } from '../dto';
    import { PrismaClient } from '@prisma/client';
    import { CursorPagination } from '@types';
	
	export class PlayerRepository implements IPlayerRepository {
	constructor(private readonly db: PrismaClient) {}

        async create(data: CreatePlayerDto): Promise<PlayerDto> {
            return await this.db.player.create({
                data,
            }).then(player => new PlayerDto(player));
        }

        async getAllByDatePaginated(options: CursorPagination): Promise<PlayerDto[]> {
            const players = await this.db.player.findMany(options.after || options.before ? {
                cursor: {
                    id: options.after ? options.after : options.before ? options.before : undefined,
                },
                skip: options.after || options.before ? 1 : undefined,
                take: options.limit ? (options.before ? -options.limit : options.limit) : undefined,
                orderBy: [
                    {
                        createdAt: 'desc',
                    },
                    {
                        id: 'asc',
                    },
                ],
            } : undefined);
            return players.map(player => new PlayerDto(player));
        }
    }