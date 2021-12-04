/*
 * @Author: bucai<1450941858@qq.com>
 * @Date: 2021-11-28 17:16:36
 * @LastEditors: bucai<1450941858@qq.com>
 * @LastEditTime: 2021-11-29 17:09:41
 * @Description: 
 */
import { Container } from "@material-ui/core";

export default function Footer () {
  return (
    <Container>
      <footer className="footer">
        <div className="container">
          <div className="content has-text-centered">
            <p>
              <strong>Next-Front-End</strong>
            </p>
            <p>
              <a href="https://bu-cai.github.io/">bu-cai</a>
            </p>
          </div>
        </div>
      </footer>
    </Container>

  )
}
