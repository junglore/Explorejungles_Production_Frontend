// import React, { useRef, useEffect, useState } from 'react';
// import { Canvas, useFrame } from '@react-three/fiber';
// import { useGLTF, Environment } from '@react-three/drei';

// // Constants
// const STOP_PROGRESS = 0.85;

// // Get responsive scale based on screen width
// const getResponsiveScale = (baseScale) => {
//     if (typeof window === 'undefined') return baseScale;
//     const width = window.innerWidth;
//     if (width <= 480) return baseScale * 0.5;
//     if (width <= 768) return baseScale * 0.6;
//     if (width <= 1024) return baseScale * 0.75;
//     return baseScale;
// };

// // Get responsive position adjustments
// const getResponsivePosition = (position) => {
//     if (typeof window === 'undefined') return position;
//     const width = window.innerWidth;
//     const [x, y, z] = position;

//     if (width <= 480) {
//         return [x * 0.4, y * 0.6, z * 0.8];
//     }
//     if (width <= 768) {
//         return [x * 0.6, y * 0.7, z * 0.9];
//     }
//     if (width <= 1024) {
//         return [x * 0.8, y * 0.85, z * 0.95];
//     }
//     return position;
// };

// // Updated keyframes with more dramatic left-right movement
// const KEYFRAMES = [
//     // Hero section - jeep starts on the right side of the jungle path (smaller size)
//     { progress: 0, position: [0.5, -2.5, 0.3], rotation: -0.2, scale: 0.014, speed: 0.5 },

//     // Transition to Wild Finds You section - jeep moves dramatically to left
//     { progress: 0.15, position: [-5, -2.3, 0.3], rotation: 0.8, scale: 0.014, speed: 0.8 },

//     // Ahoy section - jeep centered, facing forward
//     { progress: 0.38, position: [2, -1., 0.3], rotation: 0, scale: 0.016, speed: 0.3 },

//     // Resources section start - jeep moves to far right side and begins circular rotation
//     { progress: 0.52, position: [-1.5, -1.2, 0.2], rotation: -2, scale: 0.015, speed: 1.0 },

//     // Resources section mid - jeep continues circular rotation (top of circle)
//     { progress: 0.56, position: [-3, -0.8, 0.4], rotation: -3, scale: 0.015, speed: 0.8 },

//     // Resources section - jeep completes circular rotation (far right side of circle)
//     { progress: 0.60, position: [-3.5, -1.0, 0.3], rotation: -4, scale: 0.012, speed: 0.4 },

//     // Media section - jeep moves to far right side with smooth rotation
//     { progress: 0.70, position: [-4, -1.2, 0.2], rotation: -6, scale: 0.012, speed: 1.2 },

//     // Media section positioned
//     { progress: 0.75, position: [-2, -1.0, 0.2], rotation: -5, scale: 0.012, speed: 0.5 },

//     // Community section approach - jeep moving toward center from right
//     { progress: 0.82, position: [1, -1.0, 0.2], rotation: -3, scale: 0.013, speed: 0.5 },

//     // Community section final - jeep centered between deer and tree
//     { progress: 0.85, position: [4, -0.8, 0.2], rotation: -2, scale: 0.014, speed: 0.2 },

//     // Quiz section - jeep stays in center position
//     { progress: 1, position: [1, 1.7, 0.1], rotation: -1, scale: 0.014, speed: 0.1 },
// ];

// function easeInOutCubic(t) {
//     return t < 0.5 ? 4 * t ** 3 : 1 - Math.pow(-2 * t + 2, 3) / 2;
// }

// function lerp(a, b, t) {
//     return a + (b - a) * t;
// }

// function JeepModel() {
//     const jeepRef = useRef();
//     const wheelRefs = useRef([]);
//     const { scene } = useGLTF('/assets/jeep_model/jeep_wrangler.glb');
//     const [scrollProgress, setScrollProgress] = useState(0);
//     const [wheelRotation, setWheelRotation] = useState(0);
//     const [currentSpeed, setCurrentSpeed] = useState(0);

