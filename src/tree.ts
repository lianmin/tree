import TreeNode from './tree-node';
import { TreeData, TreeDataItem } from './typings';

/**
 * @interface
 */
type TraverseFn = (node: TreeNode, cancel?: () => void) => void;
/**
 * @interface
 */
type PredicateFn = (node: TreeNode) => boolean;

/**
 * Tree
 */
class Tree {
  // 树的根节点
  public root: TreeNode;

  /**
   * 判断当前的数据是否为空
   *
   * @example
   *
   * tree.isEmpty // 返回布尔值
   */
  get isEmpty() {
    return !this.root.left;
  }

  /**
   * 构造器
   * @param initData 初始树形结构数据
   * @example
   *
   * new Tree();
   * new Tree([]);
   * new Tree({
   *    value: '1',
   *    children: []
   * })
   * new Tree([{
   *  value:'1',
   *  children:[{
   *    value:'1-1'
   *  }]
   * }])
   */
  constructor(initData?: TreeData) {
    // 创建根节点
    if (Array.isArray(initData)) {
      this.root = this.parseDataToNode({
        value: TreeNode.ROOT_VALUE,
        children: initData,
      });
    } else {
      this.root = new TreeNode(TreeNode.ROOT_VALUE, undefined);
    }
  }

  /**
   * 批量转换数组为节点
   * @param data 树形结构数据(数组)
   */
  parseDataToNodes(data: TreeData): TreeNode[] {
    if (!Array.isArray(data)) {
      return [];
    }

    return data.map((data) => this.parseDataToNode(data));
  }

  /**
   * 树形数据转换成二叉树
   * @param data 树形结构数据
   */
  parseDataToNode(data: TreeDataItem): TreeNode {
    const node = new TreeNode(data.value, data);

    if (data.children?.length > 0) {
      let leftNode = this.parseDataToNode(data.children[0]);
      node.left = leftNode;
      leftNode.parent = node;

      let cur = leftNode;

      for (let i = 1; i < data.children.length; i++) {
        let rightNode = this.parseDataToNode(data.children[i]);
        cur.right = rightNode;
        rightNode.parent = node;
        cur = rightNode;
      }
    }

    return node;
  }

  /**
   * 遍历所有节点
   * @param callback
   * @param first
   *
   *
   * @example
   *  // 默认深度优先遍历
   *  this.traverse((node,cancel)=>{
   *      console.log(node.value);
   *
   *      // 需要时，终止遍历
   *      if(true){
   *          cancel()
   *      }
   *  }, 'depth')
   */
  traverse(callback: TraverseFn, first?: 'depth' | 'breadth') {
    const node = this.root.left;

    if (first === 'breadth') {
      this.bfs(node, callback);
    } else {
      this.dfs(node, callback);
    }
  }

  /**
   * 深度优先遍历
   * @param node
   * @param callback
   * @private
   */
  private dfs(node: TreeNode, callback: TraverseFn) {
    let stop = false;
    let cancel = () => {
      stop = true;
    };

    const _dfs = (node: TreeNode, callback: TraverseFn) => {
      if (stop) {
        return;
      }

      // 先序遍历
      if (node.left) {
        _dfs(node.left, callback);
      }

      callback(node, cancel);

      if (node.right) {
        _dfs(node.right, callback);
      }
    };

    _dfs(node, callback);
  }

  /**
   * 广度优先遍历（广度优先算法）
   * @param node 节点
   * @param callback
   */
  private bfs(node: TreeNode, callback: TraverseFn) {
    const queue = [this.root.left];
    let stop = false;
    const cancel = () => (stop = true);

    while (!stop && queue.length) {
      const node = queue.shift();
      callback(node, cancel);

      if (node.right) {
        queue.push(node.right);
      }
      if (node.left) {
        queue.push(node.left);
      }
    }
  }

  /**
   * 查找并返回第一个服务条件的节点
   * @param value
   */
  find(value: PredicateFn | any): TreeNode | undefined {
    let targetNode: TreeNode;

    this.traverse((node, cancel) => {
      if (typeof value === 'function' && value(node) === true) {
        targetNode = node;
      } else if (node.value === value) {
        targetNode = node;
      }
      if (targetNode) {
        cancel();
      }
    });
    return targetNode;
  }

