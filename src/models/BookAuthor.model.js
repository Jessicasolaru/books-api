import { Model, DataTypes } from "sequelize";

export class BookAuthor extends Model {}

// Esta tabla intermedia es la que crea la relación muchos a muchos
// Un libro puede tener muchos autores, y un autor puede tener muchos libros
export const initBookAuthor = (dbConfig) => {
  BookAuthor.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      // Rol del autor en este libro (ej: autor principal, coautor, editor)
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "autor",
        validate: {
          notEmpty: { msg: "El rol no puede estar vacío" },
          isIn: {
            args: [["autor", "coautor", "editor"]],
            msg: "El rol debe ser: autor, coautor o editor",
          },
        },
      },
    },
    {
      sequelize: dbConfig,
      modelName: "BookAuthor",
      tableName: "book_authors",
      timestamps: true,
      paranoid: false,
    },
  );
};
