import * as THREE from 'three';
import * as dat from 'dat.gui';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {moveParticles, generateParticles} from "./particles";
import Circuit from "./Circuit";


window.onload = function () {
    const canvas = document.getElementById('canvas');
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);

    const renderer = new THREE.WebGLRenderer({canvas: canvas});
    renderer.setClearColor(0x000000);
    window.addEventListener('resize', function () {
        width = window.innerWidth;
        height = window.innerHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 5000);
    camera.position.set(0, 0, 1000);


    let controls = new OrbitControls(camera, renderer.domElement);

    const light = new THREE.AmbientLight(0xffffff);
    scene.add(light);

    const axesHelper = new THREE.AxesHelper(500);
    scene.add(axesHelper);

    let gui = new dat.GUI();
    gui.add(config, 'current').min(0.01).max(10).step(0.1);
    gui.add(config, 'mu').min(1).max(10).step(1);




    const circuit = new Circuit(scene, config['circuit_name']);
    // console.log(circuit);
    let particles = generateParticles(config['number_of_particles'], scene);
    // console.log(particles);

    function update() {
        moveParticles(circuit, particles, config['step_time'], scene);
        // console.log(particles[0].mesh.position.x);
    }



    function loop() {
        update();
        // console.log(particles[0].mesh.position.x);

        renderer.render(scene, camera);
        requestAnimationFrame(function () { loop(); });
    }
    loop();
};
