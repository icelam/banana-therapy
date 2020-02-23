import 'pathseg';
import decomp from 'poly-decomp';
import Matter from 'matter-js';
import { getWindowSize, getRandomInteger } from '@js/utils';
import yellowBananaSvg from '@images/bananas/yellow-banana.svg';
import pinkBananaSvg from '@images/bananas/pink-banana.svg';

// Add poly-decomp for creating Vertices
if (!window.decomp) {
  window.decomp = decomp;
}

const {
  Engine,
  Render,
  World,
  Body,
  Bodies,
  Svg,
  Vertices,
  Mouse,
  MouseConstraint
} = Matter;

const fallBananas = (totalBananas = 50, dropInterval = 200) => {
  /* Settings */
  const SETTINGS = {
    TOTAL_BANANA: totalBananas,
    DROP_INTERVAL: dropInterval,
    DROP_X_CENTER_OFFSET_PERCENT: 0.1
  };

  /* Shared Variables */
  let engine;
  let render;
  let bananaInterval;

  /* Reset Engine */
  const resetAll = () => {
    if (bananaInterval) {
      window.clearInterval(bananaInterval);
    }

    window.scrollTo(0, 0);

    // Remove Renender
    if (render) {
      render.canvas.remove();
      render.canvas = null;
      render.context = null;
      render.textures = {};
      render.mouse = {};
      Render.stop(render);
    }

    // Reset Engine
    if (engine) {
      engine.events = {};
      World.clear(engine.world);
      Engine.clear(engine);
    }
  };

  /* Init */
  const init = () => {
    const { width: canvasWidth, height: canvasHeight } = getWindowSize();
    const vmax = Math.max(canvasWidth, canvasHeight);
    const isLandscape = canvasHeight > canvasWidth;

    engine = Engine.create();

    /* Create canvas */
    render = Render.create({
      element: document.body,
      engine: engine,
      options: {
        wireframes: false,
        showInternalEdges: false,
        background: 'transparent',
        width: canvasWidth,
        height: canvasHeight
      }
    });

    /* Canvas boundries to hold bananas */
    World.add(engine.world, [
      // right boundries
      Bodies.rectangle(canvasWidth + 50, 0, 100, canvasHeight * 2, {
        isStatic: true,
        render: {
          fillStyle: 'red'
        }
      }),
      // bottom boundries
      Bodies.rectangle(canvasWidth / 2, canvasHeight + 50, canvasWidth, 100, {
        isStatic: true,
        render: {
          fillStyle: 'transparent'
        }
      }),
      // left boundries
      Bodies.rectangle(-50, 0, 100, canvasHeight * 2, {
        isStatic: true,
        render: {
          fillStyle: 'transparent'
        }
      })
    ]);

    /* Add mouse control */
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.5,
        render: {
          visible: false
        }
      }
    });

    World.add(engine.world, mouseConstraint);
    render.mouse = mouse;

    /* Banana Vertices */
    const bananaVertexSets = [];
    const bananaPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    bananaPath.setAttribute('d', `
      M238.2,77.2c10.6-11.8,16.3-23.5,18.5-33.1l0,0l26.7-26.7L266,0l-23.9,19.7l0,0c-9.8-0.1-23.1,4.5-38.2,8.5
      c-21.8,6.2-47.4,11.2-75.2,10.2c-27.9-0.8-53.1-7.4-74.5-14.9C33,16.5,15.6,8.5,5.8,15.1c-6.1,3.8-8.1,15.9-2.5,31.3l0,0
      c2.7,7.4,7.1,15.5,13.7,23.8c19.4,25.2,59.2,52,109.1,52.6C176,125.4,217.3,101.1,238.2,77.2z
    `);
    const bananaPoints = Svg.pathToVertices(bananaPath, 30);
    const ratioBase = isLandscape ? 1280 : 1920;
    const bananaScale = (vmax / ratioBase) * 0.8;
    const bananaScaledVertexSet = Vertices.scale(bananaPoints, bananaScale, bananaScale);
    // Convert multiple concave path to one convex path
    const bananaHullVertexSet = Vertices.hull(bananaScaledVertexSet);
    bananaVertexSets.push(bananaHullVertexSet);

    /* Add a single banana */
    const addBanana = (mode = 'yellow') => {
      const centerOffset = Math.floor(canvasWidth * SETTINGS.DROP_X_CENTER_OFFSET_PERCENT);
      const x = mode === 'yellow'
        ? getRandomInteger(canvasWidth / 2 - centerOffset, canvasWidth / 2 + centerOffset)
        : (canvasWidth / 2);
      const y = -250;

      // Banana shape for collision
      const bananaBody = Bodies.fromVertices(
        x,
        y,
        bananaVertexSets,
        {
          render: {
            sprite: {
              texture: mode === 'yellow' ? yellowBananaSvg : pinkBananaSvg,
              xScale: bananaScale,
              yScale: bananaScale
            }
          }
        },
        true
      );

      // Random rotation
      Body.setAngle(bananaBody, getRandomInteger(0, 360));

      // World.add(engine.world, [bananaBackground, bananaShape, constraint]);
      World.add(engine.world, bananaBody);
    };

    /* Add bananas for X time in every Y ms */
    const addBananasLoop = (delay, repetitions) => {
      let bananaCount = 0;
      bananaInterval = window.setInterval(() => {
        bananaCount++;

        const specialPercentage = isLandscape ? 0.75 : 0.5;
        const bananaColor = bananaCount === Math.floor(repetitions * specialPercentage)
          ? 'pink'
          : 'yellow';

        addBanana(bananaColor);

        if (bananaCount === repetitions) {
          window.clearInterval(bananaInterval);
          // setTimeout(() => { Render.stop(render); }, 3000);
        }
      }, delay);
    };

    /* Bananas!!! */
    addBananasLoop(SETTINGS.DROP_INTERVAL, SETTINGS.TOTAL_BANANA);

    Engine.run(engine);
    Render.run(render);
  };

  return {
    init,
    resetAll
  };
};

export default fallBananas;
