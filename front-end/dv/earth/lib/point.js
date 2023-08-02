import * as THREE from "three";
import TWEEN from "@tweenjs/tween.js";
import { latLonToVector3 } from "./utils.js";

// https://image.notbucai.com/static/threejs/earth/assets/e-icon.png
let pointTexture = null;
export const getPointTexture = () => {
  if (pointTexture) {
    return pointTexture;
  }
  const base64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAFzmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDYgNzkuMTY0NzUzLCAyMDIxLzAyLzE1LTExOjUyOjEzICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjIuMyAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjMtMDctMzFUMjA6NTQ6MDkrMDg6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjMtMDctMzFUMjA6NTQ6MDkrMDg6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDIzLTA3LTMxVDIwOjU0OjA5KzA4OjAwIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjM1Mjg2YmJjLWRlOGUtNGJhYy1iMGI0LTUzNWFjN2FjY2IyYyIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjgwNThlZTIyLTY2NjQtMjU0Ni1hMzY5LTUzZjk3ZGRkYTM4YyIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjJkZmQyNzdlLTljNmEtNDdhYi1iZmU2LTFjNmY2YmM2NzQyYiIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjJkZmQyNzdlLTljNmEtNDdhYi1iZmU2LTFjNmY2YmM2NzQyYiIgc3RFdnQ6d2hlbj0iMjAyMy0wNy0zMVQyMDo1NDowOSswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIyLjMgKE1hY2ludG9zaCkiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjM1Mjg2YmJjLWRlOGUtNGJhYy1iMGI0LTUzNWFjN2FjY2IyYyIgc3RFdnQ6d2hlbj0iMjAyMy0wNy0zMVQyMDo1NDowOSswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIyLjMgKE1hY2ludG9zaCkiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+Xo651gAAAsBJREFUWIXFl09PU0EUxU8fSYFEookbYWco0aAQ44aQiBFZ6soNX8AEPoVuYeNKogE+gytdGAQDfgBoY0SNfxJXBIJ/y78S/Ll48/R2mLbvlSae5CbtnTnn3Dftm7mTA5QSpyTdkjQq6Yqk85JOu7Efkj5LWpP0UtIzSeVUqkCjKABzQJn0KDtOoZF+vcEOYAo4yGDs4wCYdlqZCugFVgOCJeA+MAr0AHkX54AbbqwU4K1SYzVC5leBDU9gBRip9RSBGHEciw2nXbeAArBpSHvABJDLYJ5EznH3jN6mvxKW0AmsmcnfgOEmjP0YBr4a3TXndayAKe/Jh1pgnsSQtxJTfgG9QMVMmKwj1g88AN4A+y7WXa6/Dm/S6Fec598C5szgCuHfPA88BI6ojSPgMWaJTeSo/mPOJwV0Ub3JhP7teWChjrGPRccJvR0JykCXgHGTLAZIAmYymCeYqaFVNHPGI0k3zc78JLBbX5I0kfbAMJiQdDmQtx5jkaRBk3gVINyV1NZEAW2O62PFfB4UsGWWpCewZOtNLH+CtwG9bjO+lQP2JbW7ijokHXgV2/GsOJSU93J541GJUojkmjSXpEqjCZGkX+b72cCcTyco4EsgZz1+RpI+mMSFAOH5CQpYCOQums8fI0klk7geIMxLOmrC/LekuUDeepQiSUsmcSdAeC1ptokCZh3Xh/VYzLIVv8jw+i0R3oqvmTk7uK1YxAdDglqHUTvx9trywyjrcTwAPALeAYfuSdZdbqAOzz+OC7YAEXevCXZpfUOya/SnkzE7qZPqk2qb1rVk20a3SI2WTPznpjSJUFu+TPa2fNnTSNWW25Uochwl4B7xxaSbfxeTbmCM+Ld9H+AV/SdvVICIr1PTVL8dWVGhyauZjT7ipnUng/Eu8Xve10g/B5mu57dVfT0/48a+q/p6/lQpr+d/APJVjMM0LiWfAAAAAElFTkSuQmCC';

  pointTexture = new THREE.TextureLoader().load(
    base64
  );
  return pointTexture;
}

