import { Book } from "../Book.model.js";
import { Author } from "../Author.model.js";
import { BookAuthor } from "../BookAuthor.model.js";

// Define la relación muchos a muchos entre Book y Author
// a través de la tabla intermedia BookAuthor
export const defineAssociation = () => {
  Book.belongsToMany(Author, {
    through: BookAuthor,
    foreignKey: "bookId",
    otherKey: "authorId",
    as: "authors",
    timestamps: true,
  });

  Author.belongsToMany(Book, {
    through: BookAuthor,
    foreignKey: "authorId",
    otherKey: "bookId",
    as: "books",
    timestamps: true,
  });
};
