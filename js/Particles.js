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



function calcMagneticField(x, y, z, circuit) {
    const k = Math.pow(10, -7);         // Coefficient = mu_0 / (4 * pi)

    let B = new THREE.Vector3(0, 0, 0);
    let size = circuit.wires.length;
    for (let i = 0; i < size; ++i) {
        // Get the direction of B.
        const wire_x = circuit.wires[i].mesh.position.x;
        const wire_y = circuit.wires[i].mesh.position.y;
        const wire_z = circuit.wires[i].mesh.position.z;
        const wire_len = circuit.wires[i].mesh.height;
        const to_wire_center = new THREE.Vector3(wire_x, wire_y, wire_z);
        const to_point = new THREE.Vector3(x, y, z);

        let from_center_to_point = to_point.add(to_wire_center.negate());
        let cur_B_dir = (circuit.wires[i].direction.cross(from_center_to_point)).normalize();

        // Get the value of B.
        const to_wire_end1 = to_wire_center.addScaledVector(circuit.wires[i].direction, wire_len);
        const to_wire_end2 = to_wire_center.addScaledVector(circuit.wires[i].direction.negate(), wire_len);
        const from_end1_to_point = to_point.add(to_wire_end1.negate());
        const from_end2_to_point = to_point.add(to_wire_end2.negate());
        let cos1 = ;
        let alpha_2 = ;
        let distance = circuit.wires[i].direction.cross(from_center_to_point);        // The distance from the point to the line containing the wire.

        let cur_B_val = k * config['mu'] * circuit.wires[i].current / distance * (Math.cos(alpha_1) - Math.cos(alpha_2));
        // Use superposition principle.
        B.add(cur_B_dir);
    }

    return B;
}

function calcAcceleration(B) {

}

// Calculates vector B at a point in space and acceleration, acting on the particle at that point.
// After that changes the particle velocity.
function applyMagneticField(circuit, particles, step_time) {
    let size = particles.length;
    for (let i = 0; i < size; ++i) {
        let B = calcMagneticField(particles[i].position.x, particles[i].position.y, particles[i].position.z, circuit);
        let acceleration = calcAcceleration(B);
        particles[i].velocity.x += acceleration.x * step_time;
        particles[i].velocity.y += acceleration.y * step_time;
        particles[i].velocity.z += acceleration.z * step_time;
    }
}

function moveParticles(circuit, step_time, particles) {
    applyMagneticField(circuit, particles, step_time);

    let size = particles.length;
    for (let i = 0; i < size; ++i) {
        particles[i].mesh.position.x += particles[i].velocity.x * step_time;
        particles[i].mesh.position.y += particles[i].velocity.y * step_time;
        particles[i].mesh.position.z += particles[i].velocity.z * step_time;
    }
}
