## API Report File for "@xtree/tree"

```ts
import { ExtendTreeDataItem } from './typings';
import { TreeData } from './typings';
import { TreeDataItem } from './typings';

// @public
class Tree {
  constructor(initData?: TreeData);
  children(node: TreeNode): TreeNode[];
  clear(): void;
  depth(node: TreeNode): number;
  filter(predicate: PredicateFn): TreeNode[];
  find(value: PredicateFn | any): TreeNode | undefined;
  flatten(node?: TreeNode, parentPropName?: string): any;
  format<T = any>(callback: (data: ExtendTreeDataItem<any>) => T): T[];
  height(node: TreeNode): number;
  insertAfter(node: TreeNode, siblingNode: TreeNode): void;
  insertBefore(node: TreeNode, siblingNode: TreeNode): void;
  insertChild(node: TreeNode, parentNode: TreeNode, pos?: 'leading' | 'trailing'): void;
  get isEmpty(): boolean;
  isFirstChild(node: TreeNode): boolean;
  parents(node: TreeNode): TreeNode[];
  parseDataToNode(data: TreeDataItem): TreeNode;
  parseDataToNodes(data: TreeData): TreeNode[];
  remove(node: TreeNode): void;
  root: TreeNode;
  siblings(node: TreeNode, pos?: 'left' | 'right' | 'all'): TreeNode[];
  size(node?: TreeNode): number;
  toData(): ExtendTreeDataItem<any>[];
  traverse(callback: TraverseFn, first?: 'depth' | 'breadth'): void;
}
export default Tree;

export { TreeData };

export { TreeDataItem };

// @public
export class TreeNode {
  constructor(value: any, originalData?: any);
  get isLeaf(): boolean;
  get isRoot(): boolean;
  left?: TreeNode;
  originalData: any;
  parent?: TreeNode;
  right?: TreeNode;
  static readonly ROOT_VALUE = '__ROOT__';
  value: any;
}
```
