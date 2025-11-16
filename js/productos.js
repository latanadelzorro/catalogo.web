// Función para cargar un producto desde un archivo JSON
async function cargarProducto(ruta) {
    try {
        const respuesta = await fetch(ruta);
        if (!respuesta.ok) {
            throw new Error(`Error al cargar el producto: ${respuesta.status}`);
        }
        return await respuesta.json();
    } catch (error) {
        console.error(`Error al cargar el producto desde ${ruta}:`, error);
        return null;
    }
}

// Función para crear el HTML de un producto
function crearElementoProducto(producto) {
    if (!producto) return '';

    // Mapeo de íconos de alérgenos
    const iconosAlergenos = {
        'gluten': 'fas fa-bread-slice',
        'huevo': 'fas fa-egg',
        'lacteos': 'fas fa-cheese',
        'sesamo': 'fas fa-seedling',
        'frutos-secos': 'fas fa-seedling',
        'cafeina': 'fas fa-coffee',
        'vino': 'fas fa-wine-bottle',
        'sulfitos': 'fas fa-wine-bottle'
    };

    // Crear elementos de alérgenos
    const alergenosHTML = producto.alergenos
        .map(alergeno => `
            <div class="alergeno-tooltip">
                <i class="${iconosAlergenos[alergeno] || 'fas fa-exclamation-triangle'}" title="${alergeno}"></i>
                <span class="tooltip-text">${alergeno}</span>
            </div>`
        )
        .join('');

    // No mostramos las variantes de tamaño

    // Formatear la categoría para mostrarla
    const categoriaFormateada = producto.categoria
        .split('-')
        .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
        .join(' ');

    // Crear el HTML del producto
    return `
    <div class="producto" data-categoria="${producto.categoria}">
        <div class="producto-imagen">
            <img src="${producto.imagenes[0].src}" alt="${producto.imagenes[0].alt}" loading="lazy">
        </div>
        <div class="producto-info">
            <div class="producto-cabecera">
                <span class="producto-categoria" data-categoria="${producto.categoria}">${categoriaFormateada}</span>
                ${alergenosHTML}
            </div>
            <h3>${producto.nombre}</h3>
            <p class="descripcion">${producto.descripcion}</p>
            <div class="ingredientes">
                <strong>Ingredientes:</strong> ${producto.ingredientes.join(', ')}
            </div>
            <div class="producto-pie">
                <div class="precio">${producto.precio.toFixed(2)} €</div>
            </div>
        </div>
    </div>`;
}

// Función principal para cargar y mostrar los productos
async function cargarProductos() {
    const contenedorProductos = document.querySelector('.grid-productos');
    if (!contenedorProductos) return;

    try {
        // Obtener lista de archivos de productos
        const response = await fetch('data/productos/lista-productos.json');
        if (!response.ok) {
            throw new Error('No se pudo cargar la lista de productos');
        }
        
        const listaProductos = await response.json();
        let productosHTML = '';

        // Cargar cada producto
        for (const productoInfo of listaProductos) {
            const producto = await cargarProducto(`data/productos/${productoInfo.archivo}`);
            if (producto) {
                productosHTML += crearElementoProducto(producto);
            }
        }

        // Insertar los productos en el DOM
        contenedorProductos.innerHTML = productosHTML;

        // Inicializar los tooltips de alérgenos
        inicializarTooltips();
        
        // Inicializar los filtros de categorías
        inicializarFiltros();
        
        // Inicializar el carrito
        inicializarCarrito();

    } catch (error) {
        console.error('Error al cargar los productos:', error);
        contenedorProductos.innerHTML = `
            <div class="error-carga">
                <p>No se pudieron cargar los productos. Por favor, inténtalo de nuevo más tarde.</p>
                <button class="btn" onclick="cargarProductos()">Reintentar</button>
            </div>`;
    }
}

// Función para inicializar los tooltips de alérgenos
function inicializarTooltips() {
    const tooltips = document.querySelectorAll('.alergeno-tooltip');
    
    tooltips.forEach(tooltip => {
        const icono = tooltip.querySelector('i');
        const tooltipText = tooltip.querySelector('.tooltip-text');
        
        tooltip.addEventListener('mouseenter', () => {
            // Posicionar el tooltip
            const rect = icono.getBoundingClientRect();
            tooltipText.style.left = `${rect.left + window.scrollX}px`;
            tooltipText.style.top = `${rect.top + window.scrollY - 30}px`;
            tooltipText.style.visibility = 'visible';
            tooltipText.style.opacity = '1';
        });
        
        tooltip.addEventListener('mouseleave', () => {
            tooltipText.style.visibility = 'hidden';
            tooltipText.style.opacity = '0';
        });
    });
}

