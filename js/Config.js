const config = {
    current: 1,
    mu: 1,
    step_time: 0.001,
    number_of_particles: 500,
    birth_border: 200,
    living_time: 0,
    // Supported circuits: line (balanced values: (number_of_particles) 300, (birth border) 200, (living time) 0.5),
    // angle (300, 200, 0.5), square (300, 200, 0.5), cube (300, 200, 0),
    // ring (300, 100, 0.25), inductor (300, 200, 0),
    // four_inductors (300, 200, 0, but the construction is bad),
    // double_inductor (300, 200, 0).
    circuit_name: 'line'
};
