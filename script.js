// Definición de la Malla Curricular con Requisitos
const CURRICULUM = [
    // PRIMER AÑO
    { id: 'LI1', name: 'Lengua Inglesa I', year: 1, prereqs: [] },
    { id: 'IGI', name: 'Introducción a la Gramática Inglesa', year: 1, prereqs: [] },
    { id: 'FI1', name: 'Fonética Inglesa I', year: 1, prereqs: [] },
    { id: 'LEFI', name: 'Lengua Extranjera - Francés I', year: 1, prereqs: [] },
    { id: 'PF', name: 'Pensamiento Filosófico', year: 1, prereqs: [] },
    { id: 'LC', name: 'Lengua y Comunicación', year: 1, prereqs: [] },

    // SEGUNDO AÑO
    { id: 'LI2', name: 'Lengua Inglesa II', year: 2, prereqs: ['LI1', 'IGI'] },
    { id: 'SI1', name: 'Sintaxis Inglesa I', year: 2, prereqs: ['LI1', 'IGI', 'LC'] },
    { id: 'FI2', name: 'Fonética Inglesa II', year: 2, prereqs: ['LI1', 'FI1'] },
    { id: 'LEFII', name: 'Lengua Extranjera - Francés II', year: 2, prereqs: ['LEFI'] },
    { id: 'HSG', name: 'Historia Social General', year: 2, prereqs: [] },
    
    // TERCER AÑO
    { id: 'LI3', name: 'Lengua Inglesa III', year: 3, prereqs: ['LI2', 'SI1'] },
    { id: 'SI2', name: 'Sintaxis Inglesa II', year: 3, prereqs: ['LI2', 'SI1', 'FI2', 'LEFII'] },
    { id: 'FI3', name: 'Fonética Inglesa III', year: 3, prereqs: ['LI2', 'FI2'] },
    { id: 'LA1', name: 'Literatura Anglófona I', year: 3, prereqs: ['LI2', 'HSG'] },
    { id: 'IL', name: 'Introducción a la Lingüística', year: 3, prereqs: ['LI2', 'SI1', 'FI2', 'LEFII'] },
    { id: 'PDA', name: 'Psicología del Desarrollo y el Aprendizaje', year: 3, prereqs: [] },
    { id: 'PSE', name: 'Problemática Social y Educativa', year: 3, prereqs: [] },
    
    // CUARTO AÑO
    { id: 'LI4', name: 'Lengua Inglesa IV', year: 4, prereqs: ['LI3', 'SI2', 'FI3', 'IL'] },
    { id: 'LA2', name: 'Literatura Anglófona II', year: 4, prereqs: ['LI3', 'SI2', 'LA1'] },
    { id: 'ADLT', name: 'Análisis del Discurso y la Lingüística del Texto', year: 4, prereqs: ['LI3', 'SI2', 'FI3', 'IL'] },
    { id: 'HPEI', name: 'Historia de los Países de Habla Inglesa', year: 4, prereqs: ['LI3'] },
    { id: 'DC', name: 'Didáctica y Currículum', year: 4, prereqs: ['PDA', 'PSE'] },
    { id: 'IE', name: 'Instituciones Educativas', year: 4, prereqs: ['PDA', 'PSE'] },

    // QUINTO AÑO
    { id: 'LI5', name: 'Lengua Inglesa V', year: 5, prereqs: ['LI4', 'ADLT'] },
    { id: 'LA3', name: 'Literatura Anglófona III', year: 5, prereqs: ['LI4', 'LA2'] },
    { id: 'ASL', name: 'Adquisición de una Segunda Lengua', year: 5, prereqs: ['LI4', 'ADLT'] },
    { id: 'S', name: 'Sociolingüística', year: 5, prereqs: ['LI4', 'ADLT'] },
    { id: 'DRE', name: 'Didáctica Específica y Residencia Docente en Inglés', year: 5, prereqs: ['LI4', 'DC', 'IE'] }
];

// Estado Global de Cursos Completados (se inicializa con localStorage)
let completedCourses = new Set();

/**
 * Inicializa la estructura HTML de la malla basándose en el arreglo CURRICULUM.
 */