/**
 * 
 * @param {THREE.Vector3} position 
 * @param {*} val 
 * @param {*} size 
 * @returns 
 */
export const getShowPoint = (position, val, size = 0.5) => {
  const gapSize = size * 0.2;

  const group = new THREE.Group();
  group.quaternion.setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    position.clone().normalize()
  );

  // // 创建外环
  // const outRingGeometry = new THREE.RingGeometry(size - gapSize, size, 12);
  // const outRingMaterial = new THREE.MeshBasicMaterial({
  //   color: 0x81f2e1,
  //   side: THREE.BackSide,
  // });
  // const outRing = new THREE.Mesh(outRingGeometry, outRingMaterial);
  // // 旋转角度
  // outRing.rotation.x = Math.PI / 2;
  // group.add(outRing);
  // 内圆面
  const texture = getPointTexture();
  const innerCircleGeometry = new THREE.CircleGeometry(size - gapSize * 2, 12);
  const innerCircleMaterial = new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
    map: texture,
    transparent: true,
  });
  const innerCircle = new THREE.Mesh(innerCircleGeometry, innerCircleMaterial);
  group.add(innerCircle);
  innerCircle.rotation.x = -Math.PI / 2;
  innerCircle.position.y = 1;

  // setTimeout(() => {
  //   console.log('innerCircle.rotation', innerCircle.rotation);
  // }, 10);

  // const rippleRingList = [];
  // for (let i = 0; i < 3; i++) {
  //   // 涟漪
  //   const rippleRingGeometry = new THREE.RingGeometry(
  //     size + gapSize * i,
  //     size + gapSize * i * 1.6,
  //     20
  //   );
  //   const rippleRingMaterial = new THREE.MeshBasicMaterial({
  //     color: 0x81f2e1,
  //     side: THREE.BackSide,
  //     transparent: true,
  //     opacity: 0.8,
  //   });
  //   const rippleRing = new THREE.Mesh(rippleRingGeometry, rippleRingMaterial);
  //   rippleRing.rotation.x = Math.PI / 2;

  //   rippleRingList.push(rippleRing);
  // }
  // // 旋转角度
  // group.add(...rippleRingList);

  // const baseLineSize = val;
  // // 创建线条
  // const lineGeometry = new THREE.BufferGeometry();
  // lineGeometry.setFromPoints([
  //   new THREE.Vector3(0, 0, 0),
  //   new THREE.Vector3(0, baseLineSize, 0),
  // ]);
  // const lineMaterial = new THREE.LineBasicMaterial({
  //   color: 0x81f2e1,
  //   linewidth: 1,
  // });
  // const line = new THREE.Line(lineGeometry, lineMaterial);
  // group.add(line);

  // new TWEEN.Tween({
  //   scale: 1,
  //   opacity: 0.8,
  // })
  //   .to({
  //     scale: 2,
  //     opacity: 0,
  //   })
  //   .onUpdate((obj) => {
  //     rippleRingList.forEach((rippleRing, index) => {
  //       rippleRing.scale.setScalar(obj.scale - index * 0.1);
  //       rippleRing.material.opacity = obj.opacity - index * 0.1;
  //     });
  //   })
  //   .delay(100)
  //   .duration(1000)
  //   .repeat(Infinity)
  //   .start();

  return group;
};

export const getShowPointByLonLat = (lon, lat, r, val, size = 0.5) => {
  const position = latLonToVector3(lon, lat, r);
  if (Number.isNaN(position.x) || Number.isNaN(position.y) || Number.isNaN(position.z)) {
    return null;
  }
  return getShowPoint(position, val, size);
};
