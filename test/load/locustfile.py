from locust import HttpUser, task, between

def team_name_generator():
    number = 1
    while True:
        name = f"team {number}"
        yield name
        number += 1

def player_names_generator():
    number = 1
    while True:
        names = {"name": f"name {number}", "surname": f"{number}"}
        yield names
        number += 1

team_name = team_name_generator()
player_names = player_names_generator()

class TeamTaskSet(HttpUser):
    wait_time = between(1, 3)  # wait time between requests

    @task
    def get_teams(self):
        self.client.get("/team")

    @task
    def create_team(self):
        name = next(team_name)
        payload = { "name": name }
        self.client.post("/team", json=payload)

class PlayerTaskSet(HttpUser):
    wait_time = between(1, 3)  # wait time between requests

    @task
    def get_players(self):
        self.client.get("/player")

    @task
    def create_player(self):
        names = next(player_names)
        payload = {
            "name": names["name"],
            "surname": names["surname"],
            "position": "wing",
            "shirtNum": 1,
        }
        self.client.post("/player", json=payload)
