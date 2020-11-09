import compact from "lodash/compact";

export function classes(...args: any[]) {
  return compact([...args]).join(" ");
}
