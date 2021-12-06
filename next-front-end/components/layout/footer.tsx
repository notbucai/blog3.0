/*
 * @Author: bucai<1450941858@qq.com>
 * @Date: 2021-11-28 17:16:36
 * @LastEditors: bucai<1450941858@qq.com>
 * @LastEditTime: 2021-12-05 17:11:31
 * @Description: 
 */
import { Container } from "@mui/material";

export default function LayoutFooter () {
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
