import React from 'react';
import Particles from 'react-tsparticles';
import type { Engine } from 'tsparticles-engine';
import { loadFull } from 'tsparticles';

interface FloatingParticlesProps {
  visible: boolean;
}

export function FloatingParticles({ visible }: FloatingParticlesProps) {
  const particlesInit = async (engine: Engine) => {
    await loadFull(engine);
  };

  if (!visible) {
    return null;
  }

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 5, pointerEvents: 'none', backgroundColor: 'transparent' }}>
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          fullScreen: { enable: false },
          fpsLimit: 60,
          particles: {
            number: {
              value: 80,
              density: {
                enable: true,
                area: 800,
              },
            },
            color: {
              value: '#00ffff',
            },
            shape: {
              type: 'circle',
            },
            opacity: {
              value: 0.5,
              random: true,
              anim: {
                enable: true,
                speed: 1,
                opacity_min: 0.2,
                sync: false,
              },
            },
            size: {
              value: 4,
              random: true,
              anim: {
                enable: true,
                speed: 3,
                size_min: 1,
                sync: false,
              },
            },
            move: {
              enable: true,
              speed: 0.7,
              direction: 'none',
              random: true,
              straight: false,
              outModes: {
                default: 'out',
              },
              attract: {
                enable: false,
              },
            },
          },
          interactivity: {
            detectsOn: 'canvas',
            events: {
              onHover: {
                enable: false,
              },
              onClick: {
                enable: false,
              },
              resize: true,
            },
          },
          detectRetina: true,
        }}
      />
    </div>
  );
}
