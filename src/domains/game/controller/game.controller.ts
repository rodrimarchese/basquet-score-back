import {Request, Response, Router} from 'express';
import HttpStatus from 'http-status';
import "express-async-errors";
import {BodyValidation, db} from '@utils';
import {GameDto, CreateGameDto} from '../dto';
import {GameRepository} from '../repository'
import {IGameService, GameService} from '../service';

export const gameRouter = Router();
const service: IGameService = new GameService(new GameRepository(db));

gameRouter.get('/', async (req: Request, res: Response) => {

    const {limit,page} = req.query as Record<string, string>;
    console.log(page)

    const games = await service.getLatestGame({limit: Number(limit ?? 10), page: Number(page ?? 0)});
    const gameCount = await service.getGameCount();


    return res.status(HttpStatus.OK).json({
        games,
        count: gameCount
    });
});

gameRouter.get('/active', async (req: Request, res: Response) => {

    const {limit,page} = req.query as Record<string, string>;
    console.log(page)

    const games = await service.getActiveGames({limit: Number(limit ?? 10), page: Number(page ?? 0)});
    const gameCount = await service.getGameCount();


    return res.status(HttpStatus.OK).json({
        games,
        count: gameCount
    });
});

gameRouter.get('/ended', async (req: Request, res: Response) => {

    const {limit,page} = req.query as Record<string, string>;
    console.log(page)

    const games = await service.getEndedGames({limit: Number(limit ?? 10), page: Number(page ?? 0)});
    const gameCount = await service.getGameCount();


    return res.status(HttpStatus.OK).json({
        games,
        count: gameCount
    });
});

gameRouter.post('/',BodyValidation(CreateGameDto), async (req: Request, res: Response) => {

    const gameData = req.body as CreateGameDto;

    const game = await service.create(gameData);

    return res.status(HttpStatus.CREATED).json(game);
})

gameRouter.post('/end_game/:game_id', async (req: Request, res: Response) => {

    const {game_id} = req.params;

    const game = await service.endGame(game_id);

    return res.status(HttpStatus.OK).json(game);
})

gameRouter.post('/player_score', async (req: Request, res: Response) => {

    const {game_id, player_id, score} = req.body;

    await service.addPlayerScore(game_id, player_id, score);

    return res.status(HttpStatus.OK).json();
})

gameRouter.post('/player_foul', async (req: Request, res: Response) => {

    const {game_id, player_id, foul} = req.body;

    await service.addPlayerFoul(game_id, player_id, foul);

    return res.status(HttpStatus.OK).json();
})

gameRouter.post('/player_in', async (req: Request, res: Response) => {
    const {game_id, player_id} = req.body;

    await service.addPlayerInGame(game_id, player_id);

    return res.status(HttpStatus.OK).json();
})

gameRouter.post('/player_change', async (req: Request, res: Response) => {

    const {game_id, player_in,player_out} = req.body;

    await service.addPlayerChange(game_id, player_in,player_out);

    return res.status(HttpStatus.OK).json();
})



gameRouter.get('/:game_id', async (req: Request, res: Response) => {

    const {game_id} = req.params;

    const game = await service.getGame(game_id);

    if (!game) return res.status(HttpStatus.NOT_FOUND).json();

    return res.status(HttpStatus.OK).json(game);
})


gameRouter.get('/lineup/:game_id/:team_id', async (req: Request, res: Response) => {

    const {game_id,team_id} = req.params;

    const game = await service.getGameLineup(game_id,team_id);

    if (!game) return res.status(HttpStatus.NOT_FOUND).json();

    return res.status(HttpStatus.OK).json(game);
})


gameRouter.get('/get_all_info/:game_id', async (req: Request, res: Response) => {

    const {game_id} = req.params;

    const game = await service.getGameAllInfo(game_id);

    if (!game) return res.status(HttpStatus.NOT_FOUND).json();

    return res.status(HttpStatus.OK).json(game);
})