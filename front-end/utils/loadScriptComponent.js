/*
 * @Author: bucai<1450941858@qq.com>
 * @Date: 2022-03-09 09:50:47
 * @LastEditors: bucai<1450941858@qq.com>
 * @LastEditTime: 2022-03-09 10:16:27
 * @Description: 
 */
import ComponentLoading from '@/components/common/Loading.vue';
export const asyncLoad = {
  async mavonEditorComponent () {
    const id = 'mavon-editor-script';
    return new Promise(async (resolve, reject) => {
      let linkElement = document.getElementById(id);
      // 资源存在时
      if (!linkElement) {
        linkElement = document.createElement('script');
        linkElement.id = id;
        linkElement.src = '//unpkg.com/mavon-editor@2.9.0';
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
  }
}