import fs from 'fs';
import path from 'path';

const PagesDirName = 'pages'; // Nombre del directorio que contiene las páginas.
const contentDir = path.resolve('src', PagesDirName); // Ruta absoluta al directorio de páginas.
const defaultLocale = 'en'; // Idioma predeterminado para las rutas.

// Función recursiva para crear un objeto jerárquico de rutas basado en la estructura de carpetas y archivos.
const createHierarchicalRoutes = ({ dirPath, recordOBJ, depth = 0, inDefLang = null, parentPath = "" }) => {
  const itemFiles = fs.readdirSync(dirPath, { withFileTypes: true }); // Lee los archivos y carpetas en el directorio actual.

  itemFiles.forEach((file) => {
    if (file.isDirectory()) {
      // Si es un directorio, se procesa recursivamente.
      const itemPath = path.join(dirPath, file.name); // Ruta completa del subdirectorio.
      const folderName = file.name; // Nombre del subdirectorio.
      let targetObg = null; // Objeto donde se almacenarán las rutas del subdirectorio.
      let isdefLangChild = inDefLang; // Indica si el subdirectorio pertenece al idioma predeterminado.

      if (depth === 0) {
        // Si estamos en el nivel raíz.
        if (folderName.length > 2) {
          // Si el nombre de la carpeta tiene más de 2 caracteres, se asume que no es una carpeta de idioma y se trataran como rutas hijas del idioma por defecto.

          // Se asegura de que exista el objeto para el idioma predeterminado.
          recordOBJ[defaultLocale] || Object.assign(recordOBJ, { [defaultLocale]: {} });

          // se crea la propiedad con el nombre de carpeta si no existe
          recordOBJ[defaultLocale][`/${folderName}`] || Object.assign(recordOBJ[defaultLocale], { [`/${folderName}`]: {} });

          targetObg = recordOBJ[defaultLocale][`/${folderName}`];
          isdefLangChild = true; // Marca que los hijos pertenecen al idioma predeterminado.
        } else {
          // Si no, se trata de un idioma específico de dos letras.

          //se crea la propiedad con el nombre del idioma si no existe
          recordOBJ[folderName] = {};
          targetObg = recordOBJ[folderName];
        }
      } else {
        // Para niveles más profundos, simplemente se agrega la carpeta al objeto.
        recordOBJ[`/${folderName}`] = {};
        targetObg = recordOBJ[`/${folderName}`];
      }

      // Llama recursivamente para procesar el contenido del subdirectorio.
      createHierarchicalRoutes({
        dirPath: itemPath,
        recordOBJ: targetObg,
        depth: depth + 1,
        inDefLang: isdefLangChild,
        parentPath: parentPath + "/" + file.name,
      });
    }

    if (file.isFile() && file.name.includes('astro')) {
      // Si es un archivo y contiene 'astro' en el nombre.
      let fileName = `/${file.name.replace(/\.[^/.]+$/, '')}`; // Elimina la extensión del archivo y pone una barra al inicio.
      let routeName = `${parentPath}${fileName == '/index' ? '/' : fileName}`; // Genera la ruta relativa y si es un index le pone la barra en lugar del nombre.

      if (depth === 0) {
        // Si estamos en el nivel raíz y hay un archivo quiere decir que pertence al idioma por defecto.
        if (fileName === '/index') fileName = '/home'; // Renombra '/index' como '/home'.

        // Asegura que exista el objeto para el idioma predeterminado, sino lo crea.
        recordOBJ[defaultLocale] || Object.assign(recordOBJ, { [defaultLocale]: {} });
        recordOBJ[defaultLocale][fileName] = routeName; // Agrega la ruta al idioma predeterminado.
      } else if (depth === 1 && parentPath.length <= 3) {
        // Si estamos en el primer nivel y la ruta padre tiene menos de 3 caracteres es porque es un hijo de ruta de idioma como /es.
        if (fileName === '/index') fileName = '/home'; // Renombra '/index' como '/home'.
        recordOBJ[fileName] = routeName; // Agrega la ruta.
      } else {
        // Para niveles más profundos.
        recordOBJ[fileName] = routeName; // Agrega la ruta.
      }
    }
  });
};

const hierarchicalRoutes = {}; // Objeto que almacenará las rutas jerárquicas.
createHierarchicalRoutes({ dirPath: contentDir, recordOBJ: hierarchicalRoutes }); // Llama a la función para generar las rutas.

const objOutputPath = path.resolve('src/availableRoutes.js'); // Ruta del archivo de salida.
const ObjNewFileContent = `
const availableRoutes = ${JSON.stringify(hierarchicalRoutes, null, 2)}; 
export default availableRoutes
`;

// Si el archivo ya existe, compara el contenido antes de sobrescribir.
if (fs.existsSync(objOutputPath)) {
  const currentContent = fs.readFileSync(objOutputPath, 'utf-8');
  if (currentContent === ObjNewFileContent) {
    console.log('✅ No hay cambios en las rutas. Archivo no modificado.');
    process.exit(0); // Sale del proceso si no hay cambios.
  }
}

// Escribe el nuevo contenido en el archivo.
fs.writeFileSync(objOutputPath, ObjNewFileContent, 'utf-8');
console.log('✅ Archivo routes.ts actualizado correctamente.');

//-------> Props

// dirPath: ruta de la carpeta a la que le vamos a leer los archivos,
// recordOBJ: objeto en el que guardaremos la informacion de la rutas con jerarquia,
// depth: nivel de profundidad de la carpeta que se esta leyendo,
// inDefLang: se usa para saber si los archivos de una carpeta vienen del lenguage por defecto para en el path generado omitir la ruta de idioma,
// parentPath: se usa para formar las rutas relativas de la web,