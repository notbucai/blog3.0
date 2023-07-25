import * as THREE from "three";

export const calculateCircleCenterAndRadius = (p1, p2, p3) => {
  const L1 = p1.lengthSq(); //p1到坐标原点距离的平方
  const L2 = p2.lengthSq();
  const L3 = p3.lengthSq();
  const x1 = p1.x,
    y1 = p1.y,
    x2 = p2.x,
    y2 = p2.y,
    x3 = p3.x,
    y3 = p3.y;
  const S = x1 * y2 + x2 * y3 + x3 * y1 - x1 * y3 - x2 * y1 - x3 * y2;
  const x = (L2 * y3 + L1 * y2 + L3 * y1 - L2 * y1 - L3 * y2 - L1 * y3) / S / 2;
  const y = (L3 * x2 + L2 * x1 + L1 * x3 - L1 * x2 - L2 * x3 - L3 * x1) / S / 2;
  // 三点外接圆圆心坐标
  const center = new THREE.Vector3(x, y, 0);
  const r = center.distanceTo(p2);

  return {
    x: center.x,
    y: center.y,
    z: center.z,
    r: r,
  };
}
// 生成弧线信息
export const calcArcInfo = (p1, p2) => {
  // 具体逻辑
  const startPosition = p1.clone();
  const endPosition = p2.clone();

  const xyo = new THREE.Vector3(0, 0, 1);
  const xoy = new THREE.Vector3(0, 1, 0);
  const origin = new THREE.Vector3(0, 0, 0);
  const length = startPosition.distanceTo(origin);
  const startSub = startPosition.clone().sub(origin);
  const endSub = endPosition.clone().sub(origin);

  const originCross = startSub
    .clone()
    .cross(endSub.clone().sub(origin))
    .normalize();

  const qxyo = new THREE.Quaternion().setFromUnitVectors(originCross, xyo);

  startPosition.applyQuaternion(qxyo);
  endPosition.applyQuaternion(qxyo);

  // 计算两点中点
  const centerPosition = startPosition
    .clone()
    .add(endPosition.clone())
    .divideScalar(2);
  // 法线
  const centerSub = centerPosition.sub(origin).normalize();
  const qxoy = new THREE.Quaternion().setFromUnitVectors(centerSub, xoy);

  startPosition.applyQuaternion(qxoy);
  endPosition.applyQuaternion(qxoy);

  // 计算角度
  const angle = startPosition.angleTo(endPosition);
  const centerRadiusPositionY = length + angle / 0.1;
  const centerRadiusPosition = new THREE.Vector3(0, centerRadiusPositionY, 0);

  // 计算圆心
  const circleCenterPositionInfo = calculateCircleCenterAndRadius(
    startPosition,
    endPosition,
    centerRadiusPosition
  );
  const circleRadius = circleCenterPositionInfo.r;
  const circleCenterPosition = new THREE.Vector3(
    circleCenterPositionInfo.x,
    circleCenterPositionInfo.y,
    circleCenterPositionInfo.z
  );

  // 计算点之间的角度 圆心circleCenterPosition, startPointPosition 与 rPointPosition 夹角
  const rPointPositionSub = circleCenterPosition
    .clone()
    .sub(centerRadiusPosition.clone())
    .normalize();
  const startPointPositionSub = circleCenterPosition
    .clone()
    .sub(startPosition.clone())
    .normalize();

  const rAngle = startPointPositionSub.angleTo(rPointPositionSub);

  const startAngle = Math.PI / 2 - rAngle;
  const endAngle = Math.PI - startAngle;

  const invertQuaternion = qxyo
    .clone()
    .invert()
    .multiply(qxoy.clone().invert());

  return {
    center: circleCenterPosition,
    radius: circleRadius,
    startAngle,
    endAngle,
    quaternion: invertQuaternion,
  };
};

// 经纬度转换为3D坐标
export const latLonToVector3 = (longitude, latitude, R) => {
  // 将经纬度转换为弧度
  let lon = (longitude * Math.PI) / 180; //转弧度值
  let lat = (latitude * Math.PI) / 180; //转弧度值
  lon = -lon; // three.js坐标系z坐标轴对应经度-90度，而不是90度

  // 经纬度坐标转球面坐标计算公式
  const x = R * Math.cos(lat) * Math.cos(lon);
  const y = R * Math.sin(lat);
  const z = R * Math.cos(lat) * Math.sin(lon);
  return new THREE.Vector3(x, y, z);
}
