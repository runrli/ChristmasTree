
import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { ORNAMENT_COUNT, COLORS } from '../constants';
import { TreeMorphState } from '../types';
import { getTreePosition, getScatterPosition, getLovePosition } from '../utils/math';

const Ornaments: React.FC<{ state: TreeMorphState }> = ({ state }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  // Weights for movement
  const data = useMemo(() => {
    return Array.from({ length: ORNAMENT_COUNT }, (_, i) => ({
      weight: 0.5 + Math.random(),
      phase: Math.random() * Math.PI * 2,
      scale: 0.1 + Math.random() * 0.2,
      color: Math.random() > 0.5 ? COLORS.roseGold : COLORS.gold
    }));
  }, []);

  const currentPositions = useMemo(() => 
    Array.from({ length: ORNAMENT_COUNT }, () => new THREE.Vector3()), 
  []);

  useFrame((stateObj, delta) => {
    if (!meshRef.current) return;

    for (let i = 0; i < ORNAMENT_COUNT; i++) {
      const item = data[i];
      let target: THREE.Vector3;
      
      const step = Math.floor((i / ORNAMENT_COUNT) * 15000); // Sample from particle logic

      switch(state) {
        case TreeMorphState.SCATTER: target = getScatterPosition(step); break;
        case TreeMorphState.LOVE: target = getLovePosition(step, 15000); break;
        default: target = getTreePosition(step, 15000);
      }

      // Smoothly lerp towards target with different weights
      currentPositions[i].lerp(target, delta * 2 * item.weight);

      dummy.position.copy(currentPositions[i]);
      
      // Floating animation
      dummy.position.y += Math.sin(stateObj.clock.elapsedTime + item.phase) * 0.1;
      
      dummy.scale.setScalar(item.scale);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
      meshRef.current.setColorAt(i, new THREE.Color(item.color));
    }
    
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, ORNAMENT_COUNT]}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial metalness={1} roughness={0.1} />
    </instancedMesh>
  );
};

export default Ornaments;
