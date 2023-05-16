import { IDataItem } from '@xtree/data-source';

// 二叉树节点
export default class Node {
  static readonly ROOT_VALUE: '__ROOT__';
  // 值
  public value: any;
  // 原始数据
  public originalData: any;
  public left?: Node = null;
  public right?: Node = null;
  public parent?: Node = null;

  /**
   * value
   * @param data
   * @param valuePropName
   */
  constructor(data: IDataItem, valuePropName = 'value') {
    const val = data[valuePropName];

    if (!val) return null;

    this.value = val;
    this.originalData = data;
  }

  /**
   * 是否为根节点（__ROOT__ 为保留的 value 值）
   */
  get isRoot() {
    return this.value === Node.ROOT_VALUE;
  }

  /**
   * 是否为叶子节点
   */
  get isLeaf() {
    return !this.left;
  }
}
