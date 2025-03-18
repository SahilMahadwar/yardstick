import { clsx, type ClassValue } from "clsx";
import { Document } from "mongoose";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toPlainObject<T>(doc: Document | null): T | null;
export function toPlainObject<T>(doc: Document[]): T[];
export function toPlainObject<T>(
  doc: Document | Document[] | null
): T | T[] | null {
  if (!doc) return null;

  if (Array.isArray(doc)) {
    return doc.map((d) => JSON.parse(JSON.stringify(d.toObject())));
  }

  return JSON.parse(JSON.stringify(doc.toObject()));
}
