import { TeamDto } from "@domains/team/dto";

export class PlayerDto {
  id: string;
  name: string;
  surname: string;
  position: string;
  shirtNum: number;
  teamId: string | null;
  team?: TeamDto
  createdAt: Date;

  constructor(player: PlayerDto) {
    this.id = player.id;
    this.name = player.name;
    this.surname = player.surname;
    this.position = player.position;
    this.shirtNum = player.shirtNum;
    this.teamId = player.teamId;
    this.team= player.team
    this.createdAt = player.createdAt;
  }
}
