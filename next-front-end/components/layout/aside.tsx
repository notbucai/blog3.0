/*
 * @Author: bucai<1450941858@qq.com>
 * @Date: 2021-11-29 19:42:24
 * @LastEditors: bucai<1450941858@qq.com>
 * @LastEditTime: 2021-11-30 12:32:49
 * @Description: 
 */
import { Button, Card, CardContent, Typography } from "@material-ui/core";
import { Delete } from "@material-ui/icons";

const Aside = () => {

  return (
    <div>
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


export default Aside