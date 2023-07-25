import * as THREE from "three";

export const getBackground = (redis) => {
  // 加载材质
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load("https://image.notbucai.com/static/threejs/earth/assets/bg.png");
  // 创建精灵
  const spriteMaterial = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
  });
  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.scale.set(redis * 3, redis * 3, 0);

  return sprite;
};
