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

```typescript
import Tree, { TreeNode } from '@xtree/tree';

// 初始化 Tree 配置。
const tree = new Tree<{ label: string; value: string }, 'value', 'children'>({
  valuePropName: 'value',
  childrenPropName: 'children',
});

tree.parse([
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

[查看类定义](./API.md)

### Tree

#### **constructor<T, KV, KC>**(`config`)

基础 config 构建一颗空树

`config.childrenPropName` 待传入数据的孩子节点属性名
`config.valuePropName` 待传入数据的值域属性名

```typescript
// 精简写法， 默认数据是  [{value: string; children:[...]}] 格式的
const tree1 = new Tree();
tree1.prase([
  {
    label: 'node1',
    value: '1',
    children: [
      {
        label: 'node1-1',
        value: '1-1',
      },
    ],
  },
]);

// 指定传入数据的值和孩子节点属性名
interface EmployeeData {
  id: string;
  name: string;
  employee?: EmployeeData[];
}

const tree3 = new Tree<EmployeeData, 'id', 'employee'>({
  valuePropName: 'id',
  childrenPropName: 'employees',
});

tree3.parse([
  {
    id: '1',
    name: '张三',
    employee: [
      {
        id: '2',
        name: '李四',
      },
      {
        id: '3',
        name: '王五',
      },
    ],
  },
  {
    id: '4',
    name: '赵六',
  },
]);
```

#### parse(`data`: `TreeDataType<T, KV, KC>`) 解析数据到树中

基于构造函数配置的类型，解析树形结构的数据。

#### hash

树状态的唯一标记，每次对节点进行修改后，`hash` 值会更新

#### get **isEmpty()**

判断树是否空（没有传入和插入任何数据）

```typescript
tree.isEmpty; // boolean
```

#### **size**(`node`: `TreeNode`)

返回指定 node 的节点数，若未传入，返回根节点的节点数

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

#### insertBefore(node, targetNode)

在 `targetNode` 之前插入新 `node` 节点

#### insertAfter(node, targetNode)

在 `targetNode` 之后插入新 `node` 节点

#### insertChild(node, parentNode, pos)

为 parentNode 插入子节点 node
`pos='leading'|'trailing'` 表示插入为最后一个子节点，否则出入到第一个子节点

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

返回 `TreeDataType<T,KV,KC>` 类型树形结构数据(适用于在对树的节点进行操作后，获取最新的数据)

#### format(callback: `(node, children)=>any`)

自定义格式化数据.

> 注意 `children` 参数为格式化后节点的 children 数据.

```ts
const tree = new Tree();
tree.parse([
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

// 自定义树形嵌套结构
tree.format((node, children) => {
  return {
    id: node.value,
    ...(children.length ? children : null),
    data: data.originalData,
    depth: tree.depth(node),
  };
});
```

### TreeNode

#### constructor(`value`, `originalData`)

创建树节点

```jsx
import { TreeNode } from '@xtree/tree';

const node = new TreeNode('node1', {});

node.isRoot; // 判定是否为 node.value === TreeNode.ROOT_VALUE
node.isLeaf; // 判定节点是否为叶子结点
node.originalData; // 获取节点绑定的原始数据
```
