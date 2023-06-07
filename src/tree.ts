import { v4 as uuidV4 } from 'uuid';
import TreeNode from './tree-node';
import { TreeDataType } from './typings';

/**
 * @interface
 */
type TraverseFn<T> = (node: TreeNode<T>, cancel?: () => void) => void;
/**
 * @interface
 */
type PredicateFn<T> = (node: TreeNode<T>) => boolean;

interface ITreeConfig {
  valuePropName: string;
  childrenPropName: string;
}

/**
 * Tree
 */
class Tree<T = any, KV extends string = 'value', KC extends string = 'children'> {
  // 树的根节点
  public root: TreeNode<TreeDataType<T, KV, KC>>;
  // 状态标记
  public hash: string = uuidV4();

  // 值属性名
  private readonly valuePropName: string;
  // 子数组属性名
  private readonly childrenPropName: string;

  /**
   * 构造器
   * @example
   * @param config
   * @param config.valuePropName 待解析数据值属性名
   * @param config.childrenPropName 待解析数据孩子节点属性名
   *
   * new Tree();
   *
   * // 指定数据中节点的 value 和 嵌套孩子节点的属性
   * new Tree({
   *   valuePropName:'value',
   *   childrenPropName:'children'
   * });
   */
  constructor(config?: ITreeConfig) {
    this.valuePropName = config?.valuePropName || 'value';
    this.childrenPropName = config?.childrenPropName || 'children';
    // 创建根节点
    this.root = new TreeNode<TreeDataType<T, KV, KC>>('__ROOT__');
  }

  /**
   * 判断当前的树是否为空
   *
   * @example
   *
   * tree.isEmpty // 返回布尔值
   */
  get isEmpty() {
    return this.root.isLeaf;
  }

  private updateHash() {
    this.hash = uuidV4();
  }

  /**
   * 批量解析约定的树形结构数据到当前树种
   * @param data 树形结构数据(数组)
   */
  parse(data: TreeDataType<T, KV, KC>[]) {
    if (!Array.isArray(data)) return;

    this.clear();

    const nodes = data.map((data) => this.parseDataToNode(data));
    nodes.forEach((node) => this.insertChild(node, this.root));
    this.updateHash();
  }

  /**
   * 单条树形数据转换成二叉树节点
   * @param data 树形结构数据
   */
  parseDataToNode(data: TreeDataType<T, KV, KC>): TreeNode<TreeDataType<T, KV, KC>> {
    const node = new TreeNode<TreeDataType<T, KV, KC>>(data[this.valuePropName as KV], data);
    const childrenPropName = this.childrenPropName as KC;

    if (data?.[childrenPropName]?.length > 0) {
      let leftNode = this.parseDataToNode(data[childrenPropName][0]);
      node.left = leftNode;
      leftNode.parent = node;

      let cur = leftNode;

      for (let i = 1; i < data[childrenPropName].length; i++) {
        let rightNode = this.parseDataToNode(data[childrenPropName][i]);
        cur.right = rightNode;
        rightNode.parent = node;
        cur = rightNode;
      }
    }

    return node;
  }

  /**
   * 遍历所有节点
   * @param callback 回调函数
   * @param order 遍历顺序， 深度优先 or 广度优先fa
   *
   *
   * @example
   *  // 默认深度优先遍历
   *  this.traverse((node, cancel) => {
   *     console.log(node.value);
   *     console.log(node.originalData);
   *
   *     // 需要时，终止遍历
   *     if (true) {
   *       cancel();
   *     }
   *  }, 'breadth');
   */
  traverse(callback: TraverseFn<TreeDataType<T, KV, KC>>, order?: 'depth' | 'breadth') {
    const node = this.root.left;

    if (order === 'breadth') {
      this.bfs(node, callback);
    } else {
      this.dfs(node, callback);
    }
  }