  /**
   * 过滤指定项目 (查找所有满足条件的值)
   * @param predicate
   */
  filter(predicate: PredicateFn): TreeNode[] {
    const rs: TreeNode[] = [];
    if (typeof predicate === 'function') {
      this.traverse((node) => {
        if (predicate(node) === true) {
          rs.push(node);
        }
      });
    }
    return rs;
  }

  /**
   * 获取指定节点对应树的深度
   * @param node
   */
  depth(node: TreeNode): number {
    if (!node) {
      return 0;
    }

    let depth = 0;
    let tmp = node;

    while (tmp.parent && !tmp.isRoot) {
      depth++;
      tmp = tmp.parent;
    }

    return depth;
  }

  /**
   * 获取指定节点的树的高度
   */

  height(node: TreeNode) {
    if (!node) {
      return 0;
    }

    return this.getHeight(node);
  }

  // 计算任意节点的高度
  private getHeight(node: TreeNode): number {
    if (!node) {
      // 递归的终止逻辑
      return -1;
    }

    const leftDepth = this.getHeight(node?.left);
    const rightDepth = this.getHeight(node.right);

    const l = leftDepth >= 0 ? leftDepth + 1 : 0;

    return Math.max(l, rightDepth);
  }

  /**
   * 获取树的尺寸
   * @param node
   */
  size(node?: TreeNode) {
    return this.getSize(node || this.root.left);
  }

  private getSize(node: TreeNode): number {
    if (node == null) {
      return 0;
    } else {
      return this.getSize(node.left) + 1 + this.getSize(node.right);
    }
  }

  /**
   * 获取父级节点数组
   * @param node
   */
  parents(node: TreeNode): TreeNode[] {
    if (!node || node.isRoot) return [];

    const parents = [];
    let n = node;

    while (n.parent && !n.isRoot) {
      parents.push(n.parent);
      n = n.parent;
    }

    return parents;
  }

  /**
   * 获取指定节点的兄弟节点
   * @param node 节点
   * @param pos 指定兄弟节点的位置，`左兄弟节点|右兄弟节点|所有兄弟节点`
   */
  siblings(node: TreeNode, pos?: 'left' | 'right' | 'all'): TreeNode[] {
    if (!node) return [];

    switch (pos) {
      case 'left':
        return this.leftSiblings(node);
      case 'right':
        return this.rightSiblings(node);
      default:
        return [...this.leftSiblings(node), ...this.rightSiblings(node)];
    }
  }

  /**
   * 获取左兄弟节点, 等价于 `this.siblings(node,'left')`
   * @param node 节点
   */
  private leftSiblings(node: TreeNode): TreeNode[] {
    if (!node || !node.parent) return [];

    const { parent } = node;
    const rs: TreeNode[] = [];

    if (parent.left.value === node.value) {
      return rs;
    } else {
      rs.push(parent.left);
    }

    let tmp = parent.left;

    while (tmp.right && tmp.right.value !== node.value) {
      rs.push(tmp.right);
      tmp = tmp.right;
    }
    return rs;
  }

  /**
   * 获取指定节点的右兄弟节点，等价于 `this.siblings(node,'right')`
   * @param node 节点
   */
  private rightSiblings(node: TreeNode): TreeNode[] {
    if (!node) {
      return [];
    }

    const rs = [];

    let tmp = node.right;

    while (tmp && tmp.value !== node.value) {
      rs.push(tmp);
      tmp = tmp.right;
    }
    return rs;
  }

  /**
   * 判定 `node` 是否为第一个子节点
   * @param node 节点
   */
  isFirstChild(node: TreeNode) {
    return node.parent.left === node;
  }

  /**
   * 在 `siblingNode` 之前插入新的 `node` 节点
   * @param node 新节点
   * @param siblingNode 兄弟节点
   */
  insertBefore(node: TreeNode, siblingNode: TreeNode) {
    // 根节点，不支持插入
    if (siblingNode.isRoot) {
      throw new Error('cannot insert a sibling node to root Node');
    }
    const leftNode = this.siblings(siblingNode).find((node) => node.right === siblingNode);

    node.parent = siblingNode.parent;

    if (leftNode) {
      leftNode.right = node;
      node.right = siblingNode;
    } else {
      // is firstChild
      const t = siblingNode.parent.left;
      siblingNode.parent.left = node;
      node.right = t;
    }
  }

