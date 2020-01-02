function ParticleMesh(x, y, z, scene) {
    let particle = new THREE.SphereGeometry(1);
    let material = new THREE.MeshBasicMaterial({color: 0xffffff});
    this.mesh = new THREE.Mesh(particle, material);
    this.velocity = new THREE.Vector3(0, 0, 0);


    this.mesh.position.x = x;
    this.mesh.position.y = y;
    this.mesh.position.z = z;
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

// Calculates vector B at a point in space and acceleration, acting on the particle at that point.
// After that changes the particle velocity.
function applyMagneticField(circuit, particles) {
    let size = particles.length;
    for (let i = 0; i < size; ++i) {
        let change_vel = new THREE.Vector3(1, 1, 1);
        particles[i].velocity.x += change_vel.x;
        particles[i].velocity.y += change_vel.y;
        particles[i].velocity.y += change_vel.z;
    }
}

function moveParticles(circuit, time, particles) {
    applyMagneticField(circuit, particles);

    let size = particles.length;
    for (let i = 0; i < size; ++i) {
        particles[i].mesh.position.x += particles[i].velocity.x * time;
        particles[i].mesh.position.y += particles[i].velocity.y * time;
        particles[i].mesh.position.z += particles[i].velocity.z * time;
    }

    return particles;
}
