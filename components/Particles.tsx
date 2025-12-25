
import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { PARTICLE_COUNT, COLORS } from '../constants';
import { TreeMorphState } from '../types';
import { getTreePosition, getScatterPosition, getLovePosition } from '../utils/math';

const vertexShader = `
  uniform float uTime;
  uniform float uMorphProgress;
  uniform float uSize;
  
  attribute vec3 aTargetPosition;
  attribute vec3 aColor;
  
  varying vec3 vColor;
  varying float vHighlight;

  void main() {
    vColor = aColor;
    
    // Smooth transition between position and target
    vec3 mixedPosition = mix(position, aTargetPosition, uMorphProgress);
    
    // Add some organic breathing motion
    mixedPosition.x += sin(uTime * 0.5 + position.y) * 0.1;
    mixedPosition.z += cos(uTime * 0.5 + position.x) * 0.1;
    
    vec4 mvPosition = modelViewMatrix * vec4(mixedPosition, 1.0);
    gl_PointSize = uSize * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
    
    // Highlight based on height and time
    vHighlight = sin(uTime * 2.0 + mixedPosition.y * 0.5) * 0.5 + 0.5;
  }
`;

const fragmentShader = `
  varying vec3 vColor;
  varying float vHighlight;

  void main() {
    float dist = distance(gl_PointCoord, vec2(0.5));
    if (dist > 0.5) discard;
    
    // Circular glow
    float strength = 1.0 - (dist * 2.0);
    strength = pow(strength, 2.0);
    
    // Mix particle color with a gold glow highlight
    vec3 gold = vec3(1.0, 0.84, 0.0);
    vec3 finalColor = mix(vColor, gold, vHighlight * 0.3);
    
    gl_FragColor = vec4(finalColor, strength);
  }
`;

interface ParticlesProps {
  state: TreeMorphState;
}

const Particles: React.FC<ParticlesProps> = ({ state }) => {
  const meshRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  // Track current state and progress
  const progressRef = useRef(0);
  const prevStateRef = useRef<TreeMorphState>(state);
  
  const { positions, targets, colors } = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const target = new Float32Array(PARTICLE_COUNT * 3);
    const cols = new Float32Array(PARTICLE_COUNT * 3);
    
    const colorDeepGreen = new THREE.Color(COLORS.deepGreen);
    const colorRoseGold = new THREE.Color(COLORS.roseGold);
    const colorSkyBlue = new THREE.Color(COLORS.skyBlue);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const treePos = getTreePosition(i, PARTICLE_COUNT);
      pos[i * 3] = treePos.x;
      pos[i * 3 + 1] = treePos.y;
      pos[i * 3 + 2] = treePos.z;
      
      const col = Math.random() > 0.8 ? colorRoseGold : colorDeepGreen;
      if (Math.random() > 0.95) col.lerp(colorSkyBlue, 0.5);
      
      cols[i * 3] = col.r;
      cols[i * 3 + 1] = col.g;
      cols[i * 3 + 2] = col.b;
    }
    
    return { positions: pos, targets: target, colors: cols };
  }, []);

  useFrame((stateObj, delta) => {
    if (!materialRef.current || !meshRef.current) return;
    
    materialRef.current.uniforms.uTime.value = stateObj.clock.elapsedTime;

    // Handle state transitions
    if (prevStateRef.current !== state) {
      // Refresh targets when state changes
      const targetAttr = meshRef.current.geometry.attributes.aTargetPosition;
      const currentPosAttr = meshRef.current.geometry.attributes.position;
      
      // Update starting position to where we currently are
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const currentX = THREE.MathUtils.lerp(
          currentPosAttr.getX(i), 
          targetAttr.getX(i), 
          progressRef.current
        );
        const currentY = THREE.MathUtils.lerp(
          currentPosAttr.getY(i), 
          targetAttr.getY(i), 
          progressRef.current
        );
        const currentZ = THREE.MathUtils.lerp(
          currentPosAttr.getZ(i), 
          targetAttr.getZ(i), 
          progressRef.current
        );
        
        currentPosAttr.setXYZ(i, currentX, currentY, currentZ);
        
        let nextPos: THREE.Vector3;
        switch(state) {
          case TreeMorphState.SCATTER: nextPos = getScatterPosition(i); break;
          case TreeMorphState.LOVE: nextPos = getLovePosition(i, PARTICLE_COUNT); break;
          default: nextPos = getTreePosition(i, PARTICLE_COUNT);
        }
        targetAttr.setXYZ(i, nextPos.x, nextPos.y, nextPos.z);
      }
      
      currentPosAttr.needsUpdate = true;
      targetAttr.needsUpdate = true;
      
      progressRef.current = 0;
      prevStateRef.current = state;
    }

    // Move progress towards 1.0
    if (progressRef.current < 1.0) {
      progressRef.current = Math.min(1.0, progressRef.current + delta * 0.8);
      materialRef.current.uniforms.uMorphProgress.value = progressRef.current;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={PARTICLE_COUNT}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aTargetPosition"
          count={PARTICLE_COUNT}
          array={targets}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aColor"
          count={PARTICLE_COUNT}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTime: { value: 0 },
          uMorphProgress: { value: 0 },
          uSize: { value: 0.12 }
        }}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export default Particles;
