import dotenv from "dotenv";

// Carga las variables del archivo .env
dotenv.config();

export const env = {
  server: {
    environment: process.env.ENVIRONMENT,
    port: process.env.PORT,
  },
  db: {
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
  },
};
