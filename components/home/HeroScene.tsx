 "use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Canvas,
  useFrame,
  useThree,
} from "@react-three/fiber";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import * as THREE from "three";


export type HeroMachine3D = {
  id: string;
  model: string;

  accent: string;
  sectorAccent: string;

  targetSize: number;
  baseRotationY: number;
  rotationSpeed: number;
};


type Props = {
  machine: HeroMachine3D;

  reducedMotion:
    | boolean
    | null;

  className?: string;

  onLoading?: (
    id: string,
  ) => void;

  onProgress?: (
    id: string,
    progress: number,
  ) => void;

  onReady?: (
    id: string,
  ) => void;

  onError?: (
    id: string,
  ) => void;
};


type LoadedMachine = {
  root: THREE.Group;
  config: HeroMachine3D;
};


/* =========================================================
   DISPOSE
========================================================= */

function disposeMachine(
  root: THREE.Object3D,
) {
  const textures =
    new Set<THREE.Texture>();


  root.traverse(
    (object) => {
      if (
        !(
          object instanceof
          THREE.Mesh
        )
      ) {
        return;
      }


      object.geometry?.dispose();


      const materials =
        Array.isArray(
          object.material,
        )
          ? object.material
          : [
              object.material,
            ];


      materials.forEach(
        (material) => {
          if (!material) {
            return;
          }


          const candidate =
            material as THREE.MeshStandardMaterial;


          [
            candidate.map,
            candidate.normalMap,
            candidate.roughnessMap,
            candidate.metalnessMap,
            candidate.aoMap,
            candidate.emissiveMap,
            candidate.alphaMap,
          ].forEach(
            (texture) => {
              if (texture) {
                textures.add(
                  texture,
                );
              }
            },
          );


          material.dispose();
        },
      );
    },
  );


  textures.forEach(
    (texture) =>
      texture.dispose(),
  );
}


/* =========================================================
   PREPARE ORIGINAL GLB

   NO:
   - cambia UV
   - cambia colores
   - cambia texturas
   - comprime
   - usa Meshopt
========================================================= */

function prepareMachine(
  scene: THREE.Group,
  config: HeroMachine3D,
  anisotropy: number,
) {
  const root =
    new THREE.Group();


  root.add(scene);


  scene.traverse(
    (object) => {
      if (
        !(
          object instanceof
          THREE.Mesh
        )
      ) {
        return;
      }


      object.castShadow =
        false;

      object.receiveShadow =
        false;


      const materials =
        Array.isArray(
          object.material,
        )
          ? object.material
          : [
              object.material,
            ];


      materials.forEach(
        (material) => {
          if (
            !(
              material instanceof
                THREE.MeshStandardMaterial ||
              material instanceof
                THREE.MeshPhysicalMaterial
            )
          ) {
            return;
          }


          const maps = [
            material.map,
            material.normalMap,
            material.roughnessMap,
            material.metalnessMap,
            material.aoMap,
          ];


          maps.forEach(
            (texture) => {
              if (!texture) {
                return;
              }


              texture.anisotropy =
                anisotropy;

              texture.needsUpdate =
                true;
            },
          );
        },
      );
    },
  );


  root.updateMatrixWorld(
    true,
  );


  /* =====================================================
     SCALE
  ====================================================== */

  let box =
    new THREE.Box3().setFromObject(
      root,
    );


  const size =
    box.getSize(
      new THREE.Vector3(),
    );


  const largest =
    Math.max(
      size.x,
      size.y,
      size.z,
    );


  const scale =
    config.targetSize /
    Math.max(
      largest,
      0.00001,
    );


  root.scale.setScalar(
    scale,
  );


  root.updateMatrixWorld(
    true,
  );


  /* =====================================================
     CENTER
  ====================================================== */

  box =
    new THREE.Box3().setFromObject(
      root,
    );


  const center =
    box.getCenter(
      new THREE.Vector3(),
    );


  root.position.x -=
    center.x;

  root.position.z -=
    center.z;


  root.updateMatrixWorld(
    true,
  );


  /* =====================================================
     FLOOR
  ====================================================== */

  box =
    new THREE.Box3().setFromObject(
      root,
    );


  const groundY =
    -1.36;


  root.position.y +=
    groundY -
    box.min.y;


  root.updateMatrixWorld(
    true,
  );


  return root;
}


/* =========================================================
   LOADING MARK

   Mientras carga el primer GLB,
   mostramos solamente este aro.

   NO mostramos ningún tractor blanco.
========================================================= */