// Función para inicializar los filtros de categorías
function inicializarFiltros() {
    const botonesFiltro = document.querySelectorAll('.filtro-pill');
    const gridProductos = document.querySelector('.grid-productos');

    // Función para filtrar productos
    function filtrarProductos(categoria) {
        const productos = document.querySelectorAll('.producto');
        let productosFiltrados = 0;
        
        productos.forEach(producto => {
            const productoVisible = categoria === 'todos' || 
                                 producto.dataset.categoria === categoria ||
                                 (categoria === 'sin-gluten' && !producto.dataset.categoria.includes('gluten'));
            
            if (productoVisible) {
                producto.style.display = 'block';
                productosFiltrados++;
            } else {
                producto.style.display = 'none';
            }
        });

        // Mostrar mensaje si no hay productos en la categoría
        const mensajeNoResultados = document.querySelector('.sin-resultados');
        if (productosFiltrados === 0) {
            if (!mensajeNoResultados) {
                const mensaje = document.createElement('div');
                mensaje.className = 'sin-resultados';
                mensaje.textContent = 'No hay productos disponibles en esta categoría.';
                mensaje.style.gridColumn = '1 / -1';
                mensaje.style.textAlign = 'center';
                mensaje.style.padding = '2rem';
                mensaje.style.fontSize = '1.1rem';
                mensaje.style.color = '#666';
                gridProductos.appendChild(mensaje);
            }
        } else if (mensajeNoResultados) {
            mensajeNoResultados.remove();
        }
    }

    // Agregar evento de clic a cada botón de filtro
    botonesFiltro.forEach(boton => {
        boton.addEventListener('click', () => {
            // Actualizar botón activo
            document.querySelector('.filtro-pill.is-active').classList.remove('is-active');
            boton.classList.add('is-active');

            // Obtener la categoría del atributo data-categoria
            const categoria = boton.dataset.categoria;
            
            // Filtrar productos
            filtrarProductos(categoria);

            // Actualizar la URL con el filtro seleccionado (para compartir o guardar)
            const url = new URL(window.location);
            if (categoria === 'todos') {
                url.searchParams.delete('categoria');
            } else {
                url.searchParams.set('categoria', categoria);
            }
            window.history.pushState({}, '', url);
        });
    });

    // Aplicar filtro inicial desde la URL si existe
    const urlParams = new URLSearchParams(window.location.search);
    const categoriaInicial = urlParams.get('categoria');
    if (categoriaInicial) {
        const botonInicial = document.querySelector(`.filtro-pill[data-categoria="${categoriaInicial}"]`);
        if (botonInicial) {
            botonInicial.click();
        }
    }
}

// Función para inicializar el carrito (vacía ya que no hay funcionalidad de carrito)
function inicializarCarrito() {
    // No hay funcionalidad de carrito
}

// Función para mostrar notificaciones
function mostrarNotificacion(mensaje) {
    const notificacion = document.createElement('div');
    notificacion.className = 'notificacion';
    notificacion.textContent = mensaje;
    document.body.appendChild(notificacion);
    
    // Mostrar la notificación
    setTimeout(() => {
        notificacion.classList.add('mostrar');
    }, 10);
    
    // Ocultar y eliminar la notificación después de 3 segundos
    setTimeout(() => {
        notificacion.classList.remove('mostrar');
        setTimeout(() => {
            document.body.removeChild(notificacion);
        }, 300);
    }, 3000);
}

// Crear un archivo de lista de productos
async function crearListaProductos() {
    const listaProductos = [
        { id: '001', archivo: 'producto-001.json' },
        { id: '002', archivo: 'producto-002.json' },
        { id: '003', archivo: 'producto-003.json' },
        { id: '004', archivo: 'producto-004.json' },
        { id: '005', archivo: 'producto-005.json' },
        { id: '006', archivo: 'producto-006.json' },
        { id: '007', archivo: 'producto-007.json' },
        { id: '008', archivo: 'producto-008.json' }
    ];

    // Guardar la lista de productos en un archivo JSON
    const jsonData = JSON.stringify(listaProductos, null, 2);
    
    // Crear un Blob con el contenido
    const blob = new Blob([jsonData], { type: 'application/json' });
    
    // Crear un enlace de descarga
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'lista-productos.json';
    
    // Simular clic en el enlace para iniciar la descarga
    document.body.appendChild(a);
    a.click();
    
    // Limpiar
    setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(a.href);
    }, 100);
}

// Cargar los productos cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Verificar si estamos en la página de productos
    if (document.querySelector('.grid-productos')) {
        cargarProductos();
    }
});
