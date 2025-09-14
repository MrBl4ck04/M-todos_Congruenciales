// Variables globales
let currentAlgorithm = 'lineal';

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeEventListeners();
    console.log('Generador de Números Aleatorios cargado correctamente');
});

// Función para inicializar la navegación entre algoritmos
function initializeNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.algorithm-section');
    
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const algorithm = this.getAttribute('data-algorithm');
            switchAlgorithm(algorithm);
        });
    });
}

// Función para cambiar entre algoritmos
function switchAlgorithm(algorithm) {
    // Actualizar botones de navegación
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-algorithm="${algorithm}"]`).classList.add('active');
    
    // Actualizar secciones
    document.querySelectorAll('.algorithm-section').forEach(section => section.classList.remove('active'));
    document.getElementById(`${algorithm}-section`).classList.add('active');
    
    currentAlgorithm = algorithm;
}

// Función para inicializar todos los event listeners
function initializeEventListeners() {
    // Botones de generar
    document.getElementById('generate-lineal').addEventListener('click', () => generateLinear());
    document.getElementById('generate-multiplicativo').addEventListener('click', () => generateMultiplicative());
    
    // Botones de limpiar
    document.getElementById('clear-lineal').addEventListener('click', () => clearResults('lineal'));
    document.getElementById('clear-multiplicativo').addEventListener('click', () => clearResults('multiplicativo'));
    
    // Event listeners para radio buttons del algoritmo multiplicativo
    document.querySelectorAll('input[name="k-formula"]').forEach(radio => {
        radio.addEventListener('change', updateKFormula);
    });
    
    // Event listeners para el modal
    initializeModal();
}

// Función para inicializar el modal
function initializeModal() {
    const modal = document.getElementById('modal');
    const closeBtn = document.querySelector('.modal-close');
    const okBtn = document.getElementById('modal-ok');
    
    // Cerrar modal con X
    closeBtn.addEventListener('click', closeModal);
    
    // Cerrar modal con botón Aceptar
    okBtn.addEventListener('click', closeModal);
    
    // Cerrar modal haciendo clic fuera del contenido
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });
    
    // Cerrar modal con tecla Escape
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });
}

// Función para mostrar modal
function showModal(title, message) {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-message').textContent = message;
    document.getElementById('modal').style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevenir scroll del body
}

// Función para cerrar modal
function closeModal() {
    document.getElementById('modal').style.display = 'none';
    document.body.style.overflow = 'auto'; // Restaurar scroll del body
}

// Función para actualizar la fórmula K en el algoritmo multiplicativo
function updateKFormula() {
    const selectedFormula = document.querySelector('input[name="k-formula"]:checked').value;
    const kInput = document.getElementById('k-multiplicativo');
    
    if (selectedFormula === '3+8k') {
        kInput.placeholder = 'K para 3 + 8k';
    } else {
        kInput.placeholder = 'K para 5 + 8k';
    }
}

// Función para generar números aleatorios con algoritmo lineal
function generateLinear() {
    try {
        // Obtener valores de entrada
        const x0 = parseInt(document.getElementById('x0-lineal').value);
        const k = parseInt(document.getElementById('k-lineal').value);
        const c = parseInt(document.getElementById('c-lineal').value);
        const p = parseInt(document.getElementById('p-lineal').value);
        const d = parseInt(document.getElementById('d-lineal').value);
        
        // Validar entrada
        if (!validateLinearInputs(x0, k, c, p, d)) {
            return;
        }
        
        // Calcular parámetros derivados
        const derivedParams = calculateDerivedParams(k, c, p);
        
        // Mostrar parámetros derivados
        displayDerivedParams(derivedParams);
        
        // Generar números aleatorios usando 'a' y 'm' calculados
        const results = generateLinearSequence(x0, derivedParams.a, c, p, d, derivedParams.m);
        
        // Mostrar resultados en la tabla
        displayResults('lineal', results);
        
    } catch (error) {
        showModal('Error', 'Error al generar números aleatorios: ' + error.message);
    }
}

// Función para generar números aleatorios con algoritmo multiplicativo
function generateMultiplicative() {
    try {
        // Obtener valores de entrada
        const x0 = parseInt(document.getElementById('x0-multiplicativo').value);
        const k = parseInt(document.getElementById('k-multiplicativo').value);
        const p = parseInt(document.getElementById('p-multiplicativo').value);
        const d = parseInt(document.getElementById('d-multiplicativo').value);
        const formula = document.querySelector('input[name="k-formula"]:checked').value;
        
        // Validar entrada
        if (!validateMultiplicativeInputs(x0, k, p, d)) {
            return;
        }
        
        // Calcular parámetros derivados
        const derivedParams = calculateDerivedParamsMultiplicative(k, p, formula);
        
        // Mostrar parámetros derivados
        displayDerivedParamsMultiplicative(derivedParams);
        
        // Generar números aleatorios usando 'a' y 'm' calculados
        const results = generateMultiplicativeSequence(x0, derivedParams.a, p, d, derivedParams.m);
        
        // Mostrar resultados en la tabla
        displayResults('multiplicativo', results);
        
    } catch (error) {
        showModal('Error', 'Error al generar números aleatorios: ' + error.message);
    }
}

// Función para calcular parámetros derivados
function calculateDerivedParams(k, c, p) {
    // Calcular g: g = ln(P)/ln(2)
    const g = Math.log(p) / Math.log(2);
    
    // Calcular a: a = 1 + 4 * k
    const a = 1 + 4 * k;
    
    // Calcular m: m = 2^g
    const m = Math.pow(2, g);
    
    return {
        a: a,
        c: c,
        g: g,
        m: m
    };
}

// Función para mostrar parámetros derivados
function displayDerivedParams(params) {
    document.getElementById('a-value').textContent = params.a;
    document.getElementById('c-value').textContent = params.c;
    document.getElementById('g-value').textContent = params.g.toFixed(4);
    document.getElementById('m-value').textContent = params.m;
}

// Función para calcular parámetros derivados del algoritmo multiplicativo
function calculateDerivedParamsMultiplicative(k, p, formula) {
    // Calcular g: g = ln(P)/ln(2) + 2
    const g = (Math.log(p) / Math.log(2)) + 2;
    
    // Calcular m: m = 2^g
    const m = Math.pow(2, g);
    
    // Calcular a según la fórmula seleccionada
    let a;
    if (formula === '3+8k') {
        a = 3 + 8 * k;
    } else {
        a = 5 + 8 * k;
    }
    
    return {
        a: a,
        g: g,
        m: m
    };
}

// Función para mostrar parámetros derivados del algoritmo multiplicativo
function displayDerivedParamsMultiplicative(params) {
    document.getElementById('a-value-multiplicativo').textContent = params.a;
    document.getElementById('g-value-multiplicativo').textContent = params.g.toFixed(4);
    document.getElementById('m-value-multiplicativo').textContent = params.m;
}


// Función para validar entradas del algoritmo lineal
function validateLinearInputs(x0, k, c, p, d) {
    if (isNaN(x0) || isNaN(k) || isNaN(c) || isNaN(p) || isNaN(d)) {
        showModal('Error de Validación', 'Por favor, complete todos los campos con valores numéricos válidos.');
        return false;
    }
    
    if (x0 < 0 || k < 0 || c < 0 || p <= 0 || d < 0) {
        showModal('Error de Validación', 'Los valores deben ser positivos (excepto C que puede ser 0).');
        return false;
    }
    
    if (d < 0 || d > 10 || !Number.isInteger(d)) {
        showModal('Error de Validación', 'El número de decimales debe ser un entero entre 0 y 10.');
        return false;
    }
    
    return true;
}

// Función para validar entradas del algoritmo multiplicativo
function validateMultiplicativeInputs(x0, k, p, d) {
    if (isNaN(x0) || isNaN(k) || isNaN(p) || isNaN(d)) {
        showModal('Error de Validación', 'Por favor, complete todos los campos con valores numéricos válidos.');
        return false;
    }
    
    if (x0 < 0 || k < 0 || p <= 0 || d < 0) {
        showModal('Error de Validación', 'Los valores deben ser positivos.');
        return false;
    }
    
    if (d < 0 || d > 10 || !Number.isInteger(d)) {
        showModal('Error de Validación', 'El número de decimales debe ser un entero entre 0 y 10.');
        return false;
    }
    
    // Validación específica para algoritmo multiplicativo: la semilla debe ser impar
    if (x0 % 2 === 0) {
        showModal('Error de Validación', 'Para el algoritmo multiplicativo, la semilla (X₀) debe ser un número impar para garantizar un período máximo.');
        return false;
    }
    
    return true;
}

// Función para generar secuencia con algoritmo lineal congruencial
function generateLinearSequence(x0, a, c, p, d, m) {
    const results = [];
    let xi = x0;
    let i = 0;
    
    while (i < m) { // Generar exactamente m números aleatorios
        const operation = `${a} × ${xi} + ${c} MOD ${m} = ${(a * xi + c) % m}`;
        const nextXi = (a * xi + c) % m;
        const ri = (nextXi / (m - 1)).toFixed(d);
        
        results.push({
            i: i + 1, // Empezar desde 1 como en la imagen
            xiMinus1: xi,
            operation: operation,
            xi: nextXi,
            ri: ri
        });
        
        xi = nextXi;
        i++;
    }
    
    return results;
}

// Función para generar secuencia con algoritmo multiplicativo congruencial
function generateMultiplicativeSequence(x0, a, p, d, m) {
    const results = [];
    let xi = x0;
    let i = 0;
    
    while (i < p) { // Generar exactamente P números aleatorios
        const operation = `${a} × ${xi} MOD ${m} = ${(a * xi) % m}`;
        const nextXi = (a * xi) % m;
        const ri = (nextXi / (m - 1)).toFixed(d);
        
        results.push({
            i: i + 1, // Empezar desde 1 como en la imagen
            xiMinus1: xi,
            operation: operation,
            xi: nextXi,
            ri: ri
        });
        
        xi = nextXi;
        i++;
    }
    
    return results;
}

// Función para mostrar resultados en la tabla
function displayResults(algorithm, results) {
    const tbody = document.querySelector(`#results-${algorithm} tbody`);
    tbody.innerHTML = '';
    
    if (results.length === 0) {
        const row = tbody.insertRow();
        const cell = row.insertCell();
        cell.colSpan = 5;
        cell.textContent = 'No se pudieron generar números aleatorios con los parámetros dados.';
        cell.style.textAlign = 'center';
        cell.style.color = '#dc3545';
        cell.style.fontStyle = 'italic';
        return;
    }
    
    results.forEach(result => {
        const row = tbody.insertRow();
        
        const cell1 = row.insertCell();
        cell1.textContent = result.i;
        
        const cell2 = row.insertCell();
        cell2.textContent = result.xiMinus1;
        
        const cell3 = row.insertCell();
        cell3.textContent = result.operation;
        
        const cell4 = row.insertCell();
        cell4.textContent = result.xi;
        
        const cell5 = row.insertCell();
        cell5.textContent = result.ri;
    });
}

