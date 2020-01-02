// A primitive wire.
function CurrentLine(scene, length, current) {
    let geometry = new THREE.CylinderGeometry(3, 3, length);
    let material = new THREE.MeshBasicMaterial({color: 0xffff00});

    this.mesh = new THREE.Mesh(geometry, material);
    scene.add(this.mesh);

    this.current = current;
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
function CurrentLineCircuit(cylinderMesh, x, y, z, angleX, angleY, angleZ) {
    cylinderMesh.rotation.x = Object.is(undefined, angleX) ? 0 : angleX;
    cylinderMesh.rotation.y = Object.is(undefined, angleY) ? 0 : angleY;
    cylinderMesh.rotation.z = Object.is(undefined, angleZ) ? 0 : angleZ;

    cylinderMesh.position.x = Object.is(undefined, x) ? 0 : x;
    cylinderMesh.position.y = Object.is(undefined, y) ? 0 : y;
    cylinderMesh.position.z = Object.is(undefined, z) ? 0 : z;
}
