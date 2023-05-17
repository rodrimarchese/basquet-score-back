from locust import HttpUser, task, between

def team_name_generator():
    number = 1
    while True:
        name = f"team {number}"
        yield name
        number += 1

team_name = team_name_generator()

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