//     // Find wheel objects in the scene
//     useEffect(() => {
//         if (scene) {
//             const wheels = [];
//             scene.traverse((child) => {
//                 if (child.name && (
//                     child.name.toLowerCase().includes('wheel') ||
//                     child.name.toLowerCase().includes('tire') ||
//                     child.name.toLowerCase().includes('rim')
//                 )) {
//                     wheels.push(child);
//                 }
//             });
//             wheelRefs.current = wheels;
//         }
//     }, [scene]);

//     // Update scroll progress
//     useEffect(() => {
//         const handleScroll = () => {
//             const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
//             const currentProgress = Math.min(window.scrollY / maxScroll, 1);
//             setScrollProgress(currentProgress);
//         };

//         window.addEventListener('scroll', handleScroll);
//         handleScroll();

//         return () => {
//             window.removeEventListener('scroll', handleScroll);
//         };
//     }, []);

//     // Animate the jeep
//     useFrame((state, delta) => {
//         if (!jeepRef.current) return;

//         // Find the current keyframe segment
//         let from = KEYFRAMES[0];
//         let to = KEYFRAMES[KEYFRAMES.length - 1];

//         for (let i = 0; i < KEYFRAMES.length - 1; i++) {
//             if (scrollProgress >= KEYFRAMES[i].progress && scrollProgress <= KEYFRAMES[i + 1].progress) {
//                 from = KEYFRAMES[i];
//                 to = KEYFRAMES[i + 1];
//                 break;
//             }
//         }

//         // Calculate interpolation factor
//         const range = to.progress - from.progress;
//         const t = range > 0 ? easeInOutCubic((scrollProgress - from.progress) / range) : 0;

//         // Apply responsive scaling to positions and scale
//         const fromPosResponsive = getResponsivePosition(from.position);
//         const toPosResponsive = getResponsivePosition(to.position);
//         const fromScaleResponsive = getResponsiveScale(from.scale);
//         const toScaleResponsive = getResponsiveScale(to.scale);

//         // Calculate current speed for wheel rotation
//         const speed = lerp(from.speed, to.speed, t);
//         setCurrentSpeed(speed);

//         // Update wheel rotation based on speed
//         setWheelRotation(prev => prev + speed * delta * 5);

//         // Update jeep position, rotation, and scale
//         jeepRef.current.position.set(
//             lerp(fromPosResponsive[0], toPosResponsive[0], t),
//             lerp(fromPosResponsive[1], toPosResponsive[1], t),
//             lerp(fromPosResponsive[2], toPosResponsive[2], t)
//         );
//         jeepRef.current.rotation.y = lerp(from.rotation, to.rotation, t);
//         jeepRef.current.scale.setScalar(lerp(fromScaleResponsive, toScaleResponsive, t));

//         // Add slight bouncing motion when moving
//         if (speed > 0.3) {
//             jeepRef.current.position.y += Math.sin(state.clock.elapsedTime * 8) * 0.02 * speed;
//             jeepRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 6) * 0.02 * speed;
//         }

//         // Rotate wheels
//         wheelRefs.current.forEach((wheel) => {
//             if (wheel) {
//                 wheel.rotation.x = wheelRotation;
//             }
//         });
//     });

//     return <primitive ref={jeepRef} object={scene.clone()} castShadow receiveShadow />;
// }

// export default function JeepAnimation() {
//     const [cameraSettings, setCameraSettings] = useState({
//         position: [0, 2, 8],
//         fov: 75
//     });

//     useEffect(() => {
//         const updateCameraSettings = () => {
//             const width = window.innerWidth;
//             if (width <= 480) {
//                 setCameraSettings({ position: [0, 1.5, 10], fov: 85 });
//             } else if (width <= 768) {
//                 setCameraSettings({ position: [0, 1.8, 9], fov: 80 });
//             } else if (width <= 1024) {
//                 setCameraSettings({ position: [0, 2, 8.5], fov: 78 });
//             } else {
//                 setCameraSettings({ position: [0, 2, 8], fov: 75 });
//             }
//         };

