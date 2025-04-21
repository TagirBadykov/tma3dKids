// Скрипт для страницы редактора
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('3dCanvas');
    if (!canvas) return;
    
    // Инициализация Three.js для 3D редактора
    // Это упрощенный пример, в реальном приложении потребуется более сложная реализация
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setClearColor(0xf0f0f0);
    
    // Освещение
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Начальная фигура (куб)
    let currentShape = createCube();
    scene.add(currentShape);
    
    camera.position.z = 5;
    
    // Обработчики элементов управления
    const shapeButtons = document.querySelectorAll('.shapes button');
    shapeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const shapeType = this.getAttribute('data-shape');
            scene.remove(currentShape);
            
            switch(shapeType) {
                case 'cube':
                    currentShape = createCube();
                    break;
                case 'sphere':
                    currentShape = createSphere();
                    break;
                case 'cylinder':
                    currentShape = createCylinder();
                    break;
                case 'pyramid':
                    currentShape = createPyramid();
                    break;
            }
            
            scene.add(currentShape);
            updateColor();
        });
    });
    
    const sizeControl = document.getElementById('sizeControl');
    sizeControl.addEventListener('input', function() {
        const size = parseFloat(this.value) / 5;
        currentShape.scale.set(size, size, size);
    });
    
    const colorControl = document.getElementById('colorControl');
    colorControl.addEventListener('input', updateColor);
    
    function updateColor() {
        if (currentShape.material) {
            currentShape.material.color.set(colorControl.value);
        } else if (currentShape.children.length > 0) {
            // Для составных фигур (например, пирамиды)
            currentShape.children.forEach(child => {
                if (child.material) {
                    child.material.color.set(colorControl.value);
                }
            });
        }
    }
    
    // Вращение
    const rotateX = document.getElementById('rotateX');
    const rotateY = document.getElementById('rotateY');
    const rotateZ = document.getElementById('rotateZ');
    
    rotateX.addEventListener('click', function() {
        currentShape.rotation.x += 0.2;
    });
    
    rotateY.addEventListener('click', function() {
        currentShape.rotation.y += 0.2;
    });
    
    rotateZ.addEventListener('click', function() {
        currentShape.rotation.z += 0.2;
    });
    
    // Сохранение
    const saveBtn = document.getElementById('saveBtn');
    saveBtn.addEventListener('click', function() {
        alert('Фигура сохранена! (В реальном приложении здесь будет реализовано сохранение)');
    });
    
    // Функции создания фигур
    function createCube() {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
        return new THREE.Mesh(geometry, material);
    }
    
    function createSphere() {
        const geometry = new THREE.SphereGeometry(0.5, 32, 32);
        const material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
        return new THREE.Mesh(geometry, material);
    }
    
    function createCylinder() {
        const geometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
        const material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
        return new THREE.Mesh(geometry, material);
    }
    
    function createPyramid() {
        const group = new THREE.Group();
        
        // Основание пирамиды (квадрат)
        const baseGeometry = new THREE.BoxGeometry(1, 0.1, 1);
        const baseMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.y = -0.45;
        group.add(base);
        
        // Боковые грани (4 треугольника)
        for (let i = 0; i < 4; i++) {
            const geometry = new THREE.ConeGeometry(0.7, 1, 3, 1);
            geometry.rotateY(i * Math.PI / 2);
            geometry.translate(0, 0.5, 0);
            const material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
            const side = new THREE.Mesh(geometry, material);
            group.add(side);
        }
        
        return group;
    }
    
    // Анимация
    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Обработка изменения размера окна
    window.addEventListener('resize', function() {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    });
});