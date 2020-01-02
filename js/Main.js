window.onload = function () {
    let canvas = document.getElementById('canvas');
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);




    let renderer = new THREE.WebGLRenderer({canvas: canvas});
    renderer.setClearColor(0x000000);
    window.addEventListener('resize', function () {
        width = window.innerWidth;
        height = window.innerHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });

    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 5000);
    camera.position.set(0, 0, 1000);


    controls = new THREE.OrbitControls(camera, renderer.domElement);

    let light = new THREE.AmbientLight(0xffffff);
    scene.add(light);

    let axesHelper = new THREE.AxesHelper(500);
    scene.add(axesHelper);




    let circuit = new Circuit(scene, 'Current_line');
    let particles = generateParticles(50, 100, scene);

    function update() {
        moveParticles(circuit, 0.001, particles);
        // console.log(particles[0].mesh.position.x);
    }

    function loop() {
        update();
        console.log(particles[0].mesh.position.x);

        renderer.render(scene, camera);
        requestAnimationFrame(function () { loop(); });
    }
    loop();
};