function initializeRoadmapStructure() {
    const container = document.getElementById('roadmap-container');
    
    // Agrupar cursos por año
    const coursesByYear = CURRICULUM.reduce((acc, course) => {
        if (!acc[course.year]) acc[course.year] = [];
        acc[course.year].push(course);
        return acc;
    }, {});

    // Generar el HTML para cada año
    for (const year in coursesByYear) {
        const yearModule = document.createElement('div');
        yearModule.className = 'year-module';
        
        const yearTitle = document.createElement('h2');
        yearTitle.textContent = `${year}° Año`;
        yearModule.appendChild(yearTitle);

        const courseList = document.createElement('div');
        courseList.className = 'course-list';

        coursesByYear[year].forEach(course => {
            const courseDiv = document.createElement('div');
            courseDiv.className = 'course';
            courseDiv.id = `course-${course.id}`;
            courseDiv.dataset.courseId = course.id;
            courseDiv.textContent = course.name;
            courseDiv.addEventListener('click', toggleCourse);
            courseList.appendChild(courseDiv);
        });

        yearModule.appendChild(courseList);
        container.appendChild(yearModule);
    }
}

/**
 * Verifica si un curso específico ha cumplido todos sus requisitos.
 * @param {string} courseId - ID del curso a verificar.
 * @returns {boolean} - True si todos los requisitos están cumplidos, false en caso contrario.
 */
function checkPrerequisites(courseId) {
    const course = CURRICULUM.find(c => c.id === courseId);
    if (!course || course.prereqs.length === 0) {
        return true; // No tiene requisitos, siempre está desbloqueado
    }
    
    // Verifica que CADA prerrequisito esté en el Set de completedCourses
    return course.prereqs.every(prereqId => completedCourses.has(prereqId));
}

/**
 * Aplica las clases CSS (completed, unlocked, locked) a todos los cursos.
 */
function renderRoadmap() {
    const allCourses = document.querySelectorAll('.course');
    
    allCourses.forEach(courseElement => {
        const courseId = courseElement.dataset.courseId;
        
        // 1. Limpiar clases de estado previas
        courseElement.classList.remove('completed', 'unlocked', 'locked');

        // 2. Aplicar estado "Aprobado"
        if (completedCourses.has(courseId)) {
            courseElement.classList.add('completed');
            return; // Si está aprobado, no puede estar bloqueado o desbloqueado
        }

        // 3. Aplicar estado "Desbloqueado" o "Bloqueado"
        if (checkPrerequisites(courseId)) {
            courseElement.classList.add('unlocked');
        } else {
            courseElement.classList.add('locked');
        }
    });
}

/**
 * Maneja el evento de click en un curso para alternar su estado.
 * @param {Event} event - Evento de click.
 */
function toggleCourse(event) {
    const courseElement = event.currentTarget;
    const courseId = courseElement.dataset.courseId;

    // No permitir click en cursos bloqueados
    if (courseElement.classList.contains('locked')) {
        console.log(`Curso ${courseId} bloqueado. Faltan requisitos.`);
        return;
    }

    // Alternar estado de Aprobado/Desaprobado
    if (completedCourses.has(courseId)) {
        completedCourses.delete(courseId);
    } else {
        completedCourses.add(courseId);
    }
    
    // Actualizar el almacenamiento local y el renderizado
    updateLocalStorage();
    renderRoadmap();
}

/**
 * Carga el estado de los cursos desde localStorage y los aplica al estado global.
 */
function loadProgress() {
    try {
        const storedProgress = localStorage.getItem('curriculumProgress');
        if (storedProgress) {
            completedCourses = new Set(JSON.parse(storedProgress));
        }
    } catch (e) {
        console.error("Error al cargar progreso desde localStorage", e);
        // Si hay error, se mantiene el Set vacío
    }
}

/**
 * Guarda el estado actual de los cursos completados en localStorage.
 */
function updateLocalStorage() {
    try {
        // Convertir el Set a Array para poder guardarlo en JSON
        const progressArray = Array.from(completedCourses);
        localStorage.setItem('curriculumProgress', JSON.stringify(progressArray));
    } catch (e) {
        console.error("Error al guardar progreso en localStorage", e);
    }
}

// --- INICIO DE LA APLICACIÓN ---
document.addEventListener('DOMContentLoaded', () => {
    initializeRoadmapStructure(); // Crea el HTML de la malla
    loadProgress();               // Carga el progreso guardado
    renderRoadmap();              // Renderiza el estado inicial y los bloqueos/desbloqueos
    
    console.log("Malla Curricular cargada. El progreso se guarda automáticamente en el navegador.");
});
