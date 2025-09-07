import Image from "next/image";

import { cn } from "@/lib/utils";
import { PropsWithClassName } from "@/types";

export default function Logo({
  className,
  ...props
}: PropsWithClassName & React.ComponentProps<"img">) {
  return (
    <Image
      {...props}
      src={"/logo/telcokart_logo.png"}
      alt="Telcokart Logo"
      width={80}
      height={80}
      className={cn(className)}
      style={{ height: "auto", width: 120 }}
    />
  );
}
