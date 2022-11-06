<template>
  <div class="Qixi" v-if="isQixi">
    <div class="qixi-main" v-show="isStart">
      <div>
        <img
          v-for="(item) in renderList"
          :key="item.id"
          :data-id="item.id"
          :src="list[item.index]"
          class="Qixi-image"
        />
      </div>
      <div class="qixi-love">
        <!-- <transition-group tag="div" name="love"> -->
        <img
          v-for="(item) in love"
          :key="item.id"
          :src="list[item.index]"
          class="love-image"
          :style="{
              top:item.y+'px',
              left:item.x+'px',
            }"
        />
        <!-- </transition-group> -->
      </div>
      <div class="love-full">
        <img
          v-for="(item) in loveFull"
          :key="item.id"
          :src="list[item.index]"
          class="love-full-image"
          :style="{
          top:item.y+'px',
          left:item.x+'px',
        }"
        />
      </div>

      <div class="aaa">
        <img
          v-for="(item) in love3dFull"
          :key="item.id"
          :src="list[item.index]"
          class="love-3d-image"
          :style="{
          top:item.y+'px',
          left:item.x+'px',
        }"
        />
      </div>
      <div class="aaa">
        <img
          v-for="(item) in love3dFull1"
          :key="item.id"
          :src="list[item.index]"
          class="love-3d-image1"
          :style="{
          top:item.y+'px',
          left:item.x+'px',
        }"
        />
      </div>

      <canvas
        ref="canvas-qixi"
        class="canvas-qixi"
        :style="{zIndex:isComplete?'9999':'',backgroundColor:'rgba(255,255,255,.9)'}"
      ></canvas>
    </div>
    <audio src="https://image.notbucai.com/music/qixi.mp3" ref="audio" hidden></audio>
    <div class="qixi-dialog" @click="handleOpenQixi" v-show="!isStart">
      <div class="qixi-text">
        点击开启
        <span>七夕</span>
        <span>彩蛋</span>
      </div>
    </div>
    <div v-if="isComplete" class="love-text-box">结束</div>
  </div>
</template>
<script>
import tweenjs from '@tweenjs/tween.js';

const { Exponential, Bounce, Linear, Circular } = tweenjs.Easing;

const EasingList = [Exponential.Out, Circular.In, Circular.Out, Circular.InOut, Exponential.In, Exponential.InOut, Bounce.Out, Bounce.InOut, Bounce.In, Linear.None];

import { fullScreen, requestAnimFrame, heartShape, randomIndex, getImageByUrl, getGenerate } from './utils';

