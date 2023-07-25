import * as THREE from "three";
import TWEEN from "@tweenjs/tween.js";
import { latLonToVector3 } from "./utils.js";

export const getShowPoint = (position, val, size = 0.5) => {
  const gapSize = size * 0.2;

  const group = new THREE.Group();
  group.position.copy(position);
  group.quaternion.setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    position.clone().normalize()
  );

  // 创建外环
  const outRingGeometry = new THREE.RingGeometry(size - gapSize, size, 20);
  const outRingMaterial = new THREE.MeshBasicMaterial({
    color: 0x81f2e1,
    side: THREE.DoubleSide,
  });
  const outRing = new THREE.Mesh(outRingGeometry, outRingMaterial);
  // 旋转角度
  outRing.rotation.x = Math.PI / 2;
  group.add(outRing);
  // 内圆面
  const innerCircleGeometry = new THREE.CircleGeometry(size - gapSize * 2, 20);
  const innerCircleMaterial = new THREE.MeshBasicMaterial({
    color: 0x81f2e1,
    side: THREE.DoubleSide,
  });
  const innerCircle = new THREE.Mesh(innerCircleGeometry, innerCircleMaterial);
  innerCircle.rotation.x = Math.PI / 2;
  group.add(innerCircle);

  const rippleRingList = [];
  for (let i = 0; i < 3; i++) {
    // 涟漪
    const rippleRingGeometry = new THREE.RingGeometry(
      size + gapSize * i,
      size + gapSize * i * 1.6,
      20
    );
    const rippleRingMaterial = new THREE.MeshBasicMaterial({
      color: 0x81f2e1,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8,
    });
    const rippleRing = new THREE.Mesh(rippleRingGeometry, rippleRingMaterial);
    rippleRing.rotation.x = Math.PI / 2;

    rippleRingList.push(rippleRing);
  }
  // 旋转角度
  group.add(...rippleRingList);

  const baseLineSize = val;
  // 创建线条
  const lineGeometry = new THREE.BufferGeometry();
  lineGeometry.setFromPoints([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, baseLineSize, 0),
  ]);
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x81f2e1,
    linewidth: 1,
  });
  const line = new THREE.Line(lineGeometry, lineMaterial);
  group.add(line);

  new TWEEN.Tween({
    scale: 1,
    opacity: 0.8,
  })
    .to({
      scale: 2,
      opacity: 0,
    })
    .onUpdate((obj) => {
      rippleRingList.forEach((rippleRing, index) => {
        rippleRing.scale.setScalar(obj.scale - index * 0.1);
        rippleRing.material.opacity = obj.opacity - index * 0.1;
      });
    })
    .delay(100)
    .duration(1000)
    .repeat(Infinity)
    .start();

  return group;
};

export const getShowPointByLonLat = (lon, lat, r, val, size = 0.5) => {
  const position = latLonToVector3(lon, lat, r);
  if (Number.isNaN(position.x) || Number.isNaN(position.y) || Number.isNaN(position.z)) {
    return null;
  }
  return getShowPoint(position, val, size);
};
