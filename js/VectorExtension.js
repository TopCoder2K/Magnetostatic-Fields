// As library functions are bad, rewrite them.
// -u
function negate(u) {
    let copied_u = new THREE.Vector3(0, 0, 0);
    copied_u.copy(u);
    return copied_u.negate();
}
// v + u
function add(v, u) {
    let result = new THREE.Vector3(0, 0, 0);
    result.add(v);
    result.add(u);

    return result;
}
// v - u
function subtract(v, u) {
    let copied_u = new THREE.Vector3(0, 0, 0);
    copied_u.copy(u);
    const negated_u = copied_u.negate();

    return add(v, negated_u);
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

    return add(v, scaled_u);
}
// v - u * k
function subtractScaledVector(v, u, k) {
    let scaled_u = new THREE.Vector3(0, 0, 0);
    scaled_u.copy(u);
    scaled_u.multiplyScalar(k);

    return subtract(v, scaled_u);
}
// v * u
function dotProduct(v, u) {
    let copied_v = new THREE.Vector3(0, 0, 0);
    copied_v.copy(v);
    return copied_v.dot(u);
}
