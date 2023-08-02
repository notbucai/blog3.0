const writeCss = (link) => {
  const linkEle = document.createElement('link');
  linkEle.setAttribute('rel', 'stylesheet');
  linkEle.setAttribute('href', link);
  document.head.appendChild(linkEle);
}
export const initStyle = () => {
  if (!window || !document) {
    return;
  }
  console.log('init style');
  writeCss('//image.notbucai.com/static/notbucai/static/animate.min.css');
  writeCss('//image.notbucai.com/static/notbucai/static/github-markdown.min.css');
}

export default {};