## Setup

- Install [Git](https://git-scm.com/), [Docker](https://www.docker.com/), [Node v18](https://nodejs.org/en/download/) and [Yarn](https://yarnpkg.com/)
- Clone this repository
- Create a copy of [.env-template](./.env-template) into `.env`
- Run:
  ```
  docker compose up
  ```
- You're ready to go!

## Load testing

- Run `docker-compose -f docker-compose.test.yml up`
- Once the app is running, execute `yarn load-test`
- Open a browser and go to `http://localhost:8089`
- Enter the desired Number of users (peak concurrency) and Spawn rate (users started/second)
- In the "Host" field write `http://localhost:8081`
- Click the "Start swarming" button