// A primitive wire.
function CurrentLine(scene, height) {
    const geometry = new THREE.CylinderGeometry(3, 3, height);
    const material = new THREE.MeshBasicMaterial({color: 0xffff00});

    this.mesh = new THREE.Mesh(geometry, material);
    scene.add(this.mesh);

    this.direction = new THREE.Vector3(0, 1, 0);
    this.length = height;
}




// Sets up a wire position.
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

function CurrentSquareCircuit(wires, scene, length, half_flag, x, y, z) {
    if (half_flag) {
        wires.push(
            Object.freeze(CurrentLineCircuit(new CurrentLine(scene, length)))
        );
        wires.push(
            Object.freeze(CurrentLineCircuit(new CurrentLine(scene, length), -length / 2, length / 2, 0, 0, 0, 90 / 180 * Math.PI))
        );
    } else {
        wires.push(
            Object.freeze(CurrentLineCircuit(new CurrentLine(scene, length), length / 2 + x, y, z))
        );
        wires.push(
            Object.freeze(CurrentLineCircuit(new CurrentLine(scene, length), x, length / 2 + y, z, 0, 0, 90 / 180 * Math.PI))
        );
        wires.push(
            Object.freeze(CurrentLineCircuit(new CurrentLine(scene, length), -length / 2 + x, y, z, 0, 0, 180 / 180 * Math.PI))
        );
        wires.push(
            Object.freeze(CurrentLineCircuit(new CurrentLine(scene, length), x, -length / 2 + y, z, 0, 0, 270 / 180 * Math.PI))
        );
    }
}

// Makes a ring from cylinders.
// Angle in degrees!
function CurrentRingCircuit(wires, scene, radius, step_angle, z) {
    z = Object.is(undefined, z) ? 0 : z;
    const angle = step_angle / 180 * Math.PI;
    const len = 2 * radius * Math.sin(angle / 2);
    for (let i = 0; i < 360 / step_angle; ++i) {
        const x = radius * Math.cos(i * angle);
        const y = radius * Math.sin(i * angle);
        wires.push(
            Object.freeze(CurrentLineCircuit(new CurrentLine(scene, len), x, y, z, 0, 0, i * angle))
        );
    }
}



// Creates circuit according to the passed name.
function Circuit(scene, circuit_name) {
    // Contains wires that compose the circuit.
    this.wires = [];

    switch(circuit_name) {
        case 'line':
            this.wires.push(
                    Object.freeze(CurrentLineCircuit(new CurrentLine(scene, 400)))
            );
            break;

        case 'angle':
            CurrentSquareCircuit(this.wires, scene, 200, true);
            break;

        case 'square':
            CurrentSquareCircuit(this.wires, scene, 200, false, 0, 0, 0);
            break;

        case 'cube':
            CurrentSquareCircuit(this.wires, scene, 200, false, 0, 0, -100);
            CurrentSquareCircuit(this.wires, scene, 200, false, 0, 0, 100);
            this.wires.push(
                Object.freeze(CurrentLineCircuit(new CurrentLine(scene, 200), 100, 100, 0, 90 / 180 * Math.PI, 0, 0))
            );
            this.wires.push(
                Object.freeze(CurrentLineCircuit(new CurrentLine(scene, 200), 100, -100, 0, 90 / 180 * Math.PI, 0, 0))
            );
            this.wires.push(
                Object.freeze(CurrentLineCircuit(new CurrentLine(scene, 200), -100, 100, 0, 90 / 180 * Math.PI, 0, 0))
            );
            this.wires.push(
                Object.freeze(CurrentLineCircuit(new CurrentLine(scene, 200), -100, -100, 0, 90 / 180 * Math.PI, 0, 0))
            );
            break;

        case 'ring':
            // We will approximate ring by 72 vertex polygon.
            CurrentRingCircuit(this.wires, scene, 100, 5);
            break;

        case 'inductor':
            for (let i = 0; i < 8; ++i) {
                CurrentRingCircuit(this.wires, scene, 100, 20,i * 20);
            }
            break;

        case 'four_inductors':
            for (let i = 0; i < 8; ++i) {
                CurrentSquareCircuit(this.wires, scene, 100, false, 100, 0, (i - 4) * 20);
            }
            for (let i = 0; i < 8; ++i) {
                CurrentSquareCircuit(this.wires, scene, 100, false, -100, 0, (i - 4) * 20);
            }
            for (let i = 0; i < 6; ++i) {
                this.wires.push(
                    Object.freeze(CurrentLineCircuit(new CurrentLine(scene, 100), (i - 3) * 20, 50, -150, 90 / 180 * Math.PI, 0, 0))
                );
                this.wires.push(
                    Object.freeze(CurrentLineCircuit(new CurrentLine(scene, 100), (i - 3) * 20, -50, -150, 90 / 180 * Math.PI, 0, 0))
                );
                this.wires.push(
                    Object.freeze(CurrentLineCircuit(new CurrentLine(scene, 100), (i - 3) * 20, 0, -200, 0, 0, 0))
                );
                this.wires.push(
                    Object.freeze(CurrentLineCircuit(new CurrentLine(scene, 100), (i - 3) * 20, 0, -100, 0, 0, 0))
                );
            }
            for (let i = 0; i < 6; ++i) {
                this.wires.push(
                    Object.freeze(CurrentLineCircuit(new CurrentLine(scene, 100), (i - 3) * 20, 50, 150, 90 / 180 * Math.PI, 0, 0))
                );
                this.wires.push(
                    Object.freeze(CurrentLineCircuit(new CurrentLine(scene, 100), (i - 3) * 20, -50, 150, 90 / 180 * Math.PI, 0, 0))
                );
                this.wires.push(
                    Object.freeze(CurrentLineCircuit(new CurrentLine(scene, 100), (i - 3) * 20, 0, 100, 0, 0, 0))
                );
                this.wires.push(
                    Object.freeze(CurrentLineCircuit(new CurrentLine(scene, 100), (i - 3) * 20, 0, 200, 0, 0, 0))
                );
            }
            break;
        case 'double_inductor':
            for (let i = 0; i < 6; ++i) {
                CurrentRingCircuit(this.wires, scene, 100, 30,i * 20);
            }
            for (let i = 0; i < 6; ++i) {
                CurrentRingCircuit(this.wires, scene, 50, 30,i * 20);
            }
            this.wires.push(
                Object.freeze(CurrentLineCircuit(new CurrentLine(scene, 100), 0, 0, 50, 90 / 180 * Math.PI, 0, 0))
            );
            break;

        default:
            alert('Unknown type of circuit');
            throw new SyntaxError('Unknown type of circuit');
    }
}