//         updateCameraSettings();
//         window.addEventListener('resize', updateCameraSettings);

//         return () => window.removeEventListener('resize', updateCameraSettings);
//     }, []);

//     return (
//         <div style={{
//             position: 'fixed',
//             top: 0,
//             left: 0,
//             width: '100%',
//             height: '100%',
//             pointerEvents: 'none',
//             zIndex: 999
//         }}>
//             <Canvas
//                 camera={{
//                     position: cameraSettings.position,
//                     fov: cameraSettings.fov
//                 }}
//                 shadows
//                 gl={{ alpha: true, antialias: true }}
//                 style={{
//                     pointerEvents: 'none',
//                     width: '100%',
//                     height: '100%'
//                 }}
//                 onCreated={({ gl }) => gl.setClearColor('#000000', 0)}
//             >
//                 <ambientLight intensity={0.6} />
//                 <directionalLight position={[10, 10, 5]} intensity={0.8} castShadow />
//                 <directionalLight position={[-5, 5, -5]} intensity={0.3} color="#87CEEB" />
//                 <Environment preset="sunset" />
//                 <JeepModel />
//             </Canvas>
//         </div>
//     );
// } 


















import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment } from '@react-three/drei';

// Constants
const STOP_PROGRESS = 0.85;

// Get responsive scale based on screen width
const getResponsiveScale = (baseScale) => {
    if (typeof window === 'undefined') return baseScale;
    const width = window.innerWidth;
    if (width <= 480) return baseScale * 0.5;
    if (width <= 768) return baseScale * 0.6;
    if (width <= 1024) return baseScale * 0.75;
    return baseScale;
};

// Get responsive position adjustments
const getResponsivePosition = (position) => {
    if (typeof window === 'undefined') return position;
    const width = window.innerWidth;
    const [x, y, z] = position;

    if (width <= 480) {
        return [x * 0.4, y * 0.6, z * 0.8];
    }
    if (width <= 768) {
        return [x * 0.6, y * 0.7, z * 0.9];
    }
    if (width <= 1024) {
        return [x * 0.8, y * 0.85, z * 0.95];
    }
    return position;
};

