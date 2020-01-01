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

    /*let geometry = new THREE.SphereGeometry(200, 12, 12);
    // THREE.FaceColors makes it possible to give each face its own colour.
    let material = new THREE.MeshBasicMaterial({color: 0xffffff, vertexColors: THREE.FaceColors});
    for(let i = 0; i < geometry.faces.length; ++i) {
        geometry.faces[i].color.setRGB(Math.random(), Math.random(), Math.random());
    }*/
    let axesHelper = new THREE.AxesHelper(500);
    scene.add(axesHelper);

    CurrentLine(scene);
    let particles = generateParticles(50, 100, scene);


    function update() {
        moveParticles(null, 0.001, particles);
    }

    function loop() {
        update();

        renderer.render(scene, camera);
        requestAnimationFrame(function () { loop(); });
    }
    loop();
};
