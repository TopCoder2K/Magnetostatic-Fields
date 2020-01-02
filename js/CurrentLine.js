// A primitive wire.
function CurrentLine(scene, length, current) {
    let geometry = new THREE.CylinderGeometry(3, 3, length);
    let material = new THREE.MeshBasicMaterial({color: 0xffff00});

    this.mesh = new THREE.Mesh(geometry, material);
    scene.add(this.mesh);

    this.current = current;
    this.direction = new THREE.Vector3(0, -1, 0);
    // Testing!
    console.log(this.mesh.height);
}

// Creates circuit according to the passed name.
function Circuit(scene, circuitName, current) {
    // Contains wires that compose the circuit.
    this.wires = [];

    if (Object.is(circuitName, 'Current_line')) {
        this.wires.push(
            CurrentLineCircuit(new CurrentLine(scene, 300, current))
        );
    } else {
        throw new SyntaxError('Unknown type of circuit');
    }
}

// Sets up a position.
function CurrentLineCircuit(cylinder_mesh, x, y, z, angle_x, angle_y, angle_z) {
    cylinder_mesh.rotation.x = Object.is(undefined, angle_x) ? 0 : angle_x;
    cylinder_mesh.rotation.y = Object.is(undefined, angle_y) ? 0 : angle_y;
    cylinder_mesh.rotation.z = Object.is(undefined, angle_z) ? 0 : angle_z;
    cylinder_mesh.direction.applyAxisAngle(new THREE.Vector3(1, 0, 0), angle_x);
    cylinder_mesh.direction.applyAxisAngle(new THREE.Vector3(0, 1, 0), angle_y);
    cylinder_mesh.direction.applyAxisAngle(new THREE.Vector3(0, 0, 1), angle_z);

    cylinder_mesh.position.x = Object.is(undefined, x) ? 0 : x;
    cylinder_mesh.position.y = Object.is(undefined, y) ? 0 : y;
    cylinder_mesh.position.z = Object.is(undefined, z) ? 0 : z;
}
