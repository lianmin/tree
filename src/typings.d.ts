/// <reference types="@ice/pkg/types" />

/**
 * @interface
 */
export interface TreeDataItem {
  value: any;
  children?: TreeDataItem[];
  [key: string]: any;
}

/**
 * @interface
 */
export type TreeData = TreeDataItem[];
