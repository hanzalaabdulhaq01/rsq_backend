require('dotenv').config();

module.exports = {
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "node -r ts-node/register prisma/seed.ts",
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
};