export default {
  components: {},
  props: {},
  computed: {
    isQixi () {
      return true;
      if (localStorage.getItem('qixi')) return false  ;
      const date = new Date();
      const y = date.getFullYear()
      const m = String(date.getMonth() + 1).padStart(2, '0')
      const d = date.getDate();
      const cDate = `${y}-${m}-${d}`;
      console.log('current:' + cDate);
      return cDate === '2020-08-25';
    }
  },
  data () {
    return {
      lastTime: Date.now(),
      list: [],
      loveFull: [],
      love3dFull: [],
      love3dFull1: [],
      renderList: [],
      tempLove: [102, 291, 109, 84, 103, 78, 97, 116, 91, 110, 85, 104, 79, 98, 117, 92, 111, 86, 105, 80, 256, 11, 99, 275, 250, 269, 244, 263, 238, 257, 276, 251, 270, 245, 220, 239, 214, 277, 296, 271, 246, 64],
      love: [],
      isStart: false,
      isComplete: false,
      textList: [
        "茫茫人海中，我只看到你。",
        "愿得一人心，白首不相离。",
        "青色烟雨，孤影等你归来。",
        "一个人，一座城，一生心疼。",
        "时光再荏苒，也凝成琥珀。",
        "夜微凉、灯微暗、暧昧散尽。",
        "若情深已无用，知与谁同。",
        "你知不知道，你对我的重要。",
      ]

    };
  },
  created () {

  },
  mounted () {
    if (localStorage.getItem('qixi')) return;
    if (this.isQixi) {
      // 验证时间
      const BaseImgUrl = 'https://image.notbucai.com/flowers';
      const mockImgList = Array(7).fill('').map((_, index) => BaseImgUrl + '/img_' + (index + 1) + '.png');
      this.$init(mockImgList);

    }
    // const _fullscreen = () => {
    //   // window.removeeventlistener('click', _fullscreen);
    //   fullscreen();
    // }
    // window.addEventListener('click', _fullScreen);
  },
  methods: {
    handleOpenQixi () {
      this.isStart = true;
      this.$nextTick(() => {
        fullScreen();
        this.$refs['audio'].play();

        setTimeout(() => {
          this.render();
          this.generateWord = getGenerate(this.$refs['canvas-qixi']);
          // this.generateWord('茫茫人海中，我只看到你。');
        }, 300);

      })
    },
    $init (list) {
      // 这里预加载
      this.list = list;
      this.list.forEach((url) => {
        getImageByUrl(url);
      });
    },
    $getImageByRandom () {
      const index = (Math.random() * this.list.length) | 0;
      const itemImage = {
        id: Math.random(),
        index,
        x: Math.random() * window.innerWidth,
        y: 0,
        opacity: 1,
      };
      return itemImage;
    },
    $getRandomEasing () {
      return EasingList[(Math.random() * EasingList.length) | 0];
    },
    $_createElement () {
      this.lastTime = Date.now();
      const img = this.$getImageByRandom();
      const len = this.renderList.push(img);

      this.$nextTick(() => {
        const allimage = [...(document.querySelectorAll('.Qixi-image') || [])];
        if (!allimage) return;
        const image = allimage.find(item => item.dataset.id == img.id);

        if (!image) return;
        const tween = new tweenjs.Tween({ ...img });

        const speed = Math.random() * 30000 + 2000;

        const to = {
          x: Math.random() * window.innerWidth,
          y: window.innerHeight - image.height,
          opacity: 0.1
        };

        tween
          .to(to, speed)
          .easing(this.$getRandomEasing())
          .onUpdate(({ x, y, opacity }, elapsed) => {
            image.style.top = y + 'px';
            image.style.left = x + 'px';
            image.style.opacity = opacity;
          })
          .onComplete(() => {
            setTimeout(() => {
              image.remove();
            }, 3000);
          })
          .start();
      })
    },
    $readmeFull () {
      if (this.isComplete) return;
      let list = this.loveFull;
      if (list.length > 260) {
        list = this.love3dFull;
        if (list.length > 100) {
          list = this.love3dFull1
          if (list.length > 100) {
            this.isComplete = true;
            // this.now = Date.now() - 5000;
            return;
          }
        }
      }
      const index = randomIndex(this.list.length);

      list.push({
        index,
        x: Math.random() * window.innerWidth - 50,
        y: Math.random() * window.innerHeight - 50,
        id: Math.random()
      });

    },
    $readerLove () {
      const r = 140;
      this.time = this.time || 0;

      if (Date.now() - 100 > this.time) {
        this.time = Date.now();
        this.loveIndex = this.loveIndex || 0;
        const value = this.tempLove[this.loveIndex];
        if (!value) {
          this.time = Date.now() + 24 * 60 * 60 * 1000;
          return;
        }
        const { x, y } = heartShape(r, value);

        this.loveIndex++;
        const lastItem = this.love[this.love.length - 1];
        this.love.push({
          id: Math.random(),
          index: randomIndex(this.list.length, lastItem && lastItem.index),
          x: x + window.innerWidth / 2 - 50,
          y: y + r
        });
      }
    },
    $nextText () {
      this.textListIndex = this.textListIndex || 0;
      let text = this.textList[this.textListIndex];
      this.textListIndex++;
      if (!text) {
        localStorage.setItem('qixi', 'qixi')
        text = '谢谢观看';
      }
      this.generateWord(text);

    },
    render (time) {
      if (Math.random() < 0.2) this.$_createElement();

      if (this.renderList.length >= 10) {
        this.$readerLove();
      }
      if (this.loveIndex >= this.tempLove.length) {
        this.$readmeFull();
      }
      if (this.isComplete) {
        // this.loveFull = [];
        this.love3dFull = [];
        this.love3dFull1 = [];
        // return;
        this.now = this.now || 0;
        if (Date.now() - 6500 > this.now) {
          this.now = Date.now();
          this.$nextText();
        }
      }
      requestAnimFrame((time) => {
        this.render(time);
      });
      tweenjs.update(time)
    }
  }
}
</script>
<style lang="scss" scoped>
.Qixi {
  position: relative;
  z-index: 99999999;
  .qixi-main {
  }
  .Qixi-image {
    position: fixed;
    width: 32px;
    height: 32px;
    top: -100px;
    left: -100px;
    opacity: 1;
    z-index: 12;
    transform: translate3d(0, 0, 0);
  }
  .qixi-love {
    position: relative;
    z-index: 99;
    /* transform: translate3d(0, 0, 0); */
    .love-image {
      position: fixed;
      left: 0;
      top: 0;
      z-index: 99;
      width: 100px;
      height: 100px;
      transition: all 1s;
      transform: translate3d(0, 0, 0);
      animation: swing 1s 1s linear infinite alternate;
    }
  }
  .qixi-dialog {
    position: fixed;
    top: 200px;
    left: 50%;

    width: 300px;
    height: 300px;
    background-color: #ff7f78;
    /* transform: */
    animation-name: shake1;
    animation-duration: 0.5s;
    animation-iteration-count: infinite;
    cursor: pointer;

    user-select: none;
    * {
      cursor: pointer;
    }
    .qixi-text {
      position: absolute;
      z-index: 10;
      left: -50%;
      transform: rotateZ(-45deg) translateX(50%);
      top: 150px;
      font-size: 32px;
      color: #fff;
      font-weight: bold;
      span {
        text-shadow: 0 0 8px rgba($color: #ffffff, $alpha: 0.6);
        font-size: 38px;
        &:last-child {
          font-size: 26px;
        }
      }
    }
    &::before {
      content: '';
      position: absolute;
      top: -50%;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: inherit;
      cursor: pointer;
    }
    &::after {
      content: '';
      position: absolute;
      top: 0px;
      left: -50%;
      width: 100%;
      height: 100%;
      background-color: inherit;
      border-radius: 50%;
      cursor: pointer;
    }
  }
  .love-text-box {
    font-size: 120px;
    font-weight: bold;
    padding-top: 200px;
    background-color: rgb(136, 140, 255);
    color: #fff;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0.5;
    animation: colorChange 30s 0.2s linear infinite alternate;
  }
  .canvas-qixi {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
}
.love-enter-active,
.love-leave-active {
  opacity: 0.4;
  width: 10px;
  height: 10px;
}
.love-full {
  .love-full-image {
    transform: translate3d(0, 0, 0);
    width: 100px;
    z-index: 1;
    height: 100px;
    animation: swing 2s 1s linear infinite alternate;
    /* margin-top: -50px; */
    opacity: 0.6;
    position: fixed;
  }
}
.love-3d-image {
  position: fixed;
  width: 100px;
  left: 0;
  top: 0;
  animation: falling 1.8s 0s forwards;
  z-index: 99;
  /* transform: ; */
}
.love-3d-image1 {
  position: fixed;
  width: 30%;
  left: 0;
  top: 0;
  animation: show-heart 1.8s 0s forwards;
  z-index: 99;
  &.love-active {
    opacity: 1 !important;
    width: 300px;
    animation: none;
    /* transform: translate(-50%, -50%); */
    margin-left: -150px;
    margin-top: -150px;
    animation: swing 2s 0s linear infinite alternate;
  }
  /* transform: ; */
}

@keyframes falling {
  15% {
    transform: translate(-50%, -50%) rotateZ(0deg);
    opacity: 0;
  }
  60% {
    opacity: 1;
    width: 100%;
    transform: translate(-50%, -50%) rotateZ(180deg);
  }
  99% {
    opacity: 0.5;
  }
  100% {
    transform: translate(-50%, -50%) rotateZ(270deg);
    opacity: 0;
    width: 0;
    display: none;
  }
}
@keyframes show-heart {
  0% {
    opacity: 0;
    transform: translateX(-50%) translateY(-50%) scale(1.5) rotateZ(-15deg);
  }
  50% {
    opacity: 0.8;
    //transform:translateX(-50%) translateY(-50%) scale(1) rotateZ(30deg);
  }
  100% {
    opacity: 0;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%) scale(0.2) rotateZ(15deg);
    display: none;
  }
}
@keyframes shake1 {
  from {
    transform: translateX(-50%) rotateZ(45deg) scale(0.9, 0.9);
    opacity: 0.9;
  }
  to {
    transform: translateX(-50%) rotateZ(45deg) scale(1.1, 1.1);
    opacity: 1;
  }
}
@keyframes swing {
  0% {
    transform: rotateZ(10deg);
  }
  70% {
    opacity: 0.6;
  }
  80% {
    opacity: 1;
  }
  100% {
    transform: rotateZ(-10deg);
  }
}
@keyframes colorChange {
  0% {
    background-color: rgb(202, 187, 187);
    color: #666;
  }
  10% {
    background-color: rgb(224, 152, 151);
    color: #fff;
  }
  20% {
    background-color: rgb(171, 222, 170);
    color: #fff;
  }
  30% {
    background-color: rgb(148, 156, 215);
    color: #fff;
  }
  40% {
    background-color: rgb(216, 213, 140);
    color: #fff;
  }
  50% {
    background-color: rgb(133, 189, 209);
    color: #fff;
  }
  60% {
    background-color: rgb(208, 129, 212);
    color: #fff;
  }
  70% {
    background-color: rgb(140, 206, 216);
    color: #fff;
  }
  80% {
    background-color: rgb(188, 214, 157);
    color: #fff;
  }
  80% {
    background-color: rgb(121, 109, 109);
    color: #fff;
  }
}
</style>