import { Model, DataTypes } from "sequelize";

export class Book extends Model {}

export const initBook = (dbConfig) => {
  Book.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      // Título del libro
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "El título es obligatorio" },
          notEmpty: { msg: "El título no puede estar vacío" },
          len: {
            args: [1, 200],
            msg: "El título debe tener entre 1 y 200 caracteres",
          },
        },
      },
      // Género literario
      genre: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "El género es obligatorio" },
          notEmpty: { msg: "El género no puede estar vacío" },
        },
      },
      // Año de publicación
      publishedYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "El año de publicación es obligatorio" },
          isInt: { msg: "El año debe ser un número entero" },
          min: {
            args: [1000],
            msg: "El año no puede ser menor a 1000",
          },
          max: {
            args: [new Date().getFullYear()],
            msg: "El año no puede ser mayor al actual",
          },
        },
      },
    },
    {
      sequelize: dbConfig,
      modelName: "Book",
      tableName: "books",
      timestamps: true,
      paranoid: true, // habilita soft delete → agrega deletedAt
    },
  );
};
