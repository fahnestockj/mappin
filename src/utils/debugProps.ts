import { useRef, useEffect } from "react";

export function useTraceUpdate<IProps extends object>(props: IProps) {
  const prev = useRef<IProps>(props);
  useEffect(() => {
    const changedProps = Object.entries(props).reduce((ps, [k, v]) => {
      if (prev.current[k as keyof IProps] !== v) {
        // @ts-ignore
        ps[k] = [prev.current[k], v];
      }
      return ps;
    }, {});
    if (Object.keys(changedProps).length > 0) {
      console.log("Changed props:", changedProps);
    }
    prev.current = props;
  });
}