function LoadingMark({
  accent,
}: {
  accent: string;
}) {
  const group =
    useRef<THREE.Group>(
      null,
    );


  useFrame(
    (_, delta) => {
      if (
        !group.current
      ) {
        return;
      }


      group.current.rotation.z -=
        delta * 0.5;
    },
  );


  return (
    <group
      ref={group}
      position={[
        0,
        0.1,
        0,
      ]}
    >
      <mesh>
        <torusGeometry
          args={[
            0.52,
            0.018,
            8,
            72,
          ]}
        />

        <meshBasicMaterial
          color={
            accent
          }
          transparent
          opacity={0.75}
        />
      </mesh>


      <mesh
        rotation={[
          0,
          0,
          Math.PI / 2,
        ]}
      >
        <torusGeometry
          args={[
            0.37,
            0.012,
            8,
            72,
            Math.PI * 1.45,
          ]}
        />

        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.25}
        />
      </mesh>
    </group>
  );
}


/* =========================================================
   MACHINE STAGE
========================================================= */

function MachineStage({
  machine,
  reducedMotion,
  onLoading,
  onProgress,
  onReady,
  onError,
}: Omit<
  Props,
  "className"
>) {
  const [
    displayed,
    setDisplayed,
  ] =
    useState<LoadedMachine | null>(
      null,
    );


  const pivot =
    useRef<THREE.Group>(
      null,
    );


  const spin =
    useRef(0);


  const entrance =
    useRef(1);


  const requestId =
    useRef(0);


  const {
    gl,
  } = useThree();


  const anisotropy =
    Math.min(
      gl.capabilities
        .getMaxAnisotropy(),
      8,
    );


  /* =====================================================
     LOAD ORIGINAL GLB
  ====================================================== */

  useEffect(() => {
    const currentRequest =
      ++requestId.current;


    onLoading?.(
      machine.id,
    );


    onProgress?.(
      machine.id,
      0,
    );


    const loader =
      new GLTFLoader();


    loader.load(
      machine.model,


      /* SUCCESS */

      (gltf) => {
        if (
          currentRequest !==
          requestId.current
        ) {
          disposeMachine(
            gltf.scene,
          );

          return;
        }


        const prepared =
          prepareMachine(
            gltf.scene,
            machine,
            anisotropy,
          );


        entrance.current =
          reducedMotion
            ? 1
            : 0;


        spin.current = 0;


        setDisplayed(
          (previous) => {
            if (
              previous?.root
            ) {
              const oldRoot =
                previous.root;


              requestAnimationFrame(
                () => {
                  disposeMachine(
                    oldRoot,
                  );
                },
              );
            }


            return {
              root:
                prepared,

              config:
                machine,
            };
          },
        );


        onProgress?.(
          machine.id,
          100,
        );


        onReady?.(
          machine.id,
        );
      },


      /* PROGRESS */

      (event) => {
        if (
          currentRequest !==
          requestId.current
        ) {
          return;
        }


        if (
          !event.total
        ) {
          return;
        }


        const value =
          Math.min(
            99,
            Math.round(
              (event.loaded /
                event.total) *
                100,
            ),
          );


        onProgress?.(
          machine.id,
          value,
        );
      },


      /* ERROR */

      () => {
        if (
          currentRequest !==
          requestId.current
        ) {
          return;
        }


        onError?.(
          machine.id,
        );
      },
    );
  }, [
    machine,
    anisotropy,
    onLoading,
    onProgress,
    onReady,
    onError,
    reducedMotion,
  ]);


  /* =====================================================
     CLEANUP
  ====================================================== */

  useEffect(() => {
    return () => {
      if (
        displayed?.root
      ) {
        disposeMachine(
          displayed.root,
        );
      }
    };
  }, [
    displayed,
  ]);


  /* =====================================================
     ROTATION
  ====================================================== */

  useFrame(
    (
      state,
      delta,
    ) => {
      const group =
        pivot.current;


      if (
        !group ||
        !displayed
      ) {
        return;
      }


      const {
        config,
      } = displayed;


      if (
        reducedMotion
      ) {
        group.rotation.set(
          0.012,
          config.baseRotationY,
          0,
        );


        group.scale.setScalar(
          1,
        );


        group.position.y =
          0;


        return;
      }


      spin.current +=
        delta *
        config.rotationSpeed;


      const pointerX =
        state.pointer.x *
        0.055;


      const pointerY =
        state.pointer.y *
        -0.025;


      group.rotation.y =
        config.baseRotationY +
        spin.current +
        pointerX;


      group.rotation.x =
        THREE.MathUtils.lerp(
          group.rotation.x,
          pointerY,
          0.04,
        );


      entrance.current =
        Math.min(
          1,
          entrance.current +
            delta * 2.7,
        );


      const ease =
        1 -
        Math.pow(
          1 -
            entrance.current,
          3,
        );


      const scale =
        0.92 +
        ease * 0.08;


      group.scale.setScalar(
        scale,
      );


      group.position.y =
        (1 - ease) *
          0.12 +
        Math.sin(
          state.clock
            .elapsedTime *
            0.65,
        ) *
          0.009;
    },
  );


  /*
    MUY IMPORTANTE:

    Si todavía no cargó el GLB,
    NO existe ningún tractor provisional.

    Solo el LoadingMark.
  */

  if (!displayed) {
    return (
      <LoadingMark
        accent={
          machine.accent
        }
      />
    );
  }


  return (
    <group
      ref={pivot}
      rotation={[
        0.012,
        displayed
          .config
          .baseRotationY,
        0,
      ]}
    >
      <primitive
        object={
          displayed.root
        }
      />
    </group>
  );
}


