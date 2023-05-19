import Tree, { TreeNode } from '../src/index';
import areas from './data/areas';

// 节点操作
describe('初始化', () => {
  const tree = new Tree();

  test('节点操作', () => {
    try {
      new TreeNode(undefined);
    } catch (e) {
      expect(e.message).toBe('illegal node value');
    }

    const node1 = new TreeNode('newNode');
    expect(node1.value).toBe('newNode');
    expect(node1.isLeaf).toBe(true);
    expect(node1.isRoot).toBe(false);

    const node3 = new TreeNode(TreeNode.ROOT_VALUE);
    expect(node3.isRoot).toBe(true);
  });

  test('转换数组', () => {
    expect(tree.size()).toBe(0);
  });

  test('判断空', () => {
    const isEmpty = tree.isEmpty;
    expect(isEmpty).toBe(true);
  });

  test('插入节点', () => {
    const errorNodes = tree.parseDataToNodes(undefined);
    expect(errorNodes.length).toBe(0);

    const nodes = tree.parseDataToNodes(areas);
    // 插入到根节点
    nodes.map((node) => tree.insertChild(node));

    expect(tree.height(tree.root)).toBe(3);
  });

  test('判断非空', () => {
    expect(tree.isEmpty).toBe(false);
  });

  test('转换数组, 得到具体值', () => {
    const arr = tree.flatten();

    expect(arr.findIndex((area: any) => area.value === '330110')).toBeGreaterThan(0);
    expect(arr.length).toBe(tree.size());
  });
});
