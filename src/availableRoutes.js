
const availableRoutes = {
  "en": {
    "/[...lang]": {
      "/[blog]": {
        "/[post]": "/[...lang]/[blog]/[post]",
        "/index": "/[...lang]/[blog]/"
      },
      "/about": "/[...lang]/about",
      "/focus": "/[...lang]/focus",
      "/index": "/[...lang]/"
    },
    "/books": {
      "/[id]": "/books/[id]",
      "/index": "/books/"
    },
    "/home": "/"
  }
}; 
export default availableRoutes