  /**
   * 在 `siblingNode` 之后插入新的 `node` 节点
   * @param node 新节点
   * @param siblingNode 兄弟节点
   */
  insertAfter(node: TreeNode, siblingNode: TreeNode) {
    // 跟节点，不支持插入
    if (siblingNode.isRoot) {
      throw new Error('cannot insert a sibling node to root Node');
    }

    const right = siblingNode.right;
    siblingNode.right = node;
    node.parent = siblingNode.parent;

    if (right) {
      node.right = right;
    }
  }

  /**
   * 为 `parentNode` 插入新的子节点 `node`
   *
   * @param node 新节点
   * @param parentNode 父节点
   * @param pos 插入到子节点位置，默认为从尾部插入，如果要从头部插入，可以设置 pos='leading'
   *
   * @example
   *
   * tree.insertChild(node, parentNode);
   * tree.insertChild(node, parentNode, 'leading');
   *
   */
  insertChild(node: TreeNode, parentNode: TreeNode, pos: 'leading' | 'trailing' = 'trailing') {
    const pNode = parentNode || this.root;

    if (node) {
      const left = pNode.left;
      const children = this.children(pNode);
      node.parent = parentNode;

      if (pos === 'trailing' && children.length) {
        this.insertAfter(node, children.at(-1));
      } else {
        pNode.left = node;
        node.right = left;
      }
    }
  }

  /**
   *  获取 `node` 的所有孩子节点
   *  @param node 节点
   */
  children(node: TreeNode): TreeNode[] {
    if (!node) {
      return [];
    }

    let child = node.left;
    const children: TreeNode[] = [];

    while (child) {
      children.push(child);
      child = child.right;
    }
    return children;
  }

  /**
   * 从树中移除 `node` 节点
   * @param node 节点
   */
  remove(node: TreeNode) {
    if (!node || node.isRoot) {
      return;
    }

    if (this.isFirstChild(node)) {
      node.parent.left = node.right;
    } else {
      const leftNode = this.leftSiblings(node).find((n) => n.right === node);
      if (leftNode) {
        leftNode.right = node.right;
      }
    }
  }

  /**
   * 清空树中的所有节点 (root 除外)
   */
  clear() {
    this.root.left = null;
  }

  /**
   * 所有节点打平，返回单层数组
   *
   * @param node 节点
   * @param parentPropName 父级节点 value 的属性名
   * @example
   *
   * const tree = new Tree([
   *   {
   *     value: '1',
   *     children: [
   *       {
   *         value: '1-1',
   *         children: [
   *           {
   *             value: '1-1-1',
   *           },
   *         ],
   *       },
   *     ],
   *   },
   * ]);
   *
   * const arr = tree.flatten(tree.root);
   * // result: [{value:1, parentValue: undefined},{value: '1-1', parentValue:'1'},{value:'1-1-1', parentValue:'1-1}]
   */
  flatten(node?: TreeNode, parentPropName: string = 'parentValue') {
    const rs: any = [];

    this.bfs(node || this.root, (_node) => {
      rs.push({
        ..._node.originalData,
        value: _node?.value || undefined,
        [parentPropName]: _node?.parent?.value || undefined,
      });
    });

    return rs;
  }

  /**
   * 将树转换成层级数据
   *
   * @example
   *
   * const tree = new Tree();
   * const node1 = new Node('1', {label:'1'});
   * const node2 = new Node('1-1', {label:'1-1'});
   *
   * tree.insertChild(node1, tree.root);
   * tree.insertChild(node2, node1);
   *
   *
   * tree.toData();
   * // [{label:'1',value:'1',parentValue: undefined}, {label:'1-1', value:'1-1', parentValue:'1'}]
   *
   */
  toData() {
    const n = this._toData(this.root);

    return n?.children || [];
  }

  /**
   * 单个节点还原成层级结构数据
   * @param node
   * @private
   */
  private _toData(node: TreeNode): TreeDataItem {
    const value = node.value;
    const children = this.children(node).map((node) => this._toData(node));

    return {
      value,
      ...(children?.length ? { children } : null),
      ...(node.originalData ? { originalData: node.originalData } : null),
    };
  }
}

export default Tree;