  /**
   * 深度优先遍历
   * @param node
   * @param callback
   *
   * @private
   */
  private dfs(
    node: TreeNode<TreeDataType<T, KV, KC>>,
    callback: TraverseFn<TreeDataType<T, KV, KC>>,
  ) {
    let stop = false;
    const cancel = () => (stop = true);

    const _dfs = (
      node: TreeNode<TreeDataType<T, KV, KC>>,
      callback: TraverseFn<TreeDataType<T, KV, KC>>,
    ) => {
      if (!node || stop) return;

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
   * @private
   */
  private bfs(
    node: TreeNode<TreeDataType<T, KV, KC>>,
    callback: TraverseFn<TreeDataType<T, KV, KC>>,
  ) {
    if (!node) return;

    const queue = [node];
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
   * 查找并返回第一个符合条件的节点
   * @param value 节点的值或者断言函数
   *
   * @example
   *
   * const resultNode = tree.find('some value');
   * const resultNode2 = tree.find(node=>tree.depth(node) === 1);
   *
   */
  find(
    value: PredicateFn<TreeDataType<T, KV, KC>> | TreeDataType<T, KV, KC>[KV],
  ): TreeNode<TreeDataType<T, KV, KC>> | undefined {
    let targetNode: TreeNode<TreeDataType<T, KV, KC>>;

    this.traverse((node, cancel) => {
      if (
        typeof value === 'function' &&
        (value as PredicateFn<TreeDataType<T, KV, KC>>)(node) === true
      ) {
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
   * 过滤所有符合条件的节点
   * @param predicate
   */
  filter(predicate: PredicateFn<TreeDataType<T, KV, KC>>): TreeNode<TreeDataType<T, KV, KC>>[] {
    const result: TreeNode<TreeDataType<T, KV, KC>>[] = [];

    if (typeof predicate === 'function') {
      this.traverse((node) => {
        if (predicate(node) === true) {
          result.push(node);
        }
      });
    }
    return result;
  }

  /**
   * 获取指定节点对应树的深度
   * @param node
   */
  depth(node: TreeNode<TreeDataType<T, KV, KC>>): number {
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

  height(node: TreeNode<TreeDataType<T, KV, KC>>) {
    if (!node) {
      return 0;
    }

    return this.getHeight(node);
  }

  // 计算任意节点的高度
  private getHeight(node: TreeNode<TreeDataType<T, KV, KC>>): number {
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
  size(node?: TreeNode<TreeDataType<T, KV, KC>>) {
    return this.getSize(node || this.root.left);
  }

  private getSize(node: TreeNode<TreeDataType<T, KV, KC>>): number {
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
  parents(node: TreeNode<TreeDataType<T, KV, KC>>): TreeNode<TreeDataType<T, KV, KC>>[] {
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
  siblings(
    node: TreeNode<TreeDataType<T, KV, KC>>,
    pos?: 'left' | 'right' | 'all',
  ): TreeNode<TreeDataType<T, KV, KC>>[] {
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
  private leftSiblings(
    node: TreeNode<TreeDataType<T, KV, KC>>,
  ): TreeNode<TreeDataType<T, KV, KC>>[] {
    if (!node || !node.parent) return [];

    const { parent } = node;
    const rs: TreeNode<TreeDataType<T, KV, KC>>[] = [];

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
  private rightSiblings(
    node: TreeNode<TreeDataType<T, KV, KC>>,
  ): TreeNode<TreeDataType<T, KV, KC>>[] {
    if (!node) return [];

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
  isFirstChild(node: TreeNode<TreeDataType<T, KV, KC>>) {
    return node.parent.left === node;
  }

  /**
   * 在 `siblingNode` 之前插入新的 `node` 节点
   * @param node 新节点
   * @param siblingNode 兄弟节点
   */
  insertBefore(
    node: TreeNode<TreeDataType<T, KV, KC>>,
    siblingNode: TreeNode<TreeDataType<T, KV, KC>>,
  ) {
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
    this.updateHash();
  }

  /**
   * 在 `siblingNode` 之后插入新的 `node` 节点
   * @param node 新节点
   * @param siblingNode 兄弟节点
   */
  insertAfter(
    node: TreeNode<TreeDataType<T, KV, KC>>,
    siblingNode: TreeNode<TreeDataType<T, KV, KC>>,
  ) {
    // 根节点，不支持插入
    if (siblingNode.isRoot) {
      throw new Error('cannot insert a sibling node to root Node');
    }
    if (!node || !siblingNode) {
      return;
    }

    const right = siblingNode.right;
    siblingNode.right = node;
    node.parent = siblingNode.parent;

    if (right) {
      node.right = right;
    }
    this.updateHash();
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
  insertChild(
    node: TreeNode<TreeDataType<T, KV, KC>>,
    parentNode?: TreeNode<TreeDataType<T, KV, KC>>,
    pos: 'leading' | 'trailing' = 'trailing',
  ) {
    const pNode = parentNode || this.root;

    if (node) {
      const left = pNode.left;
      const children = this.children(pNode);
      node.parent = parentNode;

      if (pos === 'trailing' && children.length) {
        this.insertAfter(node, children.at(-1));
      } else {
        // insertBefore
        pNode.left = node;
        node.right = left;

        this.updateHash();
      }
    }
  }

  /**
   *  获取 `node` 的所有孩子节点
   *  @param node 节点
   */
  children(node: TreeNode<TreeDataType<T, KV, KC>>): TreeNode<TreeDataType<T, KV, KC>>[] {
    if (!node) return [];

    let child = node.left;
    const children: TreeNode<TreeDataType<T, KV, KC>>[] = [];

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
  remove(node: TreeNode<TreeDataType<T, KV, KC>>): boolean {
    if (!node || node.isRoot) {
      return false;
    }

    if (this.isFirstChild(node)) {
      node.parent.left = node.right;
    } else {
      const leftNode = this.leftSiblings(node).find((n) => n.right === node);
      if (leftNode) {
        leftNode.right = node.right;
      }
    }

    this.updateHash();

    return true;
  }

  /**
   * 清空树中的所有节点 (root 除外)
   */
  clear() {
    this.root.left = null;

    this.updateHash();
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
   *
   * // result:
   * [{ value: 1, parentValue: undefined }, { value: '1-1', parentValue: '1' }, { value: '1-1-1', parentValue: '1-1}]
   */
  flatten(
    node?: TreeNode<TreeDataType<T, KV, KC>>,
    parentPropName: string = 'parentValue',
  ): Array<
    T & {
      [key: string]: Extract<T, KV>;
    }
  > {
    const rs: any = [];

    if (!node && !this.root.left) {
      return [];
    }

    this.bfs(node || this.root, (_node) => {
      if (_node.value !== TreeNode.ROOT_VALUE) {
        rs.push({
          ..._node.originalData,
          [this.valuePropName]: _node?.value,
          [parentPropName]:
            _node?.parent?.value && _node?.parent?.value !== TreeNode.ROOT_VALUE
              ? _node?.parent?.value
              : undefined,
        });
      }
    });

    return rs;
  }

  /**
   * 将树转换成层级数据
   *
   * @example
   *
   * const tree = new Tree<{label?:string}>();
   * const node1 = new Node('1', {label:'1'});
   * const node2 = new Node('1-1', {label:'1-1'});
   *
   * tree.insertChild(node1, tree.root);
   * tree.insertChild(node2, node1);
   *
   * tree.toData();
   *
   * // result:
   * [
   *   {
   *     value: '1',
   *     originalData: { label: 1 },
   *     children: [
   *       {
   *         value: '1-1', originData: { label: '1-1' }
   *       }]
   *   }
   * ];
   *
   */
  toData(): TreeDataType<T, KV, KC>[] {
    return this.format<TreeDataType<T, KV, KC>>((node, children) => {
      return {
        [this.valuePropName]: node.value,
        [this.childrenPropName]: children,
        ...node.originalData,
      } as TreeDataType<T, KV, KC>;
    });
  }

  /**
   * 对数据进行自定义格式化输出
   * @param callback
   *
   * @example
   * tree.format>((node, children)=>{ return {
   *   _value: node.value,
   *   _children: children
   *   depth: tree.depth(node)
   * }})
   */
  format<P = any>(
    callback: (node: TreeNode<TreeDataType<T, KV, KC>>, children: P[] | undefined) => P,
  ): P[] {
    return this.children(this.root).map((node) => this._format(node, callback));
  }

  /**
   * 处理单个 node 的数据转换
   * @param node
   * @param callback
   * @private
   */
  private _format<P>(
    node: TreeNode<TreeDataType<T, KV, KC>>,
    callback: (node: TreeNode<TreeDataType<T, KV, KC>>, children: P[] | undefined) => P,
  ): P {
    const children = this.children(node).map((node) => this._format(node, callback));

    return callback(node, children.length ? children : undefined);
  }
}

export default Tree;
