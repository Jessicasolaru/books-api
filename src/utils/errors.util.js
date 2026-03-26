export class AppError extends Error {
  constructor(message, statusCode, details) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

export class ValidatorError extends AppError {
  constructor(message, details) {
    super(message || "Error de Validación", 400, details);
  }
}

export class NotFoundError extends AppError {
  constructor(message, details) {
    super(message || "Recurso no encontrado", 404, details);
  }
}

export class BookError extends AppError {
  constructor(message, details, statusCode) {
    super(message || "Error en la entidad Book", statusCode || 500, details);
  }
}

export class AuthorError extends AppError {
  constructor(message, details, statusCode) {
    super(message || "Error en la entidad Author", statusCode || 500, details);
  }
}

export class DBError extends AppError {
  constructor(message, details, statusCode) {
    super(
      message || "Error al comunicarnos con la base de datos",
      statusCode || 500,
      details,
    );
  }
}

export class InternalServerError extends AppError {
  constructor(message, details) {
    super(message || "Error interno de servidor", 500, details);
  }
}
