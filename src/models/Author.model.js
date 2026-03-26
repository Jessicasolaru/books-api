import { Model, DataTypes } from "sequelize";

export class Author extends Model {}

export const initAuthor = (dbConfig) => {
  Author.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      // Nombre del autor
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "El nombre no puede estar vacío" },
          len: {
            args: [2, 100],
            msg: "El nombre debe tener entre 2 y 100 caracteres",
          },
        },
      },
      // Nacionalidad del autor
      nationality: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "La nacionalidad no puede estar vacía" },
        },
      },
      // Fecha de nacimiento
      birthYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
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
      modelName: "Author",
      tableName: "authors",
      timestamps: true,
      paranoid: true, // soft delete
    },
  );
};
