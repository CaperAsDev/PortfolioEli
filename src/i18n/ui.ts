import { Blogs, Langs } from "@/i18n/types";

export const blogsNames = {
  [Blogs.Education]: {
    en: "Education",
    es: "Educación",
    pt: "Educação",
  },
  [Blogs.Science]: {
    en: "Science",
    es: "Ciencia",
    pt: "Ciência",
  },
  [Blogs.Social]: {
    en: "Social Justice",
    es: "Justicia Social",
    pt: "Justiça Social",
  }
}

export const navigation = {
  en : {
    home: {
      label: 'Home',
      link : ''
    },
    about: {
      label: 'Contact Information',
      link : 'about'
    },
  },
  es : {
    home: {
      label: 'Inicio',
      link : 'es'
    },
    about: {
      label: 'Información contacto',
      link : 'es/about'
    },
  },
  pt : {
    home: {
      label: 'Início',
      link : 'pt'
    },
    about: {
      label: 'Fale conosco',
      link : 'pt/about'
    },
  }
}

export const footer = {
  en :{
    label: 'Design and development by',
  },
  es :{
    label: 'Diseño y desarrollo por',
  },
  pt :{
    label: 'Desenvolvido por',
  }
}

export const bookSection = {
  en: {
    title: "Recommended book",
    description:
      "One book a month to better understand ourselves: we explore how society works, how we impact the planet, and what we can do for a more just world—through the lens of sociology, psychology, and anthropology.",
  },
  es: {
    title: "Libro recomendado",
    description:
      "Un libro al mes para entendernos mejor: exploramos cómo funciona la sociedad, cómo influimos en el planeta y qué podemos hacer por un mundo más justo, a través de la mirada de la sociología, psicología y antropología.",
  },
  pt: {
    title: "Livro recomendado",
    description:
      "Um livro por mês para nos entendermos melhor: exploramos como a sociedade funciona, como influenciamos o planeta e o que podemos fazer por um mundo mais justo, através das lentes da sociologia, psicologia e antropologia.",
  },
};

type heroprops = {
  [key in Blogs]: {
    [key in Langs]: {
      title: string;
      description: string;
    };
  };
};
export const blogsHero: heroprops = {
  [Blogs.Education]: {
    [Langs.es]: {
      title: "Educación en ciencias",
      description: "La educación es la base de la equidad social. Aquí destacamos el trabajo de profesores y profesoras que están transformando el mundo desde sus clases.",
    },
    [Langs.en]: {
      title: "Education in science",
      description: "Education is the basis of social equity. Here we highlight the work of teachers who are transforming the world from their classrooms.",
    },
    [Langs.pt]: {
      title: "Educação em ciências",
      description: "A educação é a base da equidade social. Aqui destacamos o trabalho de professores que estão transformando o mundo a partir de suas salas de aula.",
    },
  },
  [Blogs.Science]: {
    [Langs.es]: {
      title: "Ciencia sin fronteras",
      description: "Descubre en esta sección proyectos científicos al rededor del mundo. Te contamos, de forma clara y breve, qué buscan, cómo avanzan y por qué nos conciernen a todos como sociedad.",
    },
    [Langs.en]: {
      title: "Science without borders",
      description: "Discover in this section scientific projects around the world. We tell you, clearly and briefly, what they are looking for, how they are progressing, and why they concern us all as a society.",
    },
    [Langs.pt]: {
      title: "Ciência sem fronteiras",
      description: "Descubra nesta seção projetos científicos ao redor do mundo. Contamos a você, de forma clara e breve, o que eles estão buscando, como estão progredindo e por que nos dizem respeito como sociedade.",
    },
  },
  [Blogs.Social]: {
    [Langs.es]: {
      title: "Justicia social",
      description: "Reflexionamos sobre lo que estamos haciendo como sociedad para avanzar hacia la justicia social, la equidad y la igualdad de género.",
    },
    [Langs.en]: {
      title: "Social justice",
      description: "We reflect on how, as a society, we’re working toward social justice, equity, and gender equality.",
    },
    [Langs.pt]: {
      title: "Justiça social",
      description: "Refletimos sobre o que estamos fazendo como sociedade para promover a justiça social, a equidade e a igualdade de gênero.",
    },
  },
}