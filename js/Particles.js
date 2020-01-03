function ParticleMesh(x, y, z, scene) {
    const particle = new THREE.SphereGeometry(1);
    const material = new THREE.MeshBasicMaterial({color: 0xffffff});
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

// Generate random positions for particles.
function generateParticles(num, border, scene) {
    let particles = [];
    for (let i = 0; i < num; ++i) {
        /*particles.push(
            new ParticleMesh(getRandomArbitrary(-border, border),
                getRandomArbitrary(-border, border),
                getRandomArbitrary(-border, border),
                scene
            )
        );*/
        particles.push(new ParticleMesh(100, 100, 100, scene));
    }
    return particles;
}



// As library functions are bad, rewrite them.
// -u
function Negate(u) {
    let copied_u = new THREE.Vector3(0, 0, 0);
    copied_u.copy(u);
    return copied_u.negate();
}
// v + u
function Add(v, u) {
    let result = new THREE.Vector3(0, 0, 0);
    result.add(v);
    result.add(u);

    return result;
}
// v - u
function Subtract(v, u) {
    let copied_u = new THREE.Vector3(0, 0, 0);
    copied_u.copy(u);
    const negated_u = copied_u.negate();

    return Add(v, negated_u);
}
// v x u
function crossProduct(v, u) {
    let copied_v = new THREE.Vector3(0, 0, 0);
    copied_v.copy(v);
    return copied_v.cross(u);
}
// v + u * k
function addScaledVector(v, u, k) {
    let scaled_u = new THREE.Vector3(0, 0, 0);
    scaled_u.copy(u);
    scaled_u.multiplyScalar(k);

    return Add(v, scaled_u);
}
// v - u * k
function subtractScaledVector(v, u, k) {
    let scaled_u = new THREE.Vector3(0, 0, 0);
    scaled_u.copy(u);
    scaled_u.multiplyScalar(k);

    return Subtract(v, scaled_u);
}
// v * u
function dotProduct(v, u) {
    let copied_v = new THREE.Vector3(0, 0, 0);
    copied_v.copy(v);
    return copied_v.dot(u);
}




function calcMagneticField(x, y, z, circuit) {
    const k = Math.pow(10, -7);         // Coefficient = mu_0 / (4 * pi)
    /*const xx = new THREE.Vector3(1, 0, 0);
    const yy = new THREE.Vector3(1, 1, 1);
    console.log(Add(xx, yy));
    console.log(Subtract(xx, yy));
    console.log(xx, yy);*/


    let B = new THREE.Vector3(0, 0, 0);
    const size = circuit.wires.length;
    for (let i = 0; i < size; ++i) {
        // Get the direction of B.
        const wire_x = circuit.wires[i].mesh.position.x;
        const wire_y = circuit.wires[i].mesh.position.y;
        const wire_z = circuit.wires[i].mesh.position.z;
        const half_wire_len = circuit.wires[i].length / 2;
        const to_wire_center = Object.freeze(new THREE.Vector3(wire_x, wire_y, wire_z));
        const to_point = Object.freeze(new THREE.Vector3(x, y, z));

        const from_center_to_point = Object.freeze(Subtract(to_point, to_wire_center));
        const cur_B_dir = Object.freeze(crossProduct(circuit.wires[i].direction, from_center_to_point).normalize());

        // Get the value of B.
        const to_wire_end1 = Object.freeze(addScaledVector(to_wire_center, circuit.wires[i].direction, half_wire_len));
        const to_wire_end2 = Object.freeze(subtractScaledVector(to_wire_center, circuit.wires[i].direction, half_wire_len));
        const from_end1_to_point = Object.freeze(Subtract(to_point, to_wire_end1));
        const from_end2_to_point = Object.freeze(Subtract(to_point, to_wire_end2));
        const cos1 = dotProduct(from_end1_to_point, Negate(circuit.wires[i].direction)) / from_end1_to_point.length();
        const cos2 = dotProduct(from_end2_to_point, Negate(circuit.wires[i].direction)) / from_end2_to_point.length();
        // The distance from the point to the line containing the wire.
        const distance = crossProduct(circuit.wires[i].direction, from_center_to_point).length();

        const cur_B_val = k * config['mu'] * config['current'] / distance * (cos1 - cos2);

        // Use superposition principle.
        B.addScaledVector(cur_B_dir, cur_B_val);
        // Testing
        /*console.log(to_wire_center);
        console.log(to_point);
        console.log(from_center_to_point);
        console.log(cur_B_dir);
        console.log(from_end1_to_point);
        console.log(from_end2_to_point);
        console.log(cos1);
        console.log(cos2);
        console.log(distance);
        console.log(cur_B_val);
        console.log(B);*/
    }

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
function moveParticles(circuit, particles, step_time) {
    const size = particles.length;
    for (let i = 0; i < size; ++i) {
        const B = calcMagneticField(
            particles[i].mesh.position.x,
            particles[i].mesh.position.y,
            particles[i].mesh.position.z, circuit
        );

        const instant_velocity = calcVelocity(B);
        particles[i].mesh.position.x += instant_velocity.x * step_time;
        particles[i].mesh.position.y += instant_velocity.y * step_time;
        particles[i].mesh.position.z += instant_velocity.z * step_time;

        // Testing
        console.log(instant_velocity);
        console.log(particles[i].mesh.position.x, particles[i].mesh.position.y, particles[i].mesh.position.z);

    }
}
