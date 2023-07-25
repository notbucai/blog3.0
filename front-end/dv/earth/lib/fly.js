import * as THREE from "three";

// 获取弧线
export const getArcMesh = (arcInfo) => {
  // 绘制弧线
  const curve = new THREE.ArcCurve(
    0,
    0, // ax, aY
    arcInfo.radius, // radius
    arcInfo.startAngle,
    arcInfo.endAngle, // aStartAngle, aEndAngle
    false, // aClockwise
    0 // aRotation
  );
  const points = curve.getPoints(20);
  const _geometry = new THREE.BufferGeometry().setFromPoints(points);
  const _material = new THREE.LineBasicMaterial({
    color: 0x00ffff,
  });
  const ellipse = new THREE.Line(_geometry, _material);

  ellipse.position.copy(arcInfo.center);

  // 旋转
  ellipse.quaternion.multiply(arcInfo.quaternion);
  // 位置
  ellipse.position.applyQuaternion(arcInfo.quaternion);

  return ellipse;
};

// 获取非线
export const getFlyLineMesh = (arcInfo) => {
  const lengthAngle = (Math.PI / 180) * 8;

  const flyCurve = new THREE.ArcCurve(
    0,
    0, // ax, aY
    arcInfo.radius, // radius
    arcInfo.startAngle - lengthAngle,
    arcInfo.startAngle, // aStartAngle, aEndAngle
    false, // aClockwise
    0 // aRotation
  );
  const flyPoints = flyCurve.getPoints(20);
  const flyGeometry = new THREE.BufferGeometry().setFromPoints(flyPoints);
  const flyMaterial = new THREE.PointsMaterial({
    vertexColors: true,
    size: 1,
    transparent: true,
    side: THREE.DoubleSide,
  });
  const flyEllipse = new THREE.Points(flyGeometry, flyMaterial);
  flyEllipse.position.copy(arcInfo.center);
  flyEllipse.position.applyQuaternion(arcInfo.quaternion);
  flyEllipse.quaternion.multiply(arcInfo.quaternion);
  // 颜色 渐变
  const flyColors = [];
  const flyPercents = [];
  for (let i = 0; i < flyPoints.length; i++) {
    flyPercents.push(i / flyPoints.length + 0.6);
    // 0 - 1 : 0 - 255
    flyColors.push(0x00, 0xff, 0xff, i / flyPoints.length);
  }
  flyGeometry.setAttribute(
    "color",
    new THREE.BufferAttribute(new Float32Array(flyColors), 4)
  );
  flyGeometry.setAttribute(
    "percent",
    new THREE.BufferAttribute(new Float32Array(flyPercents), 1)
  );

  flyMaterial.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader.replace(
      "void main() {",
      "attribute float percent;\nvoid main() {"
    );

    shader.vertexShader = shader.vertexShader.replace(
      "gl_PointSize = size;",
      "gl_PointSize = size * percent;"
    );
  };

  return flyEllipse;
};
