function ParticleMesh(x, y, z, scene) {
    let particle = new THREE.SphereGeometry(10, 12, 12);
    let material = new THREE.MeshBasicMaterial({color: 0xffffff});
    this.mesh = new THREE.Mesh(particle, material);
    this.velocity = new THREE.Vector3(0, 0, 0);


    this.mesh.x = x;
    this.mesh.y = y;
    this.mesh.z = z;
    scene.add(this.mesh);
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

// Generate random positions for electrons.
function generateParticles(num, border, scene) {
    let particles = [];
    for (let i = 0; i < num; ++i) {
        particles.push(
            new ParticleMesh(getRandomArbitrary(-border, border),
                getRandomArbitrary(-border, border),
                getRandomArbitrary(-border, border),
                scene
            )
        );
    }
    return particles;
}

// Gets vector B, updates acceleration, change velocity.
function applyMagneticField(circuit, particles) {
    let size = particles.length;
    for (let i = 0; i < size; ++i) {
        change_vel = new THREE.Vector3(1, 1, 1);
        particles[i].velocity.x += change_vel.x;
        particles[i].velocity.y += change_vel.y;
        particles[i].velocity.y += change_vel.z;
    }
}

function moveParticles(circuit, time, particles) {
    applyMagneticField(circuit, particles);

    let size = particles.length;
    for (let i = 0; i < size; ++i) {
        particles[i].mesh.x += particles[i].velocity.x * time;
        particles[i].mesh.y += particles[i].velocity.y * time;
        particles[i].mesh.z += particles[i].velocity.z * time;
    }
    console.log(particles[0].mesh.x)
}
