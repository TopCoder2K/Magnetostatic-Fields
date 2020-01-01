function CurrentLine(scene) {
    let geometry = new THREE.CylinderGeometry(3, 3, 300);
    let material = new THREE.MeshBasicMaterial({color: 0xffff00});

    let mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
}
