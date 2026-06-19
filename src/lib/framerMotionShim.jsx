import React from 'react';

const cleanProps = (props = {}) => {
  const { initial, animate, exit, transition, whileHover, whileTap, layout, variants, drag, dragConstraints, ...rest } = props;
  return rest;
};
const base = (Tag) => React.forwardRef(({ children, ...props }, ref) => <Tag ref={ref} {...cleanProps(props)}>{children}</Tag>);
export const motion = new Proxy({}, { get: (_target, prop) => base(prop) });
export function AnimatePresence({ children }) { return <>{children}</>; }
