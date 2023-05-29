/// <reference types="@ice/pkg/types" />

// 高阶定义的 TreeDataItem
export interface TreeDataItem {
  value: any;
  children?: TreeDataItem[];
  [key: string]: any;
}

/**
 * @interface
 */
export type TreeData = TreeDataItem[];

export type ExtendTreeDataItem<T> = T & {
  value: T;
  children?: ExtendTreeDataItem<T>[];
  originalData?: {
    [key: string]: any;
  };
  [key: string]: any;
};
