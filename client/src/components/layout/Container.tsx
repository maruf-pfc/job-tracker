import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function Container({ children }: Props) {
  return <div className="mx-auto w-full max-w-7xl px-6 py-6">{children}</div>;
}
