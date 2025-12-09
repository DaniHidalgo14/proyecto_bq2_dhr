const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const themeToggle = document.getElementById('themeToggle');
const searchBtn = document.getElementById('searchBtn');
const searchInput = document.getElementById('searchInput');
const randomBtn = document.getElementById('randomBtn');
const resultsGrid = document.getElementById('resultsGrid');
const alertContainer = document.getElementById('alertContainer');
const modal = document.getElementById('cocktailModal');
const modalClose = document.getElementById('modalClose');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');

// Menú hamburguesa
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Cerrar menú al hacer click en enlaces
const navLinks = document.querySelectorAll('.nav-menu a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Modo claro/oscuro
themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
});

// Buscar cócteles
searchBtn.addEventListener('click', buscarCocteles);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        buscarCocteles();
    }
});

// Cóctel aleatorio
randomBtn.addEventListener('click', obtenerCoctelAleatorio);

// Cerrar modal
modalClose.addEventListener('click', cerrarModal);
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        cerrarModal();
    }
});

// Funciones
function buscarCocteles() {
    const termino = searchInput.value.trim();
    
    if (!termino) {
        mostrarAlerta('Por favor, introduce un término de búsqueda', 'warning');
        return;
    }

    fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${termino}`)
        .then(respuesta => respuesta.json())
        .then(datos => {
            if (datos.drinks) {
                mostrarResultados(datos.drinks);
            } else {
                mostrarAlerta('No se encontraron resultados', 'info');
                limpiarResultados();
            }
        })
        .catch(error => {
            mostrarAlerta('Error de conexión. Por favor, intenta de nuevo', 'danger');
            console.error('Error:', error);
        });
}

function obtenerCoctelAleatorio() {
    fetch('https://www.thecocktaildb.com/api/json/v1/1/random.php')
        .then(respuesta => respuesta.json())
        .then(datos => {
            if (datos.drinks) {
                mostrarResultados(datos.drinks);
            }
        })
        .catch(error => {
            mostrarAlerta('Error de conexión. Por favor, intenta de nuevo', 'danger');
            console.error('Error:', error);
        });
}

function mostrarResultados(cocteles) {
    limpiarResultados();
    
    cocteles.forEach(coctel => {
        const card = document.createElement('div');
        card.className = 'cocktail-card';
        
        const img = document.createElement('img');
        img.src = coctel.strDrinkThumb;
        img.alt = coctel.strDrink;
        img.className = 'card-image';
        
        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';
        
        const title = document.createElement('h3');
        title.className = 'card-title';
        title.textContent = coctel.strDrink;
        
        const category = document.createElement('p');
        category.className = 'card-category';
        category.textContent = coctel.strCategory;
        
        const btn = document.createElement('button');
        btn.className = 'btn-primary';
        btn.textContent = 'Ver más';
        btn.style.width = '100%';
        btn.addEventListener('click', () => mostrarDetalles(coctel));
        
        cardBody.appendChild(title);
        cardBody.appendChild(category);
        cardBody.appendChild(btn);
        
        card.appendChild(img);
        card.appendChild(cardBody);
        
        resultsGrid.appendChild(card);
    });
}

function mostrarDetalles(coctel) {
    modalTitle.textContent = coctel.strDrink;
    
    // Limpiar contenido previo
    while (modalBody.firstChild) {
        modalBody.removeChild(modalBody.firstChild);
    }
    
    const img = document.createElement('img');
    img.src = coctel.strDrinkThumb;
    img.alt = coctel.strDrink;
    img.className = 'modal-image';
    
    const category = document.createElement('p');
    category.innerHTML = '<strong>Categoría:</strong> ' + coctel.strCategory;
    
    const alcoholic = document.createElement('p');
    alcoholic.innerHTML = '<strong>Tipo:</strong> ' + coctel.strAlcoholic;
    
    const instructions = document.createElement('p');
    instructions.innerHTML = '<strong>Instrucciones:</strong><br>' + coctel.strInstructions;
    instructions.style.marginTop = '1rem';
    
    const ingredientsTitle = document.createElement('h4');
    ingredientsTitle.textContent = 'Ingredientes';
    ingredientsTitle.style.marginTop = '1.5rem';
    
    const ingredientsList = document.createElement('ul');
    ingredientsList.className = 'ingredient-list';
    
    for (let i = 1; i <= 15; i++) {
        const ingredient = coctel[`strIngredient${i}`];
        const measure = coctel[`strMeasure${i}`];
        
        if (ingredient) {
            const li = document.createElement('li');
            li.className = 'ingredient-item';
            li.textContent = `${measure || ''} ${ingredient}`.trim();
            ingredientsList.appendChild(li);
        }
    }
    
    modalBody.appendChild(img);
    modalBody.appendChild(category);
    modalBody.appendChild(alcoholic);
    modalBody.appendChild(instructions);
    modalBody.appendChild(ingredientsTitle);
    modalBody.appendChild(ingredientsList);
    
    modal.classList.add('active');
}

function cerrarModal() {
    modal.classList.remove('active');
}

function mostrarAlerta(mensaje, tipo) {
    limpiarAlertas();
    
    const alert = document.createElement('div');
    alert.className = `alert alert-${tipo} alert-dismissible fade show`;
    alert.setAttribute('role', 'alert');
    
    const texto = document.createTextNode(mensaje);
    alert.appendChild(texto);
    
    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'btn-close';
    closeBtn.setAttribute('data-bs-dismiss', 'alert');
    closeBtn.setAttribute('aria-label', 'Close');
    
    alert.appendChild(closeBtn);
    alertContainer.appendChild(alert);
    
    setTimeout(() => {
        alert.remove();
    }, 5000);
}

function limpiarResultados() {
    while (resultsGrid.firstChild) {
        resultsGrid.removeChild(resultsGrid.firstChild);
    }
}

function limpiarAlertas() {
    while (alertContainer.firstChild) {
        alertContainer.removeChild(alertContainer.firstChild);
    }
}