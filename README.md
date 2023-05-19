# @xtree/tree

![](https://img.shields.io/npm/v/@xtree/tree)
![](https://img.shields.io/codecov/c/github/lianmin/tree)
![](https://img.shields.io/github/license/lianmin/tree)

`JavaScript` 下对于树的基本操作，用于便捷处理树形数据的解析、新增、移除和查找等操作

## 安装

```bash
$ npm i @xtree/tree --save
```

## 使用示例

```jsx
import Tree, { TreeNode } from '@xtree/tree';

const tree = new Tree([
  {
    label: '1',
    value: '1',
    children: [
      {
        label: '1-1',
        value: '1-1',
      },
    ],
  },
]);

tree.size(); // 2

const node = tree.find('1-1');

console.log(node.value); // 节点的值， 1-1
console.log(node.parent); // 节点的父节点引用
console.log(node.isLeaf); // 是否为叶子节点， true
console.log(node.originalData); // 节点的原始数据, {label:'1-1', value:'1-1'}

tree.traverse((node, cancel) => {
  console.log(node.value); // '1-1'
});

tree.insertChild(new TreeNode('2', { label: '2' }), tree.root);
```

## API

```ts
class Tree {
  constructor(initData?: TreeData);
  children(node: TreeNode): TreeNode[];
  clear(): void;
  depth(node: TreeNode): number;
  filter(predicate: PredicateFn): TreeNode[];
  find(value: PredicateFn | any): TreeNode | undefined;
  flatten(node?: TreeNode, parentPropName?: string): any;
  height(node: TreeNode): number;
  insertAfter(node: TreeNode, siblingNode: TreeNode): void;
  insertBefore(node: TreeNode, siblingNode: TreeNode): void;
  insertChild(node: TreeNode, parentNode?: TreeNode, tailing?: boolean): void;
  get isEmpty(): boolean;
  isFirstChild(node: TreeNode): boolean;
  leftSiblings(node?: TreeNode): TreeNode[];
  parents(node?: TreeNode): TreeNode[];
  parseDataToNode(data: TreeDataItem): TreeNode;
  parseDataToNodes(data: TreeData): TreeNode[];
  remove(node: TreeNode): void;
  rightSiblings(node: TreeNode): TreeNode[];
  root: TreeNode;
  siblings(node?: TreeNode, pos?: 'left' | 'right' | 'all'): TreeNode[];
  size(node?: TreeNode): number;
  toData(): any;
  traverse(callback: TraverseFn, first?: 'depth' | 'breadth'): void;
}
export default Tree;

export type TreeData = TreeDataItem[];

export interface TreeDataItem {
  [key: string]: any;
  children?: TreeDataItem[];
  value: any;
}

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

### Tree

#### **constructor**(`initData`?: `TreeData`)

基于 initData 构建新的树

```jsx
const tree1 = new Tree();
const tree2 = new Tree([]);
const tree3 = new Tree([
  {
    value: '',
    children: [
      /*...*/
    ],
  },
]);
```

#### get **isEmpty()**

判断树是否空（没有传入和插入任何数据）

```typescript
tree.isEmpty; // boolean
```

#### **size**(`node`: `TreeNode`)

返回指定 node 的节点数，若为传入，默认返回根节点的节点数

#### **traverse**(`callback`: `(node, cancel)=>void`, first?: 'depth'|'breadth')

遍历树中所有结点, 可设置深度优先还是广度优先.

```typescript
const tree = new Tree([
  /*...*/
]);

tree.traverse((node, cancel) => {
  console.log(node);
  if (condition) {
    cancel();
  }
}, 'breadth');
```

#### find(value | predicate): TreeNode

查找第一个值为 value 的节点，或者 `predicate(node)===true` 的节点。
若无，返回 undefined

```typescript
const node = tree.find('330110');
const node2 = tree.find((node) => node.value === '330110');
```

#### depth(node): number

返回传入节点的深度（节点到根节点的长度）
若为根节点，返回树的高度

```typescript
tree.depth(node);
```

#### height(node): number

返回传入节点的高度（节点到叶子节点的最长边数）

```typescript
const node = tree.find('330110');

tree.height(node);
```

#### filter(predicate): TreeNode[]

过滤并返回 `predicate(node)===true` 的所有节点

```typescript
// 返回树中深度为 1 的所有节点
const matchedNodes = tree.filter((node) => tree.depth(node) === 1);
```

#### parents(node)

返回 node 的所有父级节点（忽略根节点）

```typescript
tree.parents(node);
```

#### children(node)

返回 node 的所有子节点

#### siblings(node,pos='left'|'right'|'all')

获取指定 node 的兄弟节点，pos 可以指定为 `左兄弟节点|右兄弟节点|所有兄弟节点`

#### leftSiblings(node)

等价于 `tree.siblings(node, 'left')`

#### rightSiblings(node)

等价于 `tree.siblings(node, 'right')`

#### insertBefore(node, targetNode)

在 `targetNode` 之前插入新 `node` 节点

#### insertAfter(node, targetNode)

在 `targetNode` 之后插入新 `node` 节点

#### insertChild(node, parentNode, tailing=true)

为 parentNode 插入子节点 node
tailing=true 表示插入为最后一个子节点，否则出入到第一个子节点

#### remove(node)

从树中移除 node

#### clear()

清空树中所有结点

#### flatten(node, parentValuePropName = 'parentValue')

将 node 的数据打平返回

```typescript
const tree = new Tree([
  {
    value: '1',
    children: [
      {
        value: '1-1',
        children: [
          {
            value: '1-1-1',
          },
        ],
      },
    ],
  },
]);

const arr = tree.flatten(tree.root);
// arr: [{value:1, parentValue: undefined},{value: '1-1', parentValue:'1'},{value:'1-1-1', parentValue:'1-1}]
```

#### toData()

返回 `TreeData` 类型嵌套数据

### TreeNode

#### constructor(`value`, `originalData`?)

创建树节点

```jsx
import { TreeNode } from '@xtree/tree';

const node = new TreeNode('node1', {});

node.isRoot; // 判定是否为 node.value === TreeNode.ROOT_VALUE
node.isLeaf; // 判定节点是否为叶子结点
node.originalData; // 获取节点绑定的 originalData 数据
```
