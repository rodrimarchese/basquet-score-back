import {externalApiUrlPlayers} from "../urls";
import request from 'request';
import axios from "axios";
import redis from 'redis';
const client = redis.createClient();


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
        playerUrl += "?contains=" + contains + "&" + page
    }else{
        playerUrl += "?page=" + page
    }
    console.log("PLAYER URL" + playerUrl)
    return new Promise(function (resolve) {
        request(playerUrl, (error: string, body: any) => {
            if(!error){
                const data : Promise<playerResponse> = body.data
                return resolve(data)
            }
            if(error){
                console.error(error);
                return Promise.resolve({
                    totalPlayers: 0,
                    totalPages: 0,
                    currentPage: page,
                    players: []
                });
            }
        })
    })
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



export const getTeams2 = (contains: string, page: number) : any => {
    const url = 'http://localhost:3010/teams';
    axios.get(url)
        .then(response => {
            console.log(response.data); // Aquí puedes acceder a los datos de la respuesta
        })
        .catch(error => {
            console.error(error); // Aquí puedes manejar cualquier error que ocurra durante la solicitud
        });
   /* let teamUrl = externalApiUrlTeams
    if(contains != ""){
        teamUrl += "?contains=" + contains + "&" + page
    }else{
        teamUrl += "?page=" + page
    }
    console.log("TEAM URL" + teamUrl)
    return new Promise(function (resolve) {
        request(teamUrl, (error: string, body: any) => {
            if(!error){
                const data : Promise<teamResponse> = body.data
                return resolve(data)
            }
            if(error){
                console.error(error);
                return Promise.resolve({
                    totalPlayers: 0,
                    totalPages: 0,
                    currentPage: page,
                    players: []
                });
            }
        })
    })*/
}
