# backend-sias
Backend for Sistem Informasi Asisten Dosen. The Sistem Informasi Asisten Dosen is my thesis project which helps users to be more efficient in processing or processing data. Github helps me manage my thesis project from the code that I have previously created, changed, or deleted.

## Before Installation
Please make sure to create your environment first like environment below. You also can create `.env` file in root file with this environment.
```env
DB_HOST=your_database_host
SECRET_KEY=make_your_secret_key
```
Fill Secret Key as you want.

## Installation
Previously, you must install the package with the command below.
```bash
npm install
```
And after instal the package, you can run the project by run the command below.
- `npm run dev` to run in development environment

## Endpoint API
| HTTP Verb | Base Endpoint |      Endpoint       |
| :-------: | :-----------: | :-----------------: |
|    ===    | Administrator |         ===         |
|    GET    |    /admin     |       /users        |
|    GET    |    /admin     |      /users:id      |
|   POST    |    /admin     |       /users        |
|    PUT    |    /admin     |      /users:id      |
|  DELETE   |    /admin     |      /users:id      |
|    ---    |      ---      |         ---         |
|    ===    |   Operator    |         ===         |
|    GET    |   /operator   |      /semester      |
|   POST    |   /operator   |      /semester      |
|    PUT    |   /operator   |      /semester      |
|  DELETE   |   /operator   |      /semester      |
|    PUT    |   /operator   | /status/pendaftaran |
|    PUT    |   /operator   |    /status/asdos    |
|    PUT    |   /operator   |    /status/dosen    |
|    GET    |   /operator   |       /jadwal       |
|   POST    |   /operator   |       /jadwal       |
|    GET    |   /operator   |  /jadwal/download   |
|    ---    |      ---      |         ---         |
|    ===    |     Dosen     |         ===         |
|    GET    |    /dosen     |         /..         |
|    ---    |      ---      |         ---         |
|    ===    | Asisten Dosen |         ===         |
|    GET    |    /asdos     |         /..         |
|    ---    |      ---      |         ---         |
|    ===    |   Akademik    |         ===         |
|    GET    |     /aka      |         /..         |
|    ---    |      ---      |         ---         |
|    ===    |   Keuangan    |         ===         |
|    GET    |     /keu      |         /..         |
|    ---    |      ---      |         ---         |
|    ===    |     Guest     |         ===         |
|    GET    |     /auth     |       /login        |
|    GET    |     /auth     |       /logout       |
|    GET    |     /auth     |    /authecticate    |
|    GET    | /pendaftaran  |          /          |
## TO DO
Because this is still under development, so below are the features that I will build.

- [x] Administrator
  - [x] CRUD User
- [ ] Operator
  - [ ] CRUD semester schedule (KRS).
- [ ] Dosen
  - [ ] Accept or reject the Assistant Lecturer registration
  - [ ] Booking Assistant Lecturer schedule
- [ ] Asisten Dosen
  - [ ] Choosing a schedule (KRS)
- [ ] Akademik
  - [ ] Recap the activities of the Assistant Lecturer in the class
- [ ] Keuangan
  - [ ] Recap the attendance of the Assistant Lecturer in the class
- [ ] Guest (Not Login)
  - [ ] Login
  - [ ] Assistant Lecturer Registration

List can be changed at any time.

## License
[MIT](https://choosealicense.com/licenses/mit/)
