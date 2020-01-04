function ParticleMesh(x, y, z, scene) {
    const particle = new THREE.SphereGeometry(1);
    const material = new THREE.MeshBasicMaterial({color: 0xffffff});
    this.mesh = new THREE.Mesh(particle, material);
    this.time_lived = 0;
    // Average distance is used to evaluate "good" living time.
    this.avg_distance = 0;


    this.mesh.position.x = x;
    this.mesh.position.y = y;
    this.mesh.position.z = z;
    scene.add(this.mesh);
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

// Generate random positions for particles.
function generateParticles(num, scene) {
    let particles = [];
    for (let i = 0; i < num; ++i) {
        particles.push(
            new ParticleMesh(getRandomArbitrary(-config['birth_border'], config['birth_border']),
                getRandomArbitrary(-config['birth_border'], config['birth_border']),
                getRandomArbitrary(-config['birth_border'], config['birth_border']),
                scene
            )
        );
    }
    return particles;
}




function calcMagneticFieldFromLine(particles, j, circuit) {
    const k = Math.pow(10, -7);         // Coefficient = mu_0 / (4 * pi)
    const avg_dist_flag = !particles[j].avg_distance;


    let B = new THREE.Vector3(0, 0, 0);
    const size = circuit.wires.length;
    for (let i = 0; i < size; ++i) {
        // Get the direction of B.
        const to_wire_center = Object.freeze(new THREE.Vector3(
            circuit.wires[i].mesh.position.x, circuit.wires[i].mesh.position.y, circuit.wires[i].mesh.position.z
        ));
        const to_point = Object.freeze(new THREE.Vector3(
            particles[j].mesh.position.x, particles[j].mesh.position.y, particles[j].mesh.position.z
        ));

        const from_center_to_point = Object.freeze(Subtract(to_point, to_wire_center));
        const cur_B_dir = Object.freeze(crossProduct(circuit.wires[i].direction, from_center_to_point).normalize());

        // Get the value of B.
        const to_wire_end1 = Object.freeze(addScaledVector(to_wire_center, circuit.wires[i].direction, circuit.wires[i].length / 2));
        const to_wire_end2 = Object.freeze(subtractScaledVector(to_wire_center, circuit.wires[i].direction, circuit.wires[i].length / 2));
        const from_end1_to_point = Object.freeze(Subtract(to_point, to_wire_end1));
        const from_end2_to_point = Object.freeze(Subtract(to_point, to_wire_end2));
        const cos1 = dotProduct(from_end1_to_point, Negate(circuit.wires[i].direction)) / from_end1_to_point.length();
        const cos2 = dotProduct(from_end2_to_point, Negate(circuit.wires[i].direction)) / from_end2_to_point.length();
        // The distance from the point to the line containing the wire.
        const distance = crossProduct(circuit.wires[i].direction, from_center_to_point).length();

        const cur_B_val = k * config['mu'] * config['current'] / distance * (cos1 - cos2);
        particles[j].avg_distance += avg_dist_flag ? distance : 0;

        // Use the superposition principle.
        B.addScaledVector(cur_B_dir, cur_B_val);
    }
    particles[j].avg_distance /= avg_dist_flag ? size : 1;

    return B;
}

// As our particles represent magnetic field, B serves as force acting on them.
// So, it's important to find "good mass" for the graphic representing.
function calcVelocity(B) {
    const quasi_mass = Math.pow(10, -12);
    let copied_B = new THREE.Vector3(0, 0, 0);
    copied_B.copy(B);

    return copied_B.divideScalar(quasi_mass);
}

// Calculates vector B at a point in space and acceleration, acting on the particle at that point.
// After that changes the particle velocity.
function moveParticles(circuit, particles, step_time, scene) {
    const size = particles.length;
    for (let i = 0; i < size; ++i) {
        const B = calcMagneticFieldFromLine(particles, i, circuit);

        // Particles increase the radius of their orbit because of discretization of the movement.
        // So, after a certain time they must die.
        if (particles[i].time_lived > config['living_time'] + particles[i].avg_distance / 400) {
            scene.remove(particles[i].mesh);
            particles.splice(i, 1);
            particles.push(
                new ParticleMesh(
                    getRandomArbitrary(-config['birth_border'], config['birth_border']),
                    getRandomArbitrary(-config['birth_border'], config['birth_border']),
                    getRandomArbitrary(-config['birth_border'], config['birth_border']),
                    scene
                )
            );
        }

        const instant_velocity = calcVelocity(B);
        particles[i].mesh.position.x += instant_velocity.x * step_time;
        particles[i].mesh.position.y += instant_velocity.y * step_time;
        particles[i].mesh.position.z += instant_velocity.z * step_time;
        particles[i].time_lived += step_time;

        // Testing
        // console.log(B.length());
        // console.log(instant_velocity);
        // console.log(particles[i].mesh.position.x, particles[i].mesh.position.y, particles[i].mesh.position.z);
    }
    // console.log(particles[0].time_lived);
    // console.log(particles[0].avg_distance);
}
