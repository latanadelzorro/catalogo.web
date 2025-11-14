// Datos de productos
const productos = [
    {
        id: 1,
        nombre: "Roscos de Vino",
        descripcion: "Deliciosos roscos esponjosos con un toque de vino tinto.",
        ingredientes: "Harina de trigo, azúcar, huevo, vino tinto, aceite de girasol, levadura, canela y ajonjolí",
        categoria: "tradicional",
        imagen: "imagenes/roscos-vino.jpeg",
        alergenos: ["Gluten", "Huevo", "Sésamo (ajonjili)"],
        destacado: true
    },
    {
        id: 2,
        nombre: "Tiramisú",
        descripcion: "Clásico postre italiano con capas de café y mascarpone.",
        ingredientes: "Queso mascarpone, huevos, azúcar, café, bizcochos de soletilla, cacao en polvo y licor de café (opcional)",
        categoria: "tradicional",
        imagen: "imagenes/tiramisu.jpg",
        alergenos: ["Gluten", "Huevo", "Lacteos", "Cafeína"],
        destacado: true
    },
    {
        id: 4,
        nombre: "Mantecados",
        descripcion: "Clásicos mantecados de canela, suaves y aromáticos.",
        ingredientes: "Harina de trigo, azúcar, manteca de cerdo, canela, ajonjili y limón",
        categoria: "navideno",
        imagen: "imagenes/mantecados.jpeg",
        alergenos: ["Gluten", "Sésamo (ajonjili)", "Sulfitos"],
        destacado: false
    },
    {
        id: 6,
        nombre: "Galletas de Jengibre",
        descripcion: "Divertidas galletas con forma de muñeco de jengibre.",
        ingredientes: "Harina de trigo, miel, azúcar moreno, mantequilla, huevo, jengibre, canela, clavo y bicarbonato",
        categoria: "navideno",
        imagen: "imagenes/galletas gengibre.jpeg",
        alergenos: ["Gluten", "Huevo", "Lacteos"],
        destacado: false
    },
    {
        id: 8,
        nombre: "Magdalenas Caseras",
        descripcion: "Esponjosas magdalenas caseras con toque de limón, recién horneadas.",
        ingredientes: "Harina de trigo, azúcar, huevos, aceite de girasol, leche, ralladura de limón, levadura y azúcar glass",
        categoria: "tradicional",
        imagen: "imagenes/macdalenas.jpeg",
        alergenos: ["Gluten", "Huevo", "Lacteos"],
        destacado: false
    },
    {
        id: 10,
        nombre: "Hojaldrinas",
        descripcion: "Delicadas pastas de hojaldre espolvoreadas con azúcar glass.",
        ingredientes: "Harina de trigo, mantequilla, agua, sal y azúcar glass",
        categoria: "tradicional",
        imagen: "imagenes/hojaldrinas.jpeg",
        alergenos: ["Gluten", "Lacteos"],
        destacado: false
    },
    {
        id: 11,
        nombre: "Palmeras",
        descripcion: "Crujientes palmeras de hojaldre caramelizadas.",
        ingredientes: "Harina de trigo, mantequilla, azúcar, sal",
        categoria: "tradicional",
        imagen: "imagenes/palmeras.avif",
        alergenos: ["Gluten", "Lacteos"],
        destacado: false
    },
    {
        id: 12,
        nombre: "Piononos",
        descripcion: "Dulce tradicional con una fina lámina de bizcocho y crema tostada.",
        ingredientes: "Harina de trigo, huevos, azúcar, leche, canela y licor",
        categoria: "tradicional",
        imagen: "imagenes/pionono.webp",
        alergenos: ["Gluten", "Huevo", "Lacteos"],
        destacado: false
    },
    {
        id: 13,
        nombre: "Roscos de Azúcar",
        descripcion: "Roscos tradicionales cubiertos de una fina capa de azúcar glass.",
        ingredientes: "Harina de trigo, azúcar, huevos, aceite de girasol, anís y azúcar glass",
        categoria: "tradicional",
        imagen: "imagenes/roscosdeazucar.jpg",
        alergenos: ["Gluten", "Huevo"],
        destacado: false
    },
    {
        id: 14,
        nombre: "Pestiños",
        descripcion: "Dulces fritos bañados en miel, típicos de la repostería andaluza.",
        ingredientes: "Harina de trigo, vino blanco, aceite de oliva, ajonjolí, anís, miel, azúcar, canela y sal",
        categoria: "tradicional",
        imagen: "imagenes/pestiños.jpg",
        alergenos: ["Gluten", "Sésamo (ajonjili)", "Sulfitos (vino)", "Miel"],
        destacado: false
    }
];

// Variables globales
let filtroActual = 'todos';

// Inicialización
function init() {
    cargarProductos();
    inicializarFiltros();
    inicializarNavbar();
    inicializarFormularioContacto();
    inicializarAnimaciones();
}

