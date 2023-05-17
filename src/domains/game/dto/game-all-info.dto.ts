import {TeamDto} from "@domains/team/dto";
import {PlayerGameStatsDto} from "@domains/player/dto/player-game-stats.dto";
import {GameDto} from "@domains/game/dto/game.dto";

export class GameAllInfoDto {
    id: string;
    homeTeam: TeamDto;
    awayTeam: TeamDto;
    homeScore: number;
    awayScore: number;
    date: Date; // Assuming this is a string in ISO 8601 format
    playersHomeTeamWithInfo: PlayerGameStatsDto[];
    playersAwayTeamWithInfo: PlayerGameStatsDto[];


    constructor(game: GameDto, homeTeam: TeamDto, awayTeam: TeamDto, playersHomeTeamWithInfo: PlayerGameStatsDto[], playersAwayTeamWithInfo:PlayerGameStatsDto[] ) {
        this.id = game.id;
        this.homeTeam = homeTeam;
        this.awayTeam = awayTeam;
        this.homeScore = game.homeScore || 0;
        this.awayScore = game.awayScore || 0;
        this.date = game.date;
        this.playersAwayTeamWithInfo = playersAwayTeamWithInfo;
        this.playersHomeTeamWithInfo = playersHomeTeamWithInfo;
    }
}
