import {TeamService} from "../../src/domains/team/service";
import {describe, jest} from "@jest/globals";
import {ValidationError} from "class-validator";
import {ITeamRepository, TeamRepository} from "../../src/domains/team/repository";
import {db} from "../../src/utils";
import {TeamDto} from "../../src/domains/team/dto";
import {ValidationException} from "../../src/utils/errors";


describe('TeamService', () => {
    let teamRepositoryMock: ITeamRepository = new TeamRepository(db)
    const createTeamDto = {name: 'Team A'};
    const team: TeamDto = {id: "1", name: 'Team A', createdAt: new Date()};

    const teamService = new TeamService(teamRepositoryMock);

    test('create() should return a TeamDto object', async () => {
        jest.spyOn(teamRepositoryMock, 'create').mockImplementation(() => Promise.resolve(team));
        const teamDto = await teamService.create(createTeamDto);

        expect(teamDto.id).toBeDefined();
        expect(teamDto.name).toEqual('Team A');
        expect(teamDto.createdAt).toBeDefined();
    });

    test('create() should throw a DuplicateNameError when team name already exists', async () => {
        const createTeamDto = {name: 'Team A'};
        jest.spyOn(teamRepositoryMock, 'create').mockImplementation(() => Promise.reject(new ValidationException([{
            property: 'name',
            constraints: {isUnique: 'name must be unique'}
        }])));

        try {
            await teamService.create(createTeamDto);
        } catch (error: any) {
            expect(error).toBeInstanceOf(ValidationException);
        }
    });
})