// Función para limpiar resultados
function clearResults(algorithm) {
    const tbody = document.querySelector(`#results-${algorithm} tbody`);
    tbody.innerHTML = '';
    
    // Limpiar campos de entrada
    const inputs = document.querySelectorAll(`#${algorithm}-section input[type="number"]`);
    inputs.forEach(input => input.value = '');
    
    // Limpiar parámetros derivados
    if (algorithm === 'lineal') {
        document.getElementById('a-value').textContent = '-';
        document.getElementById('c-value').textContent = '-';
        document.getElementById('g-value').textContent = '-';
        document.getElementById('m-value').textContent = '-';
        
    } else if (algorithm === 'multiplicativo') {
        document.getElementById('a-value-multiplicativo').textContent = '-';
        document.getElementById('g-value-multiplicativo').textContent = '-';
        document.getElementById('m-value-multiplicativo').textContent = '-';
        
    }
    
    // Resetear radio buttons del algoritmo multiplicativo
    if (algorithm === 'multiplicativo') {
        document.querySelector('input[name="k-formula"][value="3+8k"]').checked = true;
        updateKFormula();
    }
}

// Función para generar números aleatorios con valores por defecto (para testing)
function generateWithDefaults(algorithm) {
    if (algorithm === 'lineal') {
        document.getElementById('x0-lineal').value = '5';
        document.getElementById('k-lineal').value = '3';
        document.getElementById('c-lineal').value = '7';
        document.getElementById('p-lineal').value = '16';
        document.getElementById('d-lineal').value = '4';
        generateLinear();
    } else {
        document.getElementById('x0-multiplicativo').value = '5';
        document.getElementById('k-multiplicativo').value = '1';
        document.getElementById('p-multiplicativo').value = '16';
        document.getElementById('d-multiplicativo').value = '4';
        generateMultiplicative();
    }
}

