// Función principal para manejar el clic y el estado
function toggleTopicCompletion(event) {
    const topic = event.currentTarget; // El elemento <li>
    
    // 1. Alternar la clase 'completed'
    topic.classList.toggle('completed');

    // 2. Guardar el estado en el almacenamiento local (localStorage)
    // Usamos el atributo 'data-topic' como la clave única
    const topicId = topic.getAttribute('data-topic');
    
    if (topic.classList.contains('completed')) {
        // Si está completado, guardamos 'true'
        localStorage.setItem(topicId, 'true');
    } else {
        // Si se desmarca, removemos la clave
        localStorage.removeItem(topicId);
    }
}

// Función para cargar el progreso al iniciar la página
function loadProgress() {
    // Obtenemos todos los temas
    const topics = document.querySelectorAll('.topic');
    
    topics.forEach(topic => {
        const topicId = topic.getAttribute('data-topic');
        
        // Revisamos si el tema está marcado como completado en localStorage
        if (localStorage.getItem(topicId) === 'true') {
            topic.classList.add('completed');
        }
        
        // Agregamos el escuchador de eventos para hacer clic
        topic.addEventListener('click', toggleTopicCompletion);
    });
}

// Ejecutar la función cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', loadProgress);
