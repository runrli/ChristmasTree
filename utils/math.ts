
import * as THREE from 'three';

export function getTreePosition(index: number, count: number): THREE.Vector3 {
  const height = 12;
  const radius = 5;
  const spiral = 15;
  
  const ratio = index / count;
  const h = ratio * height;
  const r = (1 - ratio) * radius;
  const angle = ratio * Math.PI * 2 * spiral;
  
  return new THREE.Vector3(
    Math.cos(angle) * r,
    h - height / 2,
    Math.sin(angle) * r
  );
}

export function getScatterPosition(index: number): THREE.Vector3 {
  const radius = 15;
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  const r = radius * Math.pow(Math.random(), 1/3);
  
  return new THREE.Vector3(
    r * Math.sin(phi) * Math.cos(theta),
    r * Math.sin(phi) * Math.sin(theta),
    r * Math.cos(phi)
  );
}

export function getLovePosition(index: number, count: number): THREE.Vector3 {
  const scale = 0.4;
  const t = (index / count) * Math.PI * 2;
  
  // Heart parametric formula
  const x = 16 * Math.pow(Math.sin(t), 3);
  const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
  
  // Distribute along z a bit for volume
  const z = (Math.random() - 0.5) * 5;
  
  return new THREE.Vector3(x * scale, y * scale, z * scale);
}
