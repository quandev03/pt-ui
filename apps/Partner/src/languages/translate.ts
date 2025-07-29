import { en, vi } from "./langs";
import { AnyElement } from "@react/commons/types";
import { flattenObject } from "@react/helpers/utils";

const language: { [key: string]: AnyElement } = {
  vi: flattenObject(vi),
  en: flattenObject(en),
};

export default language;
