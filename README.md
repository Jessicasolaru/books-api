# 📚 Books API

API REST CRUD desarrollada con Node.js, Express, PostgreSQL y Sequelize.
Permite gestionar Libros y Autores con una relación muchos a muchos entre ambas entidades.

---

## 🛠️ Tecnologías utilizadas

- Node.js v22
- Express.js
- PostgreSQL
- Sequelize ORM
- dotenv
- cors
- nodemon (desarrollo)

---

## 📁 Estructura del proyecto

```
books-api/
├── src/
│   ├── config/          # Variables de entorno y configuración de BD
│   ├── middleware/      # Logger HTTP y manejo de errores
│   ├── models/          # Modelos Sequelize (Book, Author, BookAuthor)
│   ├── routes/          # Definición de rutas
│   ├── controller/      # Controladores de cada entidad
│   ├── service/         # Lógica de negocio + DB + Servidor
│   └── utils/           # Logger y clases de error
├── .env.example
├── main.js
└── package.json
```

---

## ⚙️ Instalación y configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/Jessicasolaru/books-api
cd books-api
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env
```

Edita `.env` con tus credenciales de PostgreSQL.

### 4. Crear la base de datos en PostgreSQL

En pgAdmin crea una base de datos llamada `books_db`.

### 5. Iniciar el servidor

```bash
# Modo desarrollo
npm run dev

# Modo producción
npm start
```

---

## 🗄️ Modelo de datos

### Book (libros)

| Campo         | Tipo    | Descripción        |
| ------------- | ------- | ------------------ |
| id            | UUID    | Clave primaria     |
| title         | STRING  | Título del libro   |
| genre         | STRING  | Género literario   |
| publishedYear | INTEGER | Año de publicación |

### Author (autores)

| Campo       | Tipo    | Descripción       |
| ----------- | ------- | ----------------- |
| id          | UUID    | Clave primaria    |
| name        | STRING  | Nombre del autor  |
| nationality | STRING  | Nacionalidad      |
| birthYear   | INTEGER | Año de nacimiento |

### BookAuthor (tabla intermedia)

| Campo    | Tipo   | Descripción              |
| -------- | ------ | ------------------------ |
| id       | UUID   | Clave primaria           |
| bookId   | UUID   | FK → books               |
| authorId | UUID   | FK → authors             |
| role     | STRING | autor / coautor / editor |

---

## 🌐 Endpoints de la API

Base URL: `http://localhost:3000/api/v1`

### 👤 Authors

#### Crear autor

```
POST /authors
```

Body:

```json
{
  "name": "Gabriel García Márquez",
  "nationality": "Colombiana",
  "birthYear": 1927
}
```

Respuesta `201`:

```json
{
  "message": "Autor creado con éxito",
  "statusCode": 201,
  "data": {
    "id": "uuid",
    "name": "Gabriel García Márquez",
    "nationality": "Colombiana",
    "birthYear": 1927
  }
}
```

#### Obtener todos los autores

```
GET /authors
```

Respuesta `200`:

```json
{
    "message": "Autores obtenidos con éxito",
    "statusCode": 200,
    "data": [
        {
            "id": "uuid",
            "name": "Gabriel García Márquez",
            "nationality": "Colombiana",
            "birthYear": 1927,
            "books": [...]
        }
    ]
}
```

#### Obtener autor por ID

```
GET /authors/:id
```

Respuesta `200`:

```json
{
    "message": "Autor encontrado con éxito",
    "statusCode": 200,
    "data": { ... }
}
```

Respuesta `404`:

```json
{
  "message": "Autor con id: uuid no encontrado",
  "statusCode": 404,
  "error": null
}
```

#### Actualizar autor

```
PUT /authors/:id
```

Body:

```json
{
  "nationality": "Colombo-Mexicana"
}
```

Respuesta `200`:

```json
{
    "message": "Autor actualizado con éxito",
    "statusCode": 200,
    "data": { ... }
}
```

#### Eliminar autor (soft delete)

```
DELETE /authors/:id
```

Respuesta `200`:

```json
{
  "message": "Autor eliminado con éxito",
  "statusCode": 200
}
```

---

### 📖 Books

#### Crear libro

```
POST /books
```

Body:

```json
{
  "title": "Cien años de soledad",
  "genre": "Realismo mágico",
  "publishedYear": 1967
}
```

Respuesta `201`:

```json
{
  "message": "Libro creado con éxito",
  "statusCode": 201,
  "data": {
    "id": "uuid",
    "title": "Cien años de soledad",
    "genre": "Realismo mágico",
    "publishedYear": 1967
  }
}
```

#### Obtener todos los libros

```
GET /books
```

Respuesta `200`:

```json
{
  "message": "Libros obtenidos con éxito",
  "statusCode": 200,
  "data": [
    {
      "id": "uuid",
      "title": "Cien años de soledad",
      "genre": "Realismo mágico",
      "publishedYear": 1967,
      "authors": [
        {
          "id": "uuid",
          "name": "Gabriel García Márquez",
          "nationality": "Colombiana",
          "BookAuthor": { "role": "autor" }
        }
      ]
    }
  ]
}
```

#### Obtener libro por ID

```
GET /books/:id
```

#### Actualizar libro

```
PUT /books/:id
```

Body:

```json
{
  "genre": "Novela latinoamericana"
}
```

#### Eliminar libro (soft delete)

```
DELETE /books/:id
```

#### Asociar autor a libro ⭐

```
POST /books/:bookId/authors/:authorId
```

Body:

```json
{
  "role": "autor"
}
```

Roles válidos: `autor`, `coautor`, `editor`

Respuesta `200`:

```json
{
  "message": "Autor asociado al libro con éxito",
  "statusCode": 200,
  "data": {
    "id": "uuid",
    "title": "Cien años de soledad",
    "authors": [
      {
        "name": "Gabriel García Márquez",
        "BookAuthor": { "role": "autor" }
      }
    ]
  }
}
```

---

## ⚡ Códigos de estado HTTP utilizados

| Código | Significado           | Cuándo se usa                 |
| ------ | --------------------- | ----------------------------- |
| 200    | OK                    | GET, PUT, DELETE exitosos     |
| 201    | Created               | POST exitoso (recurso creado) |
| 400    | Bad Request           | Datos inválidos o faltantes   |
| 404    | Not Found             | Recurso no encontrado por ID  |
| 500    | Internal Server Error | Error inesperado del servidor |
