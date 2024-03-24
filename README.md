# NothingBetterThanAL
 This project involves creating a RESTful API in Node.js and TypeScript with several key features centered around cinema management.


# migrations

```bash
npx typeorm migration:create AddRoomMigration  
npm run typeorm -- migration:run -d ./src/database/database.ts
```