
import * as THREE from "three";
import TWEEN from '@tweenjs/tween.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { getBackground } from './lib/decorate.js';
import { createEarth } from './lib/earth.js';
import { calcArcInfo } from "./lib/utils.js";
import { getArcMesh, getFlyLineMesh } from "./lib/fly.js";
import { getShowPointByLonLat } from "./lib/point.js";

export default class Earth {
  constructor(
    {
      container,
      size = 100
    }
  ) {
    this.container = container;
    this.size = size;
    this.initScene();
    // this.initEarth()
  }
  initScene () {
    const renderer = this.renderer = new THREE.WebGLRenderer({ antialias: false, });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    this.container.appendChild(renderer.domElement);

    const scene = this.scene = new THREE.Scene();

    const camera = this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.z = -320;
    camera.position.x = -90;
    camera.position.y = 140;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 50;
    controls.maxDistance = 1000;

    scene.add(new THREE.AmbientLight(0x443333));

    const light = this._getLight();
    scene.add(light);

    function onWindowResize () {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function animate () {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
      TWEEN.update();
    }

    onWindowResize();
    animate();

    window.addEventListener('resize', onWindowResize, false);
  }
  async initEarth () {
    const size = this.size;

    const scene = this.scene;
    const earthGroup = this.earthGroup = new THREE.Group();
    // 背景
    const bg = getBackground(size);
    earthGroup.add(bg);

    const earth = await createEarth(size);
    earthGroup.add(earth);

    scene.add(earthGroup);
  }
  _getLight () {
    const light = new THREE.DirectionalLight(0x88ffff, 0.5);
    light.position.set(-70, 140, -120);
    light.lookAt(new THREE.Vector3());
    // light.add(new THREE.AxesHelper(10));
    return light;
  }

  renderData (
    coreLocation,
    originLocationList,
  ) {
    const size = this.size;
    const earthGroup = this.earthGroup;
    // 当前经纬度
    const currentLon = coreLocation.lon;
    const currentLat = coreLocation.lat;

    const corePoint = getShowPointByLonLat(currentLon, currentLat, size, 0, 2.5);
    earthGroup.add(corePoint);

    const points = originLocationList.map(location => {
      const originPoint = getShowPointByLonLat(location.lon, location.lat, size, location.count, 1.5);
      if (!originPoint) {
        return;
      }
      const targetPointPosition = corePoint.position;
      const originPointPosition = originPoint.position;
      // 两点长度
      const distance = originPointPosition.distanceTo(targetPointPosition);

      // 如果小于1 就忽略
      if (distance < 10) {
        originPoint.clear();
        return null;
      }

      // 核心
      const arcInfo = calcArcInfo(originPointPosition, targetPointPosition);
      const arcMesh = getArcMesh(arcInfo);
      const flyEllipse = getFlyLineMesh(arcInfo);

      const group = new THREE.Group();
      earthGroup.add(originPoint);
      group.add(flyEllipse);
      group.add(arcMesh);
      new TWEEN.Tween(flyEllipse.rotation)
        .to(
          {
            z: arcInfo.endAngle - arcInfo.startAngle + flyEllipse.rotation.z,
          },
          1500 * (distance / size)
        )
        .easing(TWEEN.Easing.Linear.None)
        .delay(100)
        .repeat(Infinity)
        .start();
      return group;
    }).filter(item => item);

    earthGroup.add(...points);

  }
}
