/*
 * @Author: bucai<1450941858@qq.com>
 * @Date: 2021-11-28 18:03:10
 * @LastEditors: bucai<1450941858@qq.com>
 * @LastEditTime: 2021-11-28 19:28:08
 * @Description: 
 */
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import Link, { LinkProps } from 'next/link'
import React, { Children } from 'react'

interface Props extends LinkProps, React.HTMLAttributes<HTMLAnchorElement> {
  children: React.ReactElement
  activeClassName?: string
}

const ActiveLink = ({ children, activeClassName, ...props }: Props) => {
  const { asPath } = useRouter()
  const child = Children.only(children) as React.ReactElement

  const childClassName = child.props.className || ''

  // pages/index.js will be matched via props.href
  // pages/about.js will be matched via props.href
  // pages/[slug].js will be matched via props.as

  const className =
    asPath === props.href || asPath === props.as
      ? `${childClassName} ${activeClassName || 'link-active'}`.trim()
      : childClassName

  return (
    <Link {...props}>
      {React.cloneElement(child, {
        className: className || null,
      })}
    </Link>
  )
}

ActiveLink.propTypes = {
  // activeClassName: PropTypes.string.isRequired,
}

export default ActiveLink