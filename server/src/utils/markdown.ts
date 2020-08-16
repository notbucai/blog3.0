const md = require('markdown-it')({
  html: true,
  breaks: true,
  linkify: true,
})
  .use(require('markdown-it-highlightjs')) // 代码高亮 目前太大了
  .use(require('./markdown-it-sanitizer'), {
    extraTags: ['details', 'summary']
  });

import * as cheerio from 'cheerio';

class MarkdownUtils {

  markdown (content: string) {
    const resRender = md.render(content);
    return resRender;
  }
  markdownRender (htmlStr: string) {
    const $ = cheerio.load(htmlStr);
    const hns = $('h2,h3,h4,h5,h6').toArray();

    const menus = [];
    hns.forEach((item, i) => {
      var tag = item.tagName.toLowerCase();
      $(item).attr('id', 'wow' + i);
      menus.push({
        type: tag,
        target: '#wow' + i,
        title: $(item).text(),
      });
    });
    return {
      html: $.html(),
      menus
    }
  }
  htmlStrToText (htmlStr: string) {
    const $ = cheerio.load(htmlStr);
    
    return $($.html()).text();
  }

}

export default new MarkdownUtils();