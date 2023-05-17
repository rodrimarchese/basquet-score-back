import { TeamDto } from "@domains/team/dto";

export class PlayerGameStatsDto {
    player_id: string;
    player_name: string;
    player_surname: string;
    game_id: string;
    fouls: number;
    points: number;

    constructor(player: PlayerGameStatsDto) {
        this.player_id = player.player_id;
        this.game_id = player.game_id;
        this.fouls = player.fouls;
        this.points = player.points;
        this.player_surname = player.player_surname
        this.player_name = player.player_name
    }
}
