import Tree, { TreeNode } from '../src/index';
import areas from './data/areas';

describe('修改树', () => {
  // 大数据量初始化
  const tree = new Tree();
  tree.parse(areas);

  test('插入新孩子节点', () => {
    // 杭州市
    const node = tree.find('330100');
    const oldChildren = tree.children(node);
    tree.insertChild(new TreeNode('-1', { label: '新城市' }), node, 'leading');
    const newChildren = tree.children(node);

    expect(newChildren[0].originalData.label).toBe('新城市');
    expect(oldChildren.length + 1).toBe(newChildren.length);
  });

  test('插入新孩子节点在后', () => {
    // 杭州市
    const node = tree.find('330100');
    tree.insertChild(new TreeNode('-2', { label: '新城市2' }), node, 'trailing');
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

  test('叶子结点插入', () => {
    const emptyTree = new Tree();
    const pNode = new TreeNode('1', { label: '1', value: '1' });

    try {
      emptyTree.insertAfter(new TreeNode('1'), emptyTree.root);
    } catch (e) {
      expect(e.message).toMatch(/cannot/);
    }

    try {
      emptyTree.insertBefore(new TreeNode('1'), emptyTree.root);
    } catch (e) {
      expect(e.message).toMatch(/cannot/);
    }

    emptyTree.insertChild(pNode, emptyTree.root);
    expect(emptyTree.root.left.value).toBe('1');

    emptyTree.remove(pNode);

    emptyTree.insertChild(pNode, emptyTree.root, 'leading');
    expect(emptyTree.root.left.value).toBe('1');

    emptyTree.insertBefore(new TreeNode('2', { value: '2', label: '2' }), pNode);
    expect(emptyTree.root.left.value).toBe('2');
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

    expect(tree.remove(tree.root)).toBe(false);
    expect(tree.remove(undefined)).toBe(false);
  });

  test('清空树', () => {
    tree.clear();
    expect(tree.size()).toBe(0);
  });

  test('标识', () => {
    const tree1 = new Tree();
    const hash1 = tree1.hash;

    tree1.parse(areas);

    const hash2 = tree1.hash;

    expect(hash1).not.toBe(hash2);

    tree1.insertAfter(new TreeNode('-1', { value: '新节点' }), tree1.find('110000'));

    const hash3 = tree1.hash;

    expect(hash2).not.toEqual(hash3);
  });

  test('插入子节点-异常', () => {
    const newTree = new Tree();

    newTree.insertChild(new TreeNode('-1', { label: '新节点' }));

    expect(newTree.root.left.value).toBe('-1');
  });
});
