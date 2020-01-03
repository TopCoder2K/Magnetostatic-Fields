// A primitive wire.
function CurrentLine(scene, height) {
    const geometry = new THREE.CylinderGeometry(3, 3, height);
    const material = new THREE.MeshBasicMaterial({color: 0xffff00});

    this.mesh = new THREE.Mesh(geometry, material);
    scene.add(this.mesh);

    this.direction = new THREE.Vector3(0, 1, 0);
    this.length = height;
}

// Creates circuit according to the passed name.
function Circuit(scene, circuit_name) {
    // Contains wires that compose the circuit.
    this.wires = [];

    if (Object.is(circuit_name, 'Current_line')) {
        this.wires.push(
                Object.freeze(CurrentLineCircuit(new CurrentLine(scene, 400)))
        );
    } else {
        throw new SyntaxError('Unknown type of circuit');
    }
}

// Sets up a position.
function CurrentLineCircuit(current_line, x, y, z, angle_x, angle_y, angle_z) {
    angle_x = Object.is(undefined, angle_x) ? 0 : angle_x;
    angle_y = Object.is(undefined, angle_y) ? 0 : angle_y;
    angle_z = Object.is(undefined, angle_z) ? 0 : angle_z;
    current_line.mesh.rotation.x = angle_x;
    current_line.mesh.rotation.y = angle_y;
    current_line.mesh.rotation.z = angle_z;
    current_line.direction.applyAxisAngle(new THREE.Vector3(1, 0, 0), angle_x);
    current_line.direction.applyAxisAngle(new THREE.Vector3(0, 1, 0), angle_y);
    current_line.direction.applyAxisAngle(new THREE.Vector3(0, 0, 1), angle_z);


    current_line.mesh.position.x = Object.is(undefined, x) ? 0 : x;
    current_line.mesh.position.y = Object.is(undefined, y) ? 0 : y;
    current_line.mesh.position.z = Object.is(undefined, z) ? 0 : z;

    return current_line;
}
