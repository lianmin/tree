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

/**
 * 扩展的数据节点
 */
export interface ExtendedTreeDataItem<T> {
  value: T;
  children?: ExtendedTreeDataItem<T>[];
  originalData?: {
    [key: string]: any;
  };
  [key: string]: any;
}
