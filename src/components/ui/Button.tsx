import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "light";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-lime-500 text-forest-950 shadow-[0_10px_30px_-10px_rgba(163,230,53,0.8)] hover:bg-lime-400",
  secondary: "bg-forest-800 text-white hover:bg-forest-900 shadow-card",
  outline:
    "border border-forest-200 bg-white/60 text-forest-900 hover:border-forest-400 hover:bg-white",
  ghost: "text-forest-900 hover:bg-forest-50",
  light: "bg-white text-forest-900 shadow-card hover:bg-lime-50",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-6 text-sm",
  lg: "h-14 px-8 text-base",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60";

type BaseProps = {
  children: React.ReactNode;
  className?: string;
  variant?: Variant;
  size?: Size;
  iconRight?: boolean;
  icon?: React.ReactNode;
};

type LinkProps = BaseProps & {
  href: string;
  external?: boolean;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

type ButtonProps = BaseProps & {
  href?: undefined;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button(props: LinkProps | ButtonProps) {
  const {
    children,
    className,
    variant = "primary",
    size = "md",
    icon,
    iconRight = true,
  } = props;

  const classes = cn(base, variants[variant], sizes[size], className);
  const content = (
    <>
      {icon && !iconRight && icon}
      <span>{children}</span>
      {icon && iconRight && icon}
    </>
  );

  if ("href" in props && props.href) {
    const {
      href,
      external,
      children: _children,
      className: _className,
      variant: _variant,
      size: _size,
      icon: _icon,
      iconRight: _iconRight,
      ...rest
    } = props;
    if (external) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...rest}>
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...rest}>
        {content}
      </Link>
    );
  }

  const {
    href: _href,
    external: _external,
    children: _children,
    className: _className,
    variant: _variant,
    size: _size,
    icon: _icon,
    iconRight: _iconRight,
    ...rest
  } = props as ButtonProps & { href?: string; external?: boolean };

  return (
    <button className={classes} {...rest}>
      {content}
    </button>
  );
}
