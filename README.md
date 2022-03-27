# Airport Inspector Manager

Airport Inspector Manager is a Full-Stack application that manage airport inspectors at airports and guide inspectors with their daily job tasks



## Inspector Manager
- Assign inspectors to groups
- Assign inspectors to checkpoints
- Assign replacement inspectors to active inspectors
- View checkpoints flights traffic details

## Inspectors
- View inspector group
- View flights relevant to assigned inspectors
- View replacement inspector
- View assigned checkpoint flights traffic details

## Roadmap

#### Frontend  WIP
#### Backend
- Scrape flights from Airport Information System
- Add more data to the scraped data
- Create database MongoDB Atlas
- Push data to a database
- Cron job to refresh database every set duration
- Express server API for Frontend interactions


## Tech Stack

**Client:** WIP

**Server:** Node, Express, MongoDB, Cheerio, Axios


## Environment Variables

To run this project, you will need to rename .env-template to .env and add the following environment variables in .env file with your values

`PORT`
`MONGODB_URI`
`TARGET_TABLE_URL`
## Using the project

Install dependencies 

```bash
  npm install
```

To run the scraper

```bash
  cd backend/scraper
  node runCron.js
```

To run the server

```bash
  cd backend
  node server.js
```


## API Reference

#### Get all arrival flights

```http
  GET /api/arrivals
```

#### Get all late arrival flights

```http
  GET /api/arrivals/late
```

#### Get all early arrival flights

```http
  GET /api/arrivals/early
```

#### Get all on time arrival flights

```http
  GET /api/arrivals/ontime
```


#### Get all departures flights

```http
  GET /api/departures
```

#### Get all late departures flights

```http
  GET /api/departures/late
```

#### Get all early departures flights

```http
  GET /api/departures/early
```

#### Get all on time departures flights

```http
  GET /api/departures/ontime
```
## 🚀 About Me
I'm a full stack software engineer, part of Leon free Full-Stack Software Engineer boot camp


## Acknowledgements

 - [Leon Noel](https://twitter.com/leonnoel)
 - [#100Devs Community](https://twitter.com/search?q=%23100Devs&src=typeahead_click)

## License

[MIT](https://choosealicense.com/licenses/mit/)