// Función para exportar resultados a CSV
function exportToCSV(algorithm) {
    const table = document.getElementById(`results-${algorithm}`);
    const rows = Array.from(table.querySelectorAll('tbody tr'));
    
    if (rows.length === 0) {
        showModal('Error', 'No hay datos para exportar.');
        return;
    }
    
    let csv = 'i,Xi-1,Operación,Xi,ri\n';
    
    rows.forEach(row => {
        const cells = Array.from(row.cells);
        if (cells.length === 5) {
            const rowData = cells.map(cell => `"${cell.textContent}"`).join(',');
            csv += rowData + '\n';
        }
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `numeros_aleatorios_${algorithm}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
}

// Función para calcular estadísticas básicas
function calculateStatistics(results) {
    if (results.length === 0) return null;
    
    const riValues = results.map(r => parseFloat(r.ri));
    const sum = riValues.reduce((a, b) => a + b, 0);
    const mean = sum / riValues.length;
    
    const variance = riValues.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / riValues.length;
    const standardDeviation = Math.sqrt(variance);
    
    return {
        count: results.length,
        mean: mean,
        variance: variance,
        standardDeviation: standardDeviation,
        min: Math.min(...riValues),
        max: Math.max(...riValues)
    };
}

// Función para probar el formato de decimales
function testDecimalFormatting() {
    console.log('Prueba de formato de decimales:');
    console.log('D=0:', (5/8).toFixed(0)); // "1"
    console.log('D=1:', (5/8).toFixed(1)); // "0.6"
    console.log('D=2:', (5/8).toFixed(2)); // "0.63"
    console.log('D=3:', (5/8).toFixed(3)); // "0.625"
    console.log('D=4:', (5/8).toFixed(4)); // "0.6250"
    
    console.log('\nComparación con parseFloat:');
    console.log('Con parseFloat:', parseFloat((5/8).toFixed(4))); // 0.625 (sin ceros)
    console.log('Sin parseFloat:', (5/8).toFixed(4)); // "0.6250" (con ceros)
    
    console.log('\nPrueba de normalización correcta (P=8):');
    console.log('X=1, rᵢ = 1/7 =', (1/7).toFixed(4)); // "0.1429"
    console.log('X=4, rᵢ = 4/7 =', (4/7).toFixed(4)); // "0.5714"
    console.log('X=3, rᵢ = 3/7 =', (3/7).toFixed(4)); // "0.4286"
    console.log('X=6, rᵢ = 6/7 =', (6/7).toFixed(4)); // "0.8571"
    console.log('X=5, rᵢ = 5/7 =', (5/7).toFixed(4)); // "0.7143"
    console.log('X=0, rᵢ = 0/7 =', (0/7).toFixed(4)); // "0.0000"
    console.log('X=7, rᵢ = 7/7 =', (7/7).toFixed(4)); // "1.0000"
    console.log('X=2, rᵢ = 2/7 =', (2/7).toFixed(4)); // "0.2857"
}

// Ejecutar pruebas al cargar
testDecimalFormatting();
