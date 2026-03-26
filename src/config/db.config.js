import { Sequelize } from "sequelize";
import { env } from "./env.config.js";

const { name, user, pass, host, port, dialect } = env.db;

// Instancia de conexión a PostgreSQL con Sequelize
export const dbConfig = new Sequelize(name, user, pass, {
  host,
  port,
  dialect,
  logging: false, // desactiva los logs SQL en consola (puedes poner console.log para verlos)
});
