import * as THREE from "three";
import { latLonToVector3 } from "./utils.js";

/**
 * 创建一个地球
 * @param {Number} radius 半径
 * @returns
 */
export const createEarth = async (radius = 100) => {
  const coreRadius = radius;

  // 地球贴图
  const textureLoader = new THREE.TextureLoader();
  const texture = await new Promise((resolve, reject) => {
    textureLoader.load(
      "/earth/world.png",
      (t) => {
        resolve(t);
      }
    );
  });
  // 球
  const geometry = new THREE.SphereGeometry(coreRadius, 64, 64);
  const material = new THREE.MeshPhongMaterial({
    map: texture,
    // normalMap: texture,
    // side: THREE.DoubleSide,
    // color: 0x777777,
    // transparent: true,
    // alphaTest:0.8,
    // depthWrite: true,
    // depthWrite: false,
  });
  const sphere = new THREE.Mesh(geometry, material);

  // 表面线条
  new THREE.FileLoader().load('https://image.notbucai.com/static/threejs/earth/assets/countries.geo.json', (data) => {
    const json = JSON.parse(data);

    // console.log('json.features', );
    const featurePoints = json.features.reduce((pv, feature) => {
      const geometry = feature.geometry;
      let coordinates = [];
      if (geometry.type === "Polygon") {
        // -
        coordinates = [geometry.coordinates];
      } else if (geometry.type === "MultiPolygon") {
        // -
        coordinates = geometry.coordinates;
      }
      const rootPoints = coordinates.reduce((rootPv, polygons) => {
        const points = polygons.reduce((pv, polygon) => {
          const points = polygon.reduce((pv, point) => {
            // // 经纬度转2d坐标
            const [x, y] = point;
            const v3 = latLonToVector3(x, y, coreRadius);
            const list = [pv[pv.length - 1], v3];
            if (pv.length <= 1) {
              list.shift();
            }
            return pv.concat(list);
          }, []);
          // points.push(points[0]);
          return pv.concat(points);
        }, []);

        return rootPv.concat(points);
      }, []);
      return pv.concat(rootPoints);
    }, []);

    const lineGeometry = new THREE.BufferGeometry().setFromPoints(
      featurePoints
    );
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x81f2e1,
      linewidth: 1,
    });
    const line = new THREE.LineSegments(lineGeometry, lineMaterial);

    sphere.add(line);
  });

  // 球体光晕
  const glowGeometry = new THREE.SphereGeometry(coreRadius + 2, 64, 64);
  const glowMaterial = new THREE.MeshLambertMaterial({
    color: 0xffffff,
    side: THREE.FrontSide,
    transparent: true,
    opacity: 0.1,
    depthWrite: false,
  });
  const glowSphere = new THREE.Mesh(glowGeometry, glowMaterial);
  sphere.add(glowSphere);

  return sphere;
};
