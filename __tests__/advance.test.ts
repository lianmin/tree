import Tree, { TreeNode } from '../src/index';
import areas from './data/areas';
import treeData from './data/tree-data';
import { expect } from '@jest/globals';

describe('高阶用法', () => {
  const tree = new Tree(areas);

  test('查找任意节点', () => {
    const node = tree.find('110102');
    expect(node!.originalData!.label).toBe('西城区');
  });

  test('查找任意节点-fn', () => {
    const node = tree.find((node: TreeNode) => {
      return node.originalData.label === '西城区';
    });
    expect(node!.originalData!.label).toBe('西城区');
  });

  test('获取父级节点', () => {
    const node = tree.find('110102');
    const parents = tree.parents(node);

    expect(parents[0].value).toBe('110100');
    expect(parents[1].value).toBe('110000');
    expect(parents[2].value).toBe(TreeNode.ROOT_VALUE);

    expect(tree.parents(tree.root)).toHaveLength(0);
    expect(tree.parents(undefined)).toHaveLength(0);
    expect(tree.parents(tree.root.left)).toHaveLength(1);
  });

  test('深度', () => {
    // 叶子节点
    const node = tree.find('330110');
    const depth = tree.depth(node);

    expect(tree.depth(new TreeNode('new Node'))).toBe(0);
    expect(tree.depth(undefined)).toBe(0);

    // 树的深度
    expect(tree.depth(tree.root)).toBe(0);
    // 节点的深度
    expect(depth).toBe(3);
    expect(tree.depth(tree.find('330000'))).toBe(1);
  });

  test('高度', () => {
    // 浙江省
    const provinceNode = tree.find('330000');
    // 杭州市
    const cityNode = tree.find('330100');
    // 余杭区
    const areaNode = tree.find('330110');

    const h1 = tree.height(provinceNode);
    const h2 = tree.height(cityNode);
    const h3 = tree.height(areaNode);

    expect(h1).toBe(2);
    expect(h2).toBe(1);
    expect(h3).toBe(0);

    expect(tree.height(tree.root)).toBe(3);
    expect(tree.height(undefined)).toBe(0);
  });

  test('大小判断', () => {
    const tree1 = new Tree([]);

    expect(tree1.size()).toBe(0);

    tree1.insertChild(new TreeNode('nodeValue', {}), tree1.root);

    expect(tree1.size()).toBe(1);
    expect(new Tree().size()).toBe(0);
  });

  test('输出树状结构', () => {
    const tree1 = new Tree(treeData);
    const node = tree1.find('2');

    tree1.insertChild(new TreeNode('4', { label: '4' }), node.parent);
    tree1.remove(node);

    const data = tree1.toData();
    expect(data.length).toBe(3);

    tree1.clear();
    const emptyData = tree1.toData();
    expect(emptyData.length).toBe(0);
  });
});