/* =========================================================
   FLOOR
========================================================= */

function Floor({
  accent,
}: {
  accent: string;
}) {
  return (
    <group>
      <mesh
        rotation={[
          -Math.PI / 2,
          0,
          0,
        ]}
        position={[
          0,
          -1.375,
          0,
        ]}
        scale={[
          1.9,
          0.72,
          1,
        ]}
      >
        <circleGeometry
          args={[
            1.8,
            72,
          ]}
        />

        <meshBasicMaterial
          color="#000000"
          transparent
          opacity={0.32}
          depthWrite={false}
        />
      </mesh>


      <mesh
        rotation={[
          -Math.PI / 2,
          0,
          0,
        ]}
        position={[
          0,
          -1.37,
          0,
        ]}
      >
        <ringGeometry
          args={[
            2.55,
            2.565,
            128,
          ]}
        />

        <meshBasicMaterial
          color={
            accent
          }
          transparent
          opacity={0.38}
          side={
            THREE.DoubleSide
          }
        />
      </mesh>


      <mesh
        rotation={[
          -Math.PI / 2,
          0,
          0,
        ]}
        position={[
          0,
          -1.368,
          0,
        ]}
      >
        <ringGeometry
          args={[
            2.05,
            2.057,
            128,
          ]}
        />

        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.08}
          side={
            THREE.DoubleSide
          }
        />
      </mesh>
    </group>
  );
}


/* =========================================================
   RESPONSIVE
========================================================= */

function SceneContent(
  props: Omit<
    Props,
    "className"
  >,
) {
  const {
    viewport,
  } = useThree();


  const mobile =
    viewport.width < 5.4;


  const verySmall =
    viewport.width < 4;


  return (
    <group
      scale={
        verySmall
          ? 0.73
          : mobile
            ? 0.82
            : 1
      }

      position={
        mobile
          ? [
              0,
              0.06,
              0,
            ]
          : [
              0,
              0,
              0,
            ]
      }
    >
      <Floor
        accent={
          props.machine
            .accent
        }
      />


      <MachineStage
        {...props}
      />
    </group>
  );
}


/* =========================================================
   CANVAS
========================================================= */

export default function HeroScene(
  props: Props,
) {
  return (
    <div
      className={
        props.className
      }
    >
      <Canvas
  dpr={1}

        camera={{
          position: [
            0,
            0.5,
            7.6,
          ],

          fov: 33,

          near: 0.1,

          far: 50,
        }}

       gl={{
  alpha: true,
  antialias: false,
  powerPreference:
    "default",
  preserveDrawingBuffer:
    false,
}}

        performance={{
          min: 0.5,
        }}

        frameloop={
          props.reducedMotion
            ? "demand"
            : "always"
        }

        onCreated={({
          gl,
        }) => {
          gl.setClearColor(
            0x000000,
            0,
          );


          gl.toneMapping =
            THREE.ACESFilmicToneMapping;


          gl.toneMappingExposure =
            1.05;


          gl.outputColorSpace =
            THREE.SRGBColorSpace;
        }}
      >
        <ambientLight
          intensity={1.6}
        />


        <hemisphereLight
          args={[
            "#ffffff",
            "#353737",
            1.45,
          ]}
        />


        <directionalLight
          position={[
            4,
            6,
            5,
          ]}
          intensity={3.1}
          color="#ffffff"
        />


        <directionalLight
          position={[
            -4,
            2,
            3,
          ]}
          intensity={1.35}
          color="#d9dfdd"
        />


        <pointLight
          position={[
            3,
            2,
            3,
          ]}
          intensity={4.3}
          distance={10}
          color={
            props.machine
              .accent
          }
        />


        <pointLight
          position={[
            -3,
            0.2,
            3,
          ]}
          intensity={2.5}
          distance={9}
          color={
            props.machine
              .sectorAccent
          }
        />


        <SceneContent
          {...props}
        />
      </Canvas>
    </div>
  );
}   