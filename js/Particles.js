function ParticleMesh(x, y, z, scene) {
    let particle = new THREE.SphereGeometry(3, 12, 12);
    let material = new THREE.MeshBasicMaterial({color: 0x000000});
    this.mesh = new TREE.Mesh(particle, material);
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
        particles[i].velocity += new TREE.Vector3(0.1, 0.1, 0.1);
    }
}

function moveParticles(circuit, time, particles) {
    applyMagneticField(circuit, particles);

    let size = particles.length;
    for (let i = 0; i < size; ++i) {
        particles[i].x += particles[i].velocity.x * time;
        particles[i].y += particles[i].velocity.y * time;
        particles[i].z += particles[i].velocity.z * time;
    }
}
