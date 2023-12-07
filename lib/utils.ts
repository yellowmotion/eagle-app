import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getObjectByRef = (obj: any, ref: string) => {
  if (!ref) { // TODO: rimuovere questo controllo e gestire il caso in cui ref sia vuoto
    return obj;
  }
  const parts: string[] = ref.split("/").slice(1);
  return parts.reduce((acc, part) => {
    return acc[part];
  }, obj);
};
