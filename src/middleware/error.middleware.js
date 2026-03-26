import { AppError, InternalServerError } from "../utils/errors.util.js";
import { Logger } from "../utils/logger.js";

const logger = new Logger("ERROR");

export const errorHandler = (err, req, res, next) => {
  // Si el error no es un AppError conocido, lo convertimos a InternalServerError
  if (!(err instanceof AppError)) {
    err = new InternalServerError(
      err.message || "Error inesperado",
      "Ocurrió un error inesperado. Contacta al equipo de desarrollo.",
    );
  }

  const errorResponse = {
    message: err.message,
    statusCode: err.statusCode,
    error: err.details || null,
  };

  logger.error(`${err.statusCode} - ${err.message}`);
  res.status(err.statusCode).json(errorResponse);
};
