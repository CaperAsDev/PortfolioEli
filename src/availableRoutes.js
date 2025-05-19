
const availableRoutes = {
  "en": {
    "/[...lang]": {
      "/[blog]": {
        "/[post]": "/[...lang]/[blog]/[post]",
        "/index": "/[...lang]/[blog]/"
      },
      "/index": "/[...lang]/"
    },
    "/about": "/about",
    "/books": {
      "/[id]": "/books/[id]",
      "/index": "/books/"
    },
    "/education": {
      "/[id]": "/education/[id]",
      "/index": "/education/"
    },
    "/focus": "/focus",
    "/home": "/",
    "/science": {
      "/[id]": "/science/[id]",
      "/index": "/science/"
    },
    "/social": {
      "/[id]": "/social/[id]",
      "/index": "/social/"
    }
  }
}; 
export default availableRoutes
