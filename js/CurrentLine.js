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

    let geometry = new THREE.CylinderGeometry(3, 3, 300);
    let material = new THREE.MeshBasicMaterial({color: 0xffff00});

    let mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);



    function update() {
        mesh.rotation.y += Math.PI / 500;
    }

    function loop() {
        update();

        renderer.render(scene, camera);
        requestAnimationFrame(function () { loop(); });
    }
    loop();
};

console.log(Config);



