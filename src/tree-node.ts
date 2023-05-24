/**
 * 内部二叉树节点
 */
export default class TreeNode {
  static readonly ROOT_VALUE = '__ROOT__';

  /**
   * 值，需保证插入树的时候唯一性
   */
  public value: any;
  /**
   * 原始数据
   */
  public originalData: any;
  /**
   * 左子结点
   * @private
   */
  public left?: TreeNode = null;
  /**
   * 右子节点
   * @private
   */
  public right?: TreeNode = null;
  /**
   * 父节点
   * @private
   */
  public parent?: TreeNode = null;

  /**
   * 初始化节点
   * @param value 值
   * @param originalData 绑定的原始数据
   */
  constructor(value: any, originalData?: any) {
    if (!value) {
      throw new Error('illegal node value');
    }

    this.value = value;
    this.originalData = originalData;
  }

  /**
   * 是否为根节点（值是否为保留的 ROOT_VALUE ）
   */
  get isRoot() {
    return this.value === TreeNode.ROOT_VALUE;
  }

  /**
   * 是否为叶子节点
   */
  get isLeaf() {
    return !this.left;
  }
}
