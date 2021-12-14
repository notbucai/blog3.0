/*
 * @Author: bucai<1450941858@qq.com>
 * @Date: 2021-12-12 16:02:12
 * @LastEditors: bucai<1450941858@qq.com>
 * @LastEditTime: 2021-12-13 10:14:56
 * @Description: 
 */

import clsx from 'clsx';
import React, { createContext, ForwardedRef, forwardRef, MutableRefObject, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { FormControl, FormHelperText, Input } from '@mui/material'

import styles from './style.module.scss';

type ValueType = string | boolean;
type DataType = { [key: string]: ValueType };
type ItemRuleType = (value: ValueType) => string | true
type RuleType = (value: ValueType) => boolean | undefined

interface ContextType {
  register: (name: string, rule?: RuleType) => void;
  change: (name: string, value: ValueType) => void;
  data: DataType;
}

const FormContext = createContext<ContextType>({
  register () { },
  change () { },
  data: {}
})

interface FormProps {
  children: React.ReactNode,
  onFinish?: (data: DataType) => void
}

export interface RefType {

}

function FormComponent ({ children, onFinish }: FormProps, ref: ForwardedRef<RefType>) {
  const data = useRef<DataType>({})
  const ruleMap = useRef<{ [key: string]: RuleType }>({})

  useEffect(() => {
    // if (!ref) return;
    // const uploadData = () => {

    // }
    // if (typeof ref === 'function') {
    //   ref({

    //   })
    // } else {
    //   ref.current = {

    //   }
    // }
  }, [ref])

  const registerItem = useCallback((name, rule) => {
    ruleMap.current = {
      ...ruleMap.current,
      [name]: rule
    }
  }, []);

  const changeItem = useCallback((key, value) => {
    data.current = {
      ...data.current,
      [key]: value
    };
  }, [data]);

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    e.stopPropagation()

    const _rules = ruleMap.current;
    const _data = data.current;
    let globalStatus = true;
    for (const key in _rules) {
      if (Object.prototype.hasOwnProperty.call(_rules, key)) {
        const rule = _rules[key];
        if (rule) {
          try {
            const status = rule(_data[key]);
            if (status !== undefined) {
              if (status === false) {
                globalStatus = false;
              }
            }
          } catch (e) {
            console.error(e);
          }
        }
      }
    }
    if (globalStatus) {
      onFinish && onFinish(data.current)
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <FormContext.Provider value={{
        register: registerItem,
        change: changeItem,
        data: data.current
      }}>
        {children}
      </FormContext.Provider>
    </form>
  )
}

export const Form = forwardRef(FormComponent)

interface FormItemProps {
  name: string;
  label: string;
  type?: 'text' | 'password';
  rule?: ItemRuleType
}

export const FormItem = ({ name, label, rule, type }: FormItemProps) => {

  const { change, register } = useContext(FormContext)
  const [errMsg, setErrMsg] = useState<true | string>('')

  const ruleFn = useCallback((value: ValueType) => {
    if (!rule) return;

    const msg = rule(value)
    setErrMsg(msg);
    // 通过校验
    return msg === true;
  }, [rule]);

  // 通知并注册
  useEffect(() => {
    register(name, ruleFn)
  }, [register, name, ruleFn]);

  return (
    <FormControl fullWidth className={styles.formItem}>
      <label className={clsx(styles.formLabel, styles.formLabelRequire)} htmlFor="auth-login-username">{label}</label>
      <Input
        type={type}
        onChange={e => {
          change(name, e.target.value);
          // setErrMsg(true)
          ruleFn(e.target.value)
        }}
        disableUnderline
        sx={{
          mt: '6px!important',
          input: {
            bgcolor: '#f4f5f6', p: 2, pt: 0, pb: 0,
            mt: '0!important',
            borderRadius: 1,
            height: 42,
            transition: 'all .4s',
            border: '2px solid transparent',
            "&:focus": {
              borderColor: "primary.main"
            }
          }
        }} />

      <FormHelperText sx={{ height: 24 }}>
        {
          typeof errMsg === 'string'
            ?
            (
              <span style={{ color: "#f00" }}>{errMsg}</span>
            )
            : null
        }
      </FormHelperText>

    </FormControl>
  )
}