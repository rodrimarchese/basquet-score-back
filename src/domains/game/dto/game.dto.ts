export class GameDto {
    id: string;
    homeTeamId: string;
    awayTeamId: string;
    homeTeamName?: string;
    awayTeamName?: string;
    homeScore?: number;
    awayScore?: number;
    date: Date; // Assuming this is a string in ISO 8601 format

    constructor(game: GameDto) {
        this.id = game.id;
        this.homeTeamId = game.homeTeamId;
        this.awayTeamId = game.awayTeamId;
        this.homeTeamName = game.homeTeamName;
        this.awayTeamName = game.awayTeamName;
        this.homeScore = game.homeScore;
        this.awayScore = game.awayScore;
        this.date = game.date;
    }
}
