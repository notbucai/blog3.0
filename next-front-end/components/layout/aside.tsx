/*
 * @Author: bucai<1450941858@qq.com>
 * @Date: 2021-11-29 19:42:24
 * @LastEditors: bucai<1450941858@qq.com>
 * @LastEditTime: 2021-12-06 16:55:20
 * @Description: 
 */
import { Button, Card, CardContent, Typography } from "@mui/material";
import { Delete } from "@mui/icons-material";
import layoutStyles from './style.module.scss'

const LayoutAside = () => {
  return (
    <div className={layoutStyles.aside}>
      <Typography gutterBottom variant="h5" component="div">
        标签
      </Typography>
      <Card>
        <CardContent>
          {
            ['测试1',' JavaScript', 'Python', 'Test', '前端', '不才'].map(item => (
              <Button sx={{ marginRight: 2, marginBottom: 1.2 }} key={item} startIcon={<Delete />} variant="contained" disableElevation>
                <span>{item}</span>
              </Button>
            ))
          }
        </CardContent>
      </Card>
    </div>
  );
}


export default LayoutAside