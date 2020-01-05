export const config = {
    current: 1,
    mu: 1,
    step_time: 0.001,
    quasi_mass: Math.pow(10, -12),
    number_of_particles: 500,
    birth_border: 200,
    living_time: 0,
    living_delimeter: 400,
    // Supported circuits:
    // line (balanced values: (number_of_particles) 500, (birth border) 200, (living time) 0.5, (living_delimeter) 400),
    // angle (500, 200, 0.5, 400), square (500, 200, 0.5, 400), cube (500, 200, 0, 400),
    // ring (400, 100, 0, 400), inductor (300, 200, 0, 800),
    // four_inductors (500, 200, 0, 400), double_inductor (300, 100, 0, 800).
    circuit_name: 'four_inductors',
    wire_color: 0xffa500
};
