/**
 * 内部二叉树节点
 */
class TreeNode {
    static ROOT_VALUE = '__ROOT__';
    /**
     * 值，需保证插入树的时候唯一性
     */
    value;
    /**
     * 原始数据
     */
    originalData;
    /**
     * 左子结点
     * @private
     */
    left = null;
    /**
     * 右子节点
     * @private
     */
    right = null;
    /**
     * 父节点
     * @private
     */
    parent = null;
    /**
     * 初始化节点
     * @param value 值
     * @param originalData 绑定的原始数据
     */
    constructor(value, originalData) {
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
export default TreeNode;