// Cargar productos en la página
function cargarProductos(filtro = 'todos') {
    const productosGrid = document.querySelector('.productos-grid');
    if (!productosGrid) return;

    // Filtrar productos según la categoría seleccionada
    let productosFiltrados = [];
    if (filtro === 'todos') {
        productosFiltrados = [...productos];
    } else {
        productosFiltrados = productos.filter(producto => producto.categoria === filtro);
    }

    // Ordenar productos: primero los destacados
    productosFiltrados.sort((a, b) => b.destacado - a.destacado);

    // Generar el HTML de los productos
    let html = '';
    productosFiltrados.forEach(producto => {
        html += `
            <div class="producto" data-categoria="${producto.categoria}">
                <div class="producto-imagen">
                    <img src="${producto.imagen}" alt="${producto.nombre}" loading="lazy">
                </div>
                <div class="producto-info">
                    <div class="producto-cabecera">
                        <span class="producto-categoria">${getCategoriaIcono(producto.categoria)} ${capitalizeFirstLetter(producto.categoria)}</span>
                        ${getAlergenosIcons(producto.alergenos).join('')}
                    </div>
                    <h3>${producto.nombre}</h3>
                    <p class="descripcion">${producto.descripcion}</p>
                    <div class="ingredientes">
                        <strong>Ingredientes:</strong> ${producto.ingredientes}
                    </div>
                    <div class="alergenos-lista">
                        <strong>Alérgenos:</strong> ${producto.alergenos.join(', ')}
                    </div>
                </div>
            </div>
        `;
    });

    productosGrid.innerHTML = html;
}

// Obtener icono de categoría
function getCategoriaIcono(categoria) {
    const iconos = {
        'tradicional': '🍰',
        'navideno': '🎄'
    };
    return iconos[categoria] || '🍽️';
}

// Obtener iconos de alérgenos
function getAlergenosIcons(alergenos) {
    const iconos = {
        'Gluten': 'fas fa-bread-slice',
        'Huevo': 'fas fa-egg',
        'Lacteos': 'fas fa-cheese',
        'Frutos secos': 'fas fa-seedling',
        'Frutos secos (almendra)': 'fas fa-seedling',
        'Sésamo (ajonjili)': 'fas fa-seedling',
        'Cafeína': 'fas fa-coffee',
        'Sulfitos': 'fas fa-wine-bottle',
        'Sulfitos (fruta confitada)': 'fas fa-wine-bottle',
        'Gluten (trazas)': 'fas fa-bread-slice',
        'Frutos secos (puede contener trazas)': 'fas fa-seedling'
    };

    return alergenos.map(alergeno => {
        const icono = iconos[alergeno] || 'fas fa-exclamation-triangle';
        return `
            <div class="alergeno-tooltip">
                <i class="${icono}" title="${alergeno}"></i>
                <span class="tooltip-text">${alergeno}</span>
            </div>
        `;
    });
}


// Capitalizar primera letra
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Inicializar los filtros de categoría
function inicializarFiltros() {
    const botonesFiltro = document.querySelectorAll('.filtro-btn');
    
    botonesFiltro.forEach(boton => {
        boton.addEventListener('click', () => {
            // Actualizar botones activos
            document.querySelector('.filtro-btn.active').classList.remove('active');
            boton.classList.add('active');
            
            // Filtrar productos
            const categoria = boton.dataset.categoria;
            cargarProductos(categoria);
            
            // Actualizar el estado del filtro
            filtroActual = categoria;
        });
    });
}

// Inicializar la barra de navegación
function inicializarNavbar() {
    const header = document.querySelector('header');
    const menuToggle = document.createElement('button');
    menuToggle.className = 'menu-toggle';
    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    menuToggle.setAttribute('aria-label', 'Menú de navegación');
    
    const nav = document.querySelector('nav');
    if (nav) {
        // Agregar botón de menú móvil
        header.insertBefore(menuToggle, nav);
        
        // Alternar menú en móviles
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            menuToggle.classList.toggle('active');
            
            // Cambiar ícono
            const icon = menuToggle.querySelector('i');
            if (nav.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // Cerrar menú al hacer clic en un enlace
        const enlaces = nav.querySelectorAll('a');
        enlaces.forEach(enlace => {
            enlace.addEventListener('click', () => {
                nav.classList.remove('active');
                menuToggle.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }
    
    // Cambiar estilo del header al hacer scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Inicializar el formulario de contacto
function inicializarFormularioContacto() {
    const formulario = document.querySelector('.contacto-form');
    if (!formulario) return;
    
    formulario.addEventListener('submit', (e) => {
        e.preventDefault();
        // Aquí iría la lógica para enviar el formulario
        mostrarNotificacion('¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.');
        formulario.reset();
    });
}

// Inicializar animaciones
function inicializarAnimaciones() {
    // Animación de entrada para los productos
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observar todos los productos
    document.querySelectorAll('.producto').forEach(producto => {
        observer.observe(producto);
    });
}

// Mostrar notificación
function mostrarNotificacion(mensaje) {
    // Crear el contenedor de notificaciones si no existe
    let notificaciones = document.querySelector('.notificaciones');
    if (!notificaciones) {
        notificaciones = document.createElement('div');
        notificaciones.className = 'notificaciones';
        document.body.appendChild(notificaciones);
    }
    
    // Crear la notificación
    const notificacion = document.createElement('div');
    notificacion.className = 'notificacion';
    notificacion.textContent = mensaje;
    
    // Agregar la notificación al contenedor
    notificaciones.appendChild(notificacion);
    
    // Mostrar la notificación
    setTimeout(() => {
        notificacion.classList.add('show');
    }, 10);
    
    // Ocultar y eliminar la notificación después de 3 segundos
    setTimeout(() => {
        notificacion.classList.remove('show');
        setTimeout(() => {
            notificacion.remove();
            // Si no hay más notificaciones, eliminar el contenedor
            if (notificaciones.children.length === 0) {
                notificaciones.remove();
            }
        }, 300);
    }, 3000);
}

// Inicializar todo cuando el documento esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Cargar productos y funcionalidades
    cargarProductos();
    
    // Inicializar tooltips de alérgenos
    if (typeof tippy === 'function') {
        tippy('[data-tippy-content]');
    }
    
    // Inicializar animaciones de scroll
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true
        });
    }
});
