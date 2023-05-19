import Tree, { TreeNode } from '../src/index';
import areas from './data/areas';

describe('修改树', () => {
  // 大数据量初始化
  const tree = new Tree(areas);

  test('插入新孩子节点', () => {
    // 杭州市
    const node = tree.find('330100');
    const oldChildren = tree.children(node);
    tree.insertChild(new TreeNode('-1', { label: '新城市' }), node, false);
    const newChildren = tree.children(node);

    expect(newChildren[0].originalData.label).toBe('新城市');
    expect(oldChildren.length + 1).toBe(newChildren.length);
  });

  test('插入新孩子节点在后', () => {
    // 杭州市
    const node = tree.find('330100');
    tree.insertChild(new TreeNode('-2', { label: '新城市2' }), node, true);
    const newChildren = tree.children(node);

    expect(newChildren[newChildren.length - 1].originalData.label).toBe('新城市2');
  });

  test('插入节点在前', () => {
    // 宁波市
    const node = tree.find('330200');
    // 浙江省
    const parentNode = node.parent;
    const oldChildren = tree.children(parentNode);
    const newNode1 = new TreeNode('-4');

    tree.insertBefore(newNode1, node);
    const newChildren = tree.children(parentNode);
    expect(oldChildren.length + 1).toBe(newChildren.length);

    const newNode2 = new TreeNode('-3');
    tree.insertBefore(newNode2, oldChildren[0]);
    const newChildren2 = tree.children(parentNode);
    expect(newChildren2[0].value).toBe('-3');

    tree.remove(newNode1);
    tree.remove(newNode2);
  });

  test('插入节点在后', () => {
    // 宁波市
    const node = tree.find('330200');
    // 浙江省
    const parentNode = node.parent;
    const oldChildren = tree.children(parentNode);
    const newNode = new TreeNode('-3301001');
    tree.insertAfter(newNode, node);
    const newChildren = tree.children(parentNode);

    expect(oldChildren.length + 1).toBe(newChildren.length);
    tree.remove(newNode);
  });

  test('移除节点', () => {
    // 宁波市
    const node = tree.find('330200');
    // 杭州市
    const node2 = tree.find('330100');
    // 浙江省
    const parentNode = node.parent;
    const oldChildren = tree.children(parentNode);

    // 移除宁波市
    tree.remove(node);
    const newChildren = tree.children(parentNode);

    expect(oldChildren.length - 1).toBe(newChildren.length);
    expect(tree.find('330200')).toBe(undefined);
    expect(tree.find('330203')).toBe(undefined);

    // 移除杭州市 (第一个孩子节点)
    tree.remove(node2);
    const newChildren2 = tree.children(parentNode);

    expect(newChildren2[0].originalData.label).toBe('温州市');
    expect(tree.find('330101')).toBe(undefined);
    expect(tree.find('330100')).toBe(undefined);

    expect(tree.remove(tree.root)).toBe(undefined);
    expect(tree.remove(undefined)).toBe(undefined);
  });

  test('清空树', () => {
    tree.clear();
    expect(tree.size()).toBe(0);
  });
});
