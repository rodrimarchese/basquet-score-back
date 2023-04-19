export class TeamDto {
    id: string;
    name: string;
    createdAt: Date;

    constructor(team: TeamDto) {
        this.id = team.id;
        this.name = team.name;
        this.createdAt = team.createdAt;
    }
}
