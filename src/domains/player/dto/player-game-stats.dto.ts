import { TeamDto } from "@domains/team/dto";

export class PlayerGameStatsDto {
    player_id: string;
    game_id: string;
    fouls: number;
    points: number;

    constructor(player: PlayerGameStatsDto) {
        this.player_id = player.player_id;
        this.game_id = player.game_id;
        this.fouls = player.fouls;
        this.points = player.points;
    }
}
