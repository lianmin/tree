import Node from './node';
import { IDataSource, IDataItem } from './typings';

interface DataSourceConfig {
  /**
   * 自定义的 value 属性名
   */
  valuePropName?: string;
  /**
   * 自定义的孩子节点属性名
   */
  childrenPropName?: string;
}

type CompareCallbackType = (node: Node) => boolean;
type TraverseCallbackType = (node: Node) => void;

export default class DataSource {
  private readonly valuePropName: string;
  private readonly childrenPropName: string;

  public root;

  constructor(data: any[] = [], config?: DataSourceConfig) {
    this.valuePropName = config?.valuePropName || 'value';
    this.childrenPropName = config?.childrenPropName || 'children';

    // 根节点
    this.root = this.parseToBinaryTree({
      value: Node.ROOT_VALUE,
      children: Array.isArray(data) ? data : [],
    });
  }

  // 树形数据转换成二叉树
  private parseToBinaryTree(root: IDataItem) {
    if (!root) {
      return null;
    }

    const node = new Node(root, this.valuePropName);

    if (root?.[this.childrenPropName]?.length > 0) {
      let leftNode = this.parseToBinaryTree(root[this.childrenPropName][0]);
      node.left = leftNode;
      leftNode.parent = node;

      let cur = leftNode;

      for (let i = 1; i < root[this.childrenPropName].length; i++) {
        let rightNode = (cur.right = this.parseToBinaryTree(root[this.childrenPropName][i]));
        rightNode.parent = node;
        cur = rightNode;
      }
    }

    return node;
  }

  /**
   * 遍历所有节点
   * @param callback
   * @param type
   */
  traverse(callback: TraverseCallbackType, type?: 'pre' | 'post' | 'level') {
    this.preOrder(this.root.left, callback);
  }

  private preOrder(node?: Node, callback?: TraverseCallbackType) {
    if (!node) {
      return;
    }

    callback?.(node);

    if (node.left) {
      this.preOrder(node.left, callback);
    }

    if (node.right) {
      this.preOrder(node.right, callback);
    }
  }

  /**
   * 查找
   * @param value
   */
  find(value: CompareCallbackType | any): Node | undefined {
    let rs;

    this.traverse((node) => {
      if (typeof value === 'function' && value(node) === true) {
        rs = node;
      } else if (node.value === value) {
        rs = node;
      }
    });
    return rs;
  }

  /**
   * 过滤指定项目
   * @param callback
   */
  filter(callback: CompareCallbackType): Node[] {
    const rs: Node[] = [];
    if (typeof callback === 'function') {
      this.traverse((node) => {
        if (callback(node) === true) {
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
  depth(node?: Node): number {
    if (!node) {
      return 0;
    }
    let depth = 0;
    let tmp = node;
    while (tmp.parent && !tmp.parent.isRoot) {
      depth++;
      tmp = tmp.parent;
    }
    return depth;
  }

  // 获取指定节点的树的高度
  height(node?: Node) {
    return this.getHeight(node || this.root.left);
  }

  // 计算任意节点的高度
  private getHeight(node: Node): number {
    if (!node) {
      return -1;
    }

    if (node.isRoot) {
      return 0;
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
  size(node?: Node) {
    return this.getSize(node || this.root.left);
  }
  private getSize(node: Node): number {
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
  parents(node?: Node): Node[] {
    if (!node) {
      return [];
    }
    const parents = [];
    let n = node;

    while (n.parent && !n.isRoot) {
      parents.push(n.parent);
      n = n.parent;
    }
    return parents;
  }

  /**
   * 判断当前的数据是否为空
   */
  isEmpty() {
    return !this.root.left;
  }

  /**
   * 获取指定节点的兄弟节点
   * @param node
   * @param type
   */
  siblings(node?: Node, type?: 'left' | 'right' | 'all'): Node[] {
    if (!node) {
      return [];
    }

    switch (type) {
      case 'left':
        return this.leftSiblings(node);
      case 'right':
        return this.rightSiblings(node);
      default:
        return [...this.leftSiblings(node), ...this.rightSiblings(node)];
    }
  }

  /**
   * 获取左兄弟节点
   * @param node
   */
  leftSiblings(node?: Node): Node[] {
    if (!node) {
      return null;
    }
    const parent = node.parent;
    const rs: Node[] = [];

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
   * 获取指定节点的右兄弟节点
   * @param node
   */
  rightSiblings(node: Node): Node[] {
    if (!node) {
      return [];
    }
    const rs = [];
    let tmp = node;

    while (tmp.right && tmp.right.value !== node.value) {
      rs.push(tmp);
      tmp = tmp.right;
    }
    return rs;
  }

  /**
   * 是否为第一个子节点
   * @param node
   */
  isFirstChild(node: Node) {
    return node.parent.left === node;
  }

  /**
   * 在指定节点之前插入节点
   * @param node
   * @param siblingNode
   */
  insertBefore(node: Node, siblingNode: Node) {
    const leftNode = this.siblings(siblingNode).find((node) => node.right === siblingNode);

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
   * 在指定节点之后，插入节点
   * @param node
   * @param siblingNode
   */
  insertAfter(node: Node, siblingNode: Node) {
    const r = siblingNode.right;
    siblingNode.right = node;

    if (r) {
      node.right = r;
    }
  }

  /**
   * 插入节点到指定的子节点
   * @param data
   * @param parentNode
   */
  insertChild(data: IDataItem | IDataSource, parentNode?: Node) {
    const pNode = parentNode || this.root;
    let node;

    if (Array.isArray(data)) {
      node = this.parseToBinaryTree({
        value: -1,
        children: data,
      }).left;
    } else {
      node = this.parseToBinaryTree(data);
    }

    if (node) {
      this._insertChild(node, pNode);
    }
  }

  /**
   * 插入 node 到第一个子节点之前
   * @param node
   * @param parentNode
   * @private
   */
  private _insertChild(node: Node, parentNode: Node) {
    const t = parentNode.left;

    parentNode.left = node;
    node.right = t;
  }

  /**
   * 移除
   * @param node
   */
  remove(node: Node) {
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
   * 所有节点打平，返回单层数组
   * @param node
   * @param parentPropName
   */
  flatten(node?: Node, parentPropName = 'pValue') {
    const rs: any = [];
    const n = node || this.root.left;

    this.preOrder(n, (node) => {
      rs.push({
        ...n.originalData,
        [this.valuePropName]: node?.value || undefined,
        [parentPropName]: n?.parent?.value || undefined,
      });
    });

    return rs;
  }
}
