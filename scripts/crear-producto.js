const fs = require('fs');
const path = require('path');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

const productsDir = path.join(__dirname, '..', 'data', 'productos');
const assetsDir = path.join(__dirname, '..', 'assets', 'products');

// Crear directorios si no existen
[productsDir, assetsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

async function crearProducto() {
  try {
    // Obtener el próximo ID disponible
    const archivos = fs.readdirSync(productsDir);
    const ultimoId = archivos.reduce((max, archivo) => {
      const match = archivo.match(/producto-(\d+)\.json/);
      return match ? Math.max(max, parseInt(match[1])) : max;
    }, 0);
    
    const nuevoId = String(ultimoId + 1).padStart(3, '0');
    const idProducto = `producto-${nuevoId}`;
    const dirProducto = path.join(assetsDir, idProducto);
    
    // Crear directorio para las imágenes del producto
    if (!fs.existsSync(dirProducto)) {
      fs.mkdirSync(dirProducto, { recursive: true });
      console.log(`\nDirectorio creado: ${dirProducto}`);
      
      // Crear archivo JSON del producto
      const producto = {
        id: idProducto,
        nombre: await preguntar('Nombre del producto: '),
        descripcion: await preguntar('Descripción: '),
        precio: parseFloat(await preguntar('Precio: ')),
        categoria: await preguntar('Categoría: '),
        ingredientes: (await preguntar('Ingredientes (separados por comas): '))
          .split(',').map(i => i.trim()),
        alergenos: (await preguntar('Alérgenos (separados por comas): '))
          .split(',').map(a => a.trim()).filter(Boolean),
        disponible: true,
        destacado: false,
        imagenes: [
          {
            src: `assets/products/${idProducto}/principal.jpg`,
            alt: `Imagen principal de ${idProducto}`,
            tipo: "principal"
          }
        ]
      };
      
      const rutaJson = path.join(productsDir, `${idProducto}.json`);
      fs.writeFileSync(rutaJson, JSON.stringify(producto, null, 2));
      
      console.log(`\n✅ Producto creado exitosamente!`);
      console.log(`📄 Archivo de configuración: ${rutaJson}`);
      console.log(`📁 Directorio de imágenes: ${dirProducto}`);
      console.log('\nPor favor, añade las imágenes del producto en el directorio creado.');
    } else {
      console.log(`El directorio ${dirProducto} ya existe.`);
    }
  } catch (error) {
    console.error('Error al crear el producto:', error);
  } finally {
    readline.close();
  }
}

function preguntar(pregunta) {
  return new Promise((resolve) => {
    readline.question(pregunta, (respuesta) => {
      resolve(respuesta);
    });
  });
}

// Iniciar el proceso
console.log('=== Creación de Nuevo Producto ===');
crearProducto();
