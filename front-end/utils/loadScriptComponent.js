/*
 * @Author: bucai<1450941858@qq.com>
 * @Date: 2022-03-09 09:50:47
 * @LastEditors: bucai<1450941858@qq.com>
 * @LastEditTime: 2023-01-15 16:15:13
 * @Description:
 */
export const asyncLoad = {
  async mavonEditorComponent() {
    const id = 'mavon-editor-script';
    // 加载主题
    // const styleElement = document.createElement('style');
    // styleElement.href = '//unpkg.com/mavon-editor@2.9.0/dist/markdown/github-markdown.min.css';
    // styleElement.rel = 'stylesheet';
    // document.head.appendChild(styleElement);

    return new Promise(async (resolve, reject) => {
      let linkElement = document.getElementById(id);
      // 资源存在时
      if (!linkElement) {
        linkElement = document.createElement('script');
        linkElement.id = id;
        linkElement.src = '//image.notbucai.com/static/notbucai/static/mavon-editor.js';
        document.head.appendChild(linkElement);
        linkElement.onload = async () => {
          resolve((await import('mavon-editor')).mavonEditor);
        }
        linkElement.onerror = (error) => {
          reject(error);
        }
      } else {
        // 不存在时
        resolve((await import('mavon-editor')).mavonEditor);
      }
    });
  },
  async vueCropperComponent() {
    const id = 'vue-cropper-script';

    return new Promise(async (resolve, reject) => {
      let linkElement = document.getElementById(id);
      // 资源存在时
      if (!linkElement) {
        linkElement = document.createElement('script');
        linkElement.id = id;
        linkElement.src = '//www.unpkg.com/vue-cropper@0.5.3';
        document.head.appendChild(linkElement);
        linkElement.onload = async () => {
          try {
            resolve(window['vue-cropper'].VueCropper);
          } catch (error) {
            console.log(error);
          }
        }
        linkElement.onerror = (error) => {
          reject(error);
        }
      } else {
        // 不存在时
        resolve(window['vue-cropper'].VueCropper);
      }
    });
  },
  async browserImageCompression() {
    const id = 'browser-image-compression-script';
    return new Promise(async (resolve, reject) => {
      let linkElement = document.getElementById(id);
      // 资源存在时
      if (!linkElement) {
        linkElement = document.createElement('script');
        linkElement.id = id;
        linkElement.src = '//unpkg.com/browser-image-compression';
        document.head.appendChild(linkElement);
        linkElement.onload = async () => {
          resolve((await import('browser-image-compression')));
        }
        linkElement.onerror = (error) => {
          reject(error);
        }
      } else {
        // 不存在时
        resolve((await import('browser-image-compression')));
      }
    });
  },
  async splinetoolRuntime() {
    return new Promise(async (resolve, reject) => {
      const loadCallback = `load_${Date.now()}`;
      window[loadCallback] = (Application) => {
        resolve({ Application })
      }
      const linkElement = document.createElement('script');
      linkElement.type = 'module';
      // 临时处理一下
      linkElement.innerHTML = `
          import * as runtime from '//image.notbucai.com/static/key/runtime.js';
          ${loadCallback}(runtime.Application)
          window.SplinetoolRuntime = runtime;
        `;
      document.head.appendChild(linkElement);
    });
  }
}
