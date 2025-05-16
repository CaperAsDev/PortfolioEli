
const availableRoutes = {
  "en": {
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
  },
  "es": {
    "/about": "/es/about",
    "/book": "/es/book",
    "/education": "/es/education",
    "/focus": "/es/focus",
    "/home": "/es/",
    "/science": "/es/science",
    "/social": "/es/social"
  },
  "pt": {
    "/about": "/pt/about",
    "/book": "/pt/book",
    "/education": "/pt/education",
    "/focus": "/pt/focus",
    "/home": "/pt/",
    "/science": "/pt/science",
    "/social": "/pt/social"
  }
}; 
export default availableRoutes
