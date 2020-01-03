const config = Object.freeze({
    current: 1,
    mu: 1,
    step_time: 0.001,
    number_of_particles: 300,
    birth_border: 200,
    living_time: 0,
    // Possible values: line (balanced values: 300, 200, 0.5),
    // angle (balanced values: 300, 200, 0.5), square (balanced values: 300, 200, 0.5),
    // cube (balanced values: 300, 200, 0),
    // ring (balanced values: 300, 100, 0.25), inductor (balanced values: 300, 200, 0),
    // four_inductors (),
    // MIPT ().
    circuit_name: 'four_inductors'
});