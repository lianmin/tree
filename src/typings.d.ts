/// <reference types="@ice/pkg/types" />

export type ValueType = string | number | '__ROOT__';

/**
 * 基础的数据格式， T=data 基础数据类型， VK-值属性名，CK - 孩子节点属性名
 */
export type TreeDataType<T, VK extends string, CK extends string> = T &
  Record<VK, ValueType> & {
    [K in CK]?: TreeDataType<T, VK, CK>[];
  };
