'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Environment } from '@react-three/drei';
import * as THREE from 'three';

function ArchitecturalBox({ position, scale, rotationSpeed }) {
    const mesh = useRef();

    useFrame((state) => {
        if (mesh.current) {
            mesh.current.rotation.x += rotationSpeed.x;
            mesh.current.rotation.y += rotationSpeed.y;
            mesh.current.position.y += Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.002;
        }
    });

    return (
        <mesh position={position} scale={scale} ref={mesh}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial
                color="#A67C52"
                wireframe
                transparent
                opacity={0.15}
                side={THREE.DoubleSide}
            />
        </mesh>
    );
}

function GridLines() {
    const lines = useMemo(() => {
        const temp = [];
        for (let i = -10; i <= 10; i += 2) {
            temp.push(
                <mesh key={`h-${i}`} position={[0, i, -5]} rotation={[0, 0, Math.PI / 2]}>
                    <planeGeometry args={[20, 0.01]} />
                    <meshBasicMaterial color="#001738" transparent opacity={0.03} />
                </mesh>,
                <mesh key={`v-${i}`} position={[i, 0, -5]}>
                    <planeGeometry args={[0.01, 20]} />
                    <meshBasicMaterial color="#001738" transparent opacity={0.03} />
                </mesh>
            );
        }
        return temp;
    }, []);
    return <group>{lines}</group>;
}

function FloatingScene() {
    const boxes = useMemo(() => {
        return Array.from({ length: 15 }).map((_, i) => ({
            position: [
                (Math.random() - 0.5) * 15,
                (Math.random() - 0.5) * 15,
                (Math.random() - 0.5) * 5 - 2
            ],
            scale: Math.random() * 2 + 0.5,
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.002,
                y: (Math.random() - 0.5) * 0.002
            }
        }));
    }, []);

    return (
        <group>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} color="#A67C52" />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color="#001738" />

            <GridLines />

            {boxes.map((props, i) => (
                <Float key={i} speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
                    <ArchitecturalBox {...props} />
                </Float>
            ))}
        </group>
    );
}

export default function ArchitecturalBackground() {
    return (
        <div className="absolute inset-0 z-0 bg-[#f7f7f7]">
            <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
                <FloatingScene />
            </Canvas>
        </div>
    );
}
