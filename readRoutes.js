import fs from 'fs';
import path from 'path';

const PagesDirName = 'pages';
const contentDir = path.resolve('src', PagesDirName);
const defaultLocale = 'en';

const createHierarchicalRoutes = ({ dirPath, recordOBJ, depth = 0, inDefLang = null, parentPath = "" }) => {
  const itemFiles = fs.readdirSync(dirPath, { withFileTypes: true });

  itemFiles.forEach((file) => {
    if (file.isDirectory()) {
      const itemPath = path.join(dirPath, file.name);
      const folderName = file.name
      let tragetObg = null;
      let isdefLangChild = inDefLang

      if (depth === 0) {
        if(folderName.length > 2){
          recordOBJ[defaultLocale] || Object.assign(recordOBJ, {[defaultLocale]: {}})
          recordOBJ[defaultLocale][folderName] || Object.assign(recordOBJ[defaultLocale], {[folderName]: {}})
          tragetObg = recordOBJ[defaultLocale][folderName];
          isdefLangChild = true;
        }else{
          recordOBJ[folderName] = {};
          tragetObg = recordOBJ[folderName];
        }
      }else {
        recordOBJ[folderName] = {};
        tragetObg = recordOBJ[folderName];
      }

      createHierarchicalRoutes({
        dirPath: itemPath,
        recordOBJ: tragetObg,
        depth: depth + 1,
        inDefLang: isdefLangChild,
        parentPath: parentPath + "/" + file.name,
      });
    }
    if (file.isFile() && file.name.includes('astro')) {

      let fileName = `/${file.name.replace(/\.[^/.]+$/, '')}`;
      let routeName = `${parentPath}${fileName == '/index' ? '/': fileName}`;
      
      if (depth === 0) {
        if (fileName === '/index') fileName = '/home';
        recordOBJ[defaultLocale] || Object.assign(recordOBJ, {[defaultLocale]: {}})
        recordOBJ[defaultLocale][fileName] = routeName;
      } else if (depth === 1 && parentPath.length <= 3) {
        if (fileName === '/index') fileName = '/home';
        recordOBJ[fileName] = routeName;
      } else {
        recordOBJ[fileName] = routeName;
      }
    }
  });
};

const hierarchicalRoutes = {};
createHierarchicalRoutes({ dirPath: contentDir, recordOBJ: hierarchicalRoutes });

const objOutputPath = path.resolve('src/availableRoutes.js');
const ObjNewFileContent = `
const availableRoutes = ${JSON.stringify(hierarchicalRoutes, null, 2)}; 
export default availableRoutes
`;

// Si el archivo ya existe, comparamos antes de sobrescribir
if (fs.existsSync(objOutputPath)) {
  const currentContent = fs.readFileSync(objOutputPath, 'utf-8');
  if (currentContent === ObjNewFileContent) {
    console.log('✅ No hay cambios en las rutas. Archivo no modificado.');
    process.exit(0);
  }
}

fs.writeFileSync(objOutputPath, ObjNewFileContent, 'utf-8');
console.log('✅ Archivo routes.ts actualizado correctamente.');

//-------> Props

// dirPath: ruta de la carpeta a la que le vamos a leer los archivos,
// recordOBJ: objeto en el que guardaremos la informacion de la rutas con jerarquia,
// depth: nivel de profundidad de la carpeta que se esta leyendo,
// inDefLang: se usa para saber si los archivos de una carpeta vienen del lenguage por defecto para en el path generado omitir la ruta de idioma,
// parentPath: se usa para formar las rutas relativas de la web,