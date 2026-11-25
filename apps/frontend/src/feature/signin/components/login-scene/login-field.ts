import { cn } from "@/lib/utils";
import styles from "./login-scene.module.css";

export const LOGIN_FIELD_CLASS = cn(
  styles.inner,
  styles.field,
  "h-10 border-foreground/60 placeholder:text-foreground/70",
);

export const LOGIN_OTP_SLOT_CLASS = cn(
  styles.otpSlot,
  "size-10 border-foreground/60",
);

export const LOGIN_SUBMIT_CLASS = cn(
  styles.inner,
  "h-10 w-full border border-white/70 bg-primary-700 hover:bg-primary-800",
);

export const LOGIN_ALERT_CLASS = cn(styles.inner, styles.field);

export const LOGIN_LABEL_CLASS = "px-1";
