import * as THREE from 'three';

/**
 * A primitive wire.
 * @param {Scene} scene
 * @param {Number} height
 * @constructor
 */
function CurrentLine(scene, height) {
    const geometry = new THREE.CylinderGeometry(3, 3, height);
    const material = new THREE.MeshBasicMaterial({color: config['wire_color']});

    this.mesh = new THREE.Mesh(geometry, material);
    this.direction = new THREE.Vector3(0, 1, 0);
    this.length = height;

    scene.add(this.mesh);
}

/**
 * Sets up a wire position.
 * @param {CurrentLine} current_line
 * @param {Number} x
 * @param {Number} y
 * @param {Number} z
 * @param {Number} angle_x
 * @param {Number} angle_y
 * @param {Number} angle_z
 * @returns {CurrentLine}
 */
function lineCircuit(current_line, x, y, z, angle_x, angle_y, angle_z) {
    console.log(angle_x, angle_y, angle_z);
    angle_x = Object.is(undefined, angle_x) ? 0 : angle_x;
    angle_y = Object.is(undefined, angle_y) ? 0 : angle_y;
    angle_z = Object.is(undefined, angle_z) ? 0 : angle_z;

    current_line.mesh.rotation.x = angle_x;
    current_line.mesh.rotation.y = angle_y;
    current_line.mesh.rotation.z = angle_z;
    current_line.direction.applyAxisAngle(new THREE.Vector3(1, 0, 0), angle_x);
    current_line.direction.applyAxisAngle(new THREE.Vector3(0, 0, 1), angle_z);
    current_line.direction.applyAxisAngle(new THREE.Vector3(0, 1, 0), angle_y);

    current_line.mesh.position.x = Object.is(undefined, x) ? 0 : x;
    current_line.mesh.position.y = Object.is(undefined, y) ? 0 : y;
    current_line.mesh.position.z = Object.is(undefined, z) ? 0 : z;

    return current_line;
}

/**
 *
 * @param {[CurrentLine]} wires
 * @param {Scene} scene
 * @param {Number} length
 * @param {Number} x
 * @param {Number} y
 * @param {Number} z
 * @param {Boolean} half_around_z_flag
 * @param {Boolean} quarter_around_y_flag
 * @param {Boolean} reversed_current_flag
 */
function angleCircuit(wires, scene, length, x, y, z, half_around_z_flag, quarter_around_y_flag, reversed_current_flag) {
    const radius = Math.sqrt(x * x + y * y);
    wires.push(lineCircuit(
        new CurrentLine(scene, length),
        x - length * half_around_z_flag + length * half_around_z_flag * quarter_around_y_flag,
        y,
        z - length / 2 * quarter_around_y_flag + length * quarter_around_y_flag * half_around_z_flag,
        0,
        0,
        Math.PI * half_around_z_flag + Math.PI * reversed_current_flag
    ));
    wires.push(lineCircuit(
        new CurrentLine(scene, length),
        x - length / 2 + length / 2 * quarter_around_y_flag,
        y + length / 2 - length * half_around_z_flag,
        z,
        0,
        90 / 180 * Math.PI * quarter_around_y_flag + Math.PI * reversed_current_flag,
        90 / 180 * Math.PI + Math.PI * half_around_z_flag
    ));
}

/**
 *
 * @param {[CurrentLine]} wires
 * @param {Scene} scene
 * @param {Number} length
 * @param {Number} x
 * @param {Number} y
 * @param {Number} z
 * @param {Boolean} quarter_around_y_flag
 * @param {Boolean} reversed_current_flag
 */
function squareCircuit(wires, scene, length, x, y, z, quarter_around_y_flag, reversed_current_flag) {
    angleCircuit(wires, scene, length, x, y, z, false, quarter_around_y_flag, reversed_current_flag);
    angleCircuit(wires, scene, length, x, y, z, true, quarter_around_y_flag, reversed_current_flag);
}

/**
 * Makes a ring from cylinders.
 * Angle is in degrees!
 * @param wires
 * @param scene
 * @param radius
 * @param step_angle
 * @param z
 */
function ringCircuit(wires, scene, radius, step_angle, z) {
    z = Object.is(undefined, z) ? 0 : z;
    const angle = step_angle / 180 * Math.PI;
    const len = 2 * radius * Math.sin(angle / 2);

    for (let i = 0; i < 360 / step_angle; ++i) {
        const x = radius * Math.cos(i * angle);
        const y = radius * Math.sin(i * angle);
        wires.push(
            lineCircuit(new CurrentLine(scene, len), x, y, z, 0, 0, i * angle)
        );
    }
}

/**
 * Creates circuit according to the passed name.
 */
export default class Circuit {
    constructor(scene, circuit_name) {
        // Contains wires that compose the circuit.
        this.wires = [];

        switch(circuit_name) {
            case 'line':
                this.wires.push(
                        lineCircuit(new CurrentLine(scene, 400))
                );
                break;

            case 'angle':
                angleCircuit(this.wires, scene, 200, 0, 0, 0, false, false, false);
                console.log(this.wires[1]);
                break;

            case 'square':
                squareCircuit(this.wires, scene, 200, 100, 0, 100, false, false);
                break;

            case 'cube':
                squareCircuit(this.wires, scene, 200, 100, 0, 0, false, false);
                squareCircuit(this.wires, scene, 200, 100, 0, 200, false, false);
                this.wires.push(
                    lineCircuit(new CurrentLine(scene, 200), 100, 100, 100, 90 / 180 * Math.PI, 0, 0)
                );
                this.wires.push(
                    lineCircuit(new CurrentLine(scene, 200), 100, -100, 100, 90 / 180 * Math.PI, 0, 0)
                );
                this.wires.push(
                    lineCircuit(new CurrentLine(scene, 200), -100, 100, 100, 90 / 180 * Math.PI, 0, 0)
                );
                this.wires.push(
                    lineCircuit(new CurrentLine(scene, 200), -100, -100, 100, 90 / 180 * Math.PI, 0, 0)
                );
                break;

            case 'ring':
                // We will approximate ring by 72 vertex polygon.
                ringCircuit(this.wires, scene, 100, 5, 50);
                break;

            case 'inductor':
                for (let i = 0; i < 8; ++i) {
                    ringCircuit(this.wires, scene, 100, 20,i * 20);
                }
                break;

            case 'four_inductors':
                for (let i = 0; i < 8; ++i) {
                    squareCircuit(this.wires, scene, 100, 200, 0, (i - 4) * 20, false, false);
                }
                for (let i = 0; i < 6; ++i) {
                    squareCircuit(this.wires, scene, 100, (i - 3) * 20, 0, -150, true, false);
                }
                for (let i = 0; i < 6; ++i) {
                    squareCircuit(this.wires, scene, 100, (i - 3) * 20, 0, 150, true, true);
                }
                for (let i = 0; i < 8; ++i) {
                    squareCircuit(this.wires, scene, 100, -100, 0, (i - 4) * 20, false, true);
                }

                break;
            case 'double_inductor':
                for (let i = 0; i < 6; ++i) {
                    ringCircuit(this.wires, scene, 100, 30,i * 20);
                }
                for (let i = 0; i < 6; ++i) {
                    ringCircuit(this.wires, scene, 50, 30,i * 20);
                }
                this.wires.push(
                    lineCircuit(new CurrentLine(scene, 100), 0, 0, 50, 90 / 180 * Math.PI, 0, 0)
                );
                break;

            default:
                alert('Unknown type of circuit');
                throw new SyntaxError('Unknown type of circuit');
        }
    }
}
