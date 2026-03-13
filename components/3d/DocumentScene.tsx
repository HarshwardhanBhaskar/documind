'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

function DocumentMesh({
    position,
    rotation,
    color,
    scale = 1,
}: {
    position: [number, number, number];
    rotation: [number, number, number];
    color: string;
    scale?: number;
}) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4 + rotation[1]) * 0.3;
            meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3 + rotation[0]) * 0.1;
        }
    });

    return (
        <Float speed={2} rotationIntensity={0.4} floatIntensity={0.8}>
            <mesh ref={meshRef} position={position} scale={scale}>
                <boxGeometry args={[1, 1.3, 0.06]} />
                <meshStandardMaterial
                    color={color}
                    roughness={0.1}
                    metalness={0.6}
                    transparent
                    opacity={0.85}
                    emissive={color}
                    emissiveIntensity={0.15}
                />
            </mesh>
            {/* Page lines */}
            <mesh position={[position[0], position[1] - 0.15, position[2] + 0.05]} scale={scale}>
                <boxGeometry args={[0.6, 0.04, 0.01]} />
                <meshStandardMaterial color="#ffffff" opacity={0.4} transparent />
            </mesh>
            <mesh position={[position[0], position[1] - 0.3, position[2] + 0.05]} scale={scale}>
                <boxGeometry args={[0.5, 0.04, 0.01]} />
                <meshStandardMaterial color="#ffffff" opacity={0.3} transparent />
            </mesh>
            <mesh position={[position[0], position[1] - 0.45, position[2] + 0.05]} scale={scale}>
                <boxGeometry args={[0.55, 0.04, 0.01]} />
                <meshStandardMaterial color="#ffffff" opacity={0.3} transparent />
            </mesh>
        </Float>
    );
}

function GlowOrb({
    position,
    color,
}: {
    position: [number, number, number];
    color: string;
}) {
    const meshRef = useRef<THREE.Mesh>(null);
    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.scale.setScalar(
                1 + Math.sin(state.clock.elapsedTime * 1.2) * 0.1
            );
        }
    });
    return (
        <mesh ref={meshRef} position={position}>
            <sphereGeometry args={[0.4, 32, 32]} />
            <MeshDistortMaterial
                color={color}
                distort={0.4}
                speed={2}
                transparent
                opacity={0.6}
                roughness={0}
                metalness={0.8}
            />
        </mesh>
    );
}

export default function DocumentScene() {
    return (
        <Canvas
            camera={{ position: [0, 0, 6], fov: 60 }}
            gl={{ alpha: true, antialias: true }}
            style={{ background: 'transparent' }}
            onCreated={({ gl }) => {
                gl.setClearColor(0x000000, 0);
            }}
            dpr={[1, 2]}
        >
            <ambientLight intensity={0.5} />
            <hemisphereLight intensity={0.4} color="#3B82F6" groundColor="#8B5CF6" />
            <pointLight position={[5, 5, 5]} color="#3B82F6" intensity={3} />
            <pointLight position={[-5, -3, 3]} color="#8B5CF6" intensity={2} />
            <pointLight position={[0, 3, -2]} color="#06B6D4" intensity={1.5} />

            <DocumentMesh
                position={[-2.2, 0.5, 0]}
                rotation={[0.1, 0.3, 0.05]}
                color="#3B82F6"
                scale={1.1}
            />
            <DocumentMesh
                position={[0, 0.8, -0.5]}
                rotation={[0.05, -0.2, 0.02]}
                color="#8B5CF6"
                scale={1.3}
            />
            <DocumentMesh
                position={[2.2, 0.2, 0.3]}
                rotation={[0.15, 0.1, -0.05]}
                color="#06B6D4"
                scale={1.0}
            />
            <DocumentMesh
                position={[-1.2, -1.2, 0.5]}
                rotation={[-0.1, 0.4, 0.08]}
                color="#A78BFA"
                scale={0.8}
            />
            <DocumentMesh
                position={[1.5, -1.0, -0.2]}
                rotation={[0.1, -0.3, -0.06]}
                color="#34D399"
                scale={0.85}
            />

            <GlowOrb position={[-3, 1.5, -2]} color="#3B82F6" />
            <GlowOrb position={[3.5, -1, -1.5]} color="#8B5CF6" />
        </Canvas>
    );
}

