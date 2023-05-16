import {externalApiUrlPlayers, externalApiUrlTeams} from "../urls";
import axios from "axios";
import redis from 'redis';
import {makeTeamRouter} from "@domains/team/controller";


export type playerResponse = {
    totalPlayers : number,
    totalPages: number,
    currentPage: number,
    players: nbaPlayer[]
}

export type nbaPlayer = {
    firstName: string,
    lastName: string
}
export const getPlayers = (contains: string, page: number) : Promise<playerResponse>  => {
    let playerUrl = externalApiUrlPlayers
    if(contains != ""){
        playerUrl += "?contains=" + contains + "&page=" + page
    }else{
        playerUrl += "?page=" + page
    }
    return new Promise((resolve, reject) => {
        axios.get(playerUrl)
            .then(response => {
                const data: playerResponse = response.data.response
                return resolve(data)
            })
            .catch(error => {
                console.error(error);
                return Promise.resolve({
                    totalPlayers: 0,
                    totalPages: 0,
                    currentPage: page,
                    players: []
                });
            });
    });
}

export type nbaTeams = {
    teamName: string
}

export type teamResponse = {
    totalTeams : number,
    totalPages: number,
    currentPage: number,
    teams: nbaTeams[]
}



export const getTeams = (contains: string, page: number) : Promise<teamResponse> => {
    let teamUrl = externalApiUrlTeams
    if(contains != ""){
        teamUrl += "?contains=" + contains + "&page=" + page
    }else{
        teamUrl += "?page=" + page
    }
    return new Promise((resolve, reject) => {
        axios.get(teamUrl)
            .then(response => {
                const data: teamResponse = response.data.response
                return resolve(data)
            })
            .catch(error => {
                console.error(error);
                return Promise.resolve({
                    totalTeams: 0,
                    totalPages: 0,
                    currentPage: page,
                    teams: []
                });
            });
    });
}