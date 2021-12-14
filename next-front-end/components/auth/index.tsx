import { ArrowBack } from "@mui/icons-material";
import { Button, Modal, Typography, Box, TextField, ButtonBase } from "@mui/material";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { Form, FormItem } from "../common/form";

import styles from './style.module.scss';

interface Props {
  open: boolean;
  handleClose?: () => void
}

const Auth = ({ open, handleClose }: Props) => {
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: ''
  });
  const formRef = useRef()

  useEffect(() => {
    setTimeout(() => {
      console.log('formRef', formRef);
    }, 3000);
  }, [formRef])

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={{
        outline: 0,
        position: 'absolute' as 'absolute',
        top: '40%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400, maxWidth: '90%',
        bgcolor: 'background.paper',
        boxShadow: 24, p: 3, pt: 0,
        borderRadius: 1
      }}>
        <div style={{
          marginLeft: '-20px',
          marginTop: '6px',
          marginBottom: '12px'
        }}>
          <ButtonBase sx={{
            p: 1,
            pl: 2,
            pr: 2,
            borderRadius: 1,
          }}>
            <ArrowBack />
          </ButtonBase>
        </div>
        <Typography className={styles.authTitle1} id="modal-modal-title" variant="h4" component="h4">
          <span>欢迎你，</span>
          <Button color="error" size="large">登录</Button>
        </Typography>
        <Typography color="text.secondary" variant="h6" component="h6">
          请填写以下信息进行登录
        </Typography>

        <Box id="modal-modal-description" sx={{ mt: 2 }}>
          <Form onFinish={(data) => {
            console.log(data);
          }}>
            <FormItem name="username" rule={(v) => !!v || "不能为空"} label="用户名/手机号/邮箱" />
            <FormItem type="password" name="password" rule={(v) => !!v || "不能为空"} label="密码" />
            <Button size="large" type="submit" variant="contained" disableElevation fullWidth>继续</Button>
          </Form> 
        </Box>
      </Box>
    </Modal>
  )
}
export default Auth;