// Creative serpentine animation with counterclockwise rotation
// Text Layout: Hero(RIGHT) → Wild(CENTER) → Ahoy(CENTER) → Resources(LEFT) → Media(RIGHT) → Community(LEFT) → Quiz(RIGHT) → Footer
const KEYFRAMES = [
    // Hero section (0-14%) - jeep starts on right, gentle entry
    { progress: 0, position: [0.5, -2.5, 0.3], rotation: -0.2, scale: 0.014, speed: 0.4 },
    { progress: 0.10, position: [-0.5, -2.3, 0.3], rotation: -2.1, scale: 0.014, speed: 0.6 },
    { progress: 0.14, position: [-2, -2.1, 0.3], rotation: -2.8, scale: 0.014, speed: 0.8 },

    // Wild section (14-28%) - centered text, jeep makes wide arc left
    { progress: 0.20, position: [-4, -1.9, 0.3], rotation: -4.0, scale: 0.015, speed: 0.9 },
    { progress: 0.25, position: [-5.5, -1.7, 0.3], rotation: -5.0, scale: 0.015, speed: 1.0 },
    { progress: 0.28, position: [-5, -1.5, 0.2], rotation: -5.5, scale: 0.015, speed: 1.0 },

    // Ahoy section (28-42%) - centered text, jeep starts moving right
    { progress: 0.32, position: [-3, -1.3, 0.3], rotation: -6.3, scale: 0.016, speed: 1.0 },
    { progress: 0.36, position: [0, -1.1, 0.2], rotation: -7.0, scale: 0.016, speed: 1.0 },
    { progress: 0.40, position: [3, -0.9, 0.2], rotation: -7.8, scale: 0.015, speed: 1.0 },

    // Resources section (40-55%) - LEFT text, jeep stays FAR RIGHT
    { progress: 0.44, position: [5, -0.7, 0.2], rotation: -8.5, scale: 0.014, speed: 1.0 },
    { progress: 0.48, position: [5.5, -0.5, 0.2], rotation: -9.3, scale: 0.014, speed: 0.9 },
    { progress: 0.52, position: [5.5, -0.3, 0.2], rotation: -10.1, scale: 0.014, speed: 0.9 },
    { progress: 0.55, position: [5, -0.1, 0.2], rotation: -10.6, scale: 0.014, speed: 0.9 },

    // Resources Second Page (55-62%) - transition, jeep swings quickly to far left EARLY
    { progress: 0.56, position: [3, -0.1, 0.2], rotation: -10.8, scale: 0.013, speed: 1.0 },
    { progress: 0.58, position: [-1, 0, 0.2], rotation: -11.2, scale: 0.013, speed: 1.0 },
    { progress: 0.60, position: [-3, 0.1, 0.2], rotation: -11.6, scale: 0.012, speed: 1.0 },
    { progress: 0.62, position: [-5, 0.2, 0.2], rotation: -12.0, scale: 0.012, speed: 0.9 },

    // Media section (62-76%) - RIGHT text, jeep at FAR LEFT then starts moving right at 0.74
    { progress: 0.66, position: [-5.5, 0.3, 0.2], rotation: -12.7, scale: 0.012, speed: 0.9 },
    { progress: 0.70, position: [-3, 0.35, 0.2], rotation: -13.5, scale: 0.012, speed: 0.9 },
    { progress: 0.74, position: [2, 0.45, 0.2], rotation: -14.2, scale: 0.012, speed: 1.0 },
    { progress: 0.76, position: [3, 0.55, 0.2], rotation: -14.6, scale: 0.012, speed: 1.0 },

    // Community section (76-88%) - LEFT text, jeep already moving FAR RIGHT
    { progress: 0.80, position: [1, 0.65, 0.2], rotation: -15.3, scale: 0.013, speed: 0.9 },
    { progress: 0.84, position: [-1, 0.75, 0.2], rotation: -16.1, scale: 0.013, speed: 0.8 },
    { progress: 0.88, position: [-2, 0.85, 0.2], rotation: -16.8, scale: 0.014, speed: 0.6 },

    // Quiz section (88-92%) - RIGHT text, jeep moves center-left and stops early
    { progress: 0.91, position: [-3, 1.1, 0.13], rotation: -17.4, scale: 0.014, speed: 0.4 },
    
    // Final position - locked in place with continued rotation for dynamic effect
    { progress: 0.92, position: [-3, 1.15, 0.12], rotation: -17.8, scale: 0.014, speed: 0.3 },
    { progress: 0.95, position: [-2, 1.15, 0.12], rotation: -18.4, scale: 0.014, speed: 0.2 },
    { progress: 1.0, position: [-1, 1.15, 0.12], rotation: -19.0, scale: 0.014, speed: 0.1 },
];

function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t ** 3 : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function JeepModel() {
    const jeepRef = useRef();
    const wheelRefs = useRef([]);
    const { scene } = useGLTF('/assets/jeep_model/jeep_wrangler.glb');
    const [scrollProgress, setScrollProgress] = useState(0);
    const [wheelRotation, setWheelRotation] = useState(0);
    const [currentSpeed, setCurrentSpeed] = useState(0);

    // Find wheel objects in the scene
    useEffect(() => {
        if (scene) {
            const wheels = [];
            scene.traverse((child) => {
                if (child.name && (
                    child.name.toLowerCase().includes('wheel') ||
                    child.name.toLowerCase().includes('tire') ||
                    child.name.toLowerCase().includes('rim')
                )) {
                    wheels.push(child);
                }
            });
            wheelRefs.current = wheels;
        }
    }, [scene]);

    // Update scroll progress
    useEffect(() => {
        const handleScroll = () => {
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            const currentProgress = Math.min(window.scrollY / maxScroll, 1);
            setScrollProgress(currentProgress);
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Animate the jeep
    useFrame((state, delta) => {
        if (!jeepRef.current) return;

        // Find the current keyframe segment
        let from = KEYFRAMES[0];
        let to = KEYFRAMES[KEYFRAMES.length - 1];

        for (let i = 0; i < KEYFRAMES.length - 1; i++) {
            if (scrollProgress >= KEYFRAMES[i].progress && scrollProgress <= KEYFRAMES[i + 1].progress) {
                from = KEYFRAMES[i];
                to = KEYFRAMES[i + 1];
                break;
            }
        }

        // Calculate interpolation factor
        const range = to.progress - from.progress;
        const t = range > 0 ? easeInOutCubic((scrollProgress - from.progress) / range) : 0;

        // Apply responsive scaling to positions and scale
        const fromPosResponsive = getResponsivePosition(from.position);
        const toPosResponsive = getResponsivePosition(to.position);
        const fromScaleResponsive = getResponsiveScale(from.scale);
        const toScaleResponsive = getResponsiveScale(to.scale);

        // Calculate current speed for wheel rotation
        const speed = lerp(from.speed, to.speed, t);
        setCurrentSpeed(speed);

        // Update wheel rotation based on speed
        setWheelRotation(prev => prev + speed * delta * 5);

        // Update jeep position, rotation, and scale
        jeepRef.current.position.set(
            lerp(fromPosResponsive[0], toPosResponsive[0], t),
            lerp(fromPosResponsive[1], toPosResponsive[1], t),
            lerp(fromPosResponsive[2], toPosResponsive[2], t)
        );
        jeepRef.current.rotation.y = lerp(from.rotation, to.rotation, t);
        jeepRef.current.scale.setScalar(lerp(fromScaleResponsive, toScaleResponsive, t));

        // Add slight bouncing motion when moving
        if (speed > 0.3) {
            jeepRef.current.position.y += Math.sin(state.clock.elapsedTime * 8) * 0.02 * speed;
            jeepRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 6) * 0.02 * speed;
        }

        // Rotate wheels
        wheelRefs.current.forEach((wheel) => {
            if (wheel) {
                wheel.rotation.x = wheelRotation;
            }
        });
    });

    return <primitive ref={jeepRef} object={scene.clone()} castShadow receiveShadow />;
}

export default function JeepAnimation() {
    const [cameraSettings, setCameraSettings] = useState({
        position: [0, 2, 8],
        fov: 75
    });

    useEffect(() => {
        const updateCameraSettings = () => {
            const width = window.innerWidth;
            if (width <= 480) {
                setCameraSettings({ position: [0, 1.5, 10], fov: 85 });
            } else if (width <= 768) {
                setCameraSettings({ position: [0, 1.8, 9], fov: 80 });
            } else if (width <= 1024) {
                setCameraSettings({ position: [0, 2, 8.5], fov: 78 });
            } else {
                setCameraSettings({ position: [0, 2, 8], fov: 75 });
            }
        };

        updateCameraSettings();
        window.addEventListener('resize', updateCameraSettings);

        return () => window.removeEventListener('resize', updateCameraSettings);
    }, []);

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 999
        }}>
            <Canvas
                camera={{
                    position: cameraSettings.position,
                    fov: cameraSettings.fov
                }}
                shadows
                gl={{ alpha: true, antialias: true }}
                style={{
                    pointerEvents: 'none',
                    width: '100%',
                    height: '100%'
                }}
                onCreated={({ gl }) => gl.setClearColor('#000000', 0)}
            >
                <ambientLight intensity={0.6} />
                <directionalLight position={[10, 10, 5]} intensity={0.8} castShadow />
                <directionalLight position={[-5, 5, -5]} intensity={0.3} color="#87CEEB" />
                <Environment preset="sunset" />
                <JeepModel />
            </Canvas>
        </div>
    );
} 