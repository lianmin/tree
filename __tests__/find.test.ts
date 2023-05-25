import Tree, { TreeNode } from '../src/index';
import areas from './data/areas';
import treeData from './data/tree-data';

describe('查找与过滤', () => {
  const tree = new Tree(areas);

  test('遍历所有叶子节点', () => {
    const arr: any = [];
    tree.traverse((node) => {
      if (node.isLeaf) {
        arr.push(node);
      }
    });
    expect(arr.length).toBe(3275);
  });

  test('遍历一级节点', () => {
    const arr: any = [];

    tree.traverse((node) => {
      if (tree.depth(node) === 1) {
        arr.push(node.originalData.label);
      }
    });
    expect(arr.length).toBe(areas.length);
  });

  test('遍历顺序', () => {
    const tree1 = new Tree(treeData);
    const arr1: string[] = [];
    const arr2: string[] = [];

    tree1.traverse((node) => {
      arr1.push(node.value);
    }, 'depth');

    tree1.traverse((node) => {
      arr2.push(node.value);
    }, 'breadth');

    expect(arr1.length).toBe(tree1.size());
    expect(arr2.length).toBe(tree1.size());
  });

  test('遍历终止', () => {
    const tree1 = new Tree(treeData);
    let counter1 = 0;
    let counter2 = 0;

    tree1.traverse((node, cancel) => {
      if (node.value === '1-1') {
        cancel();
      }
      counter1++;
    });

    tree1.traverse((node, cancel) => {
      if (node.value === '1-1') {
        cancel();
      }
      counter2++;
    }, 'breadth');

    expect(counter1).not.toBe(tree1.size());
    expect(counter2).not.toBe(tree1.size());
  });

  test('过滤深度为 1 的节点', () => {
    const arr = tree.filter((node: TreeNode) => tree.depth(node) === 1);
    expect(arr.length).toBe(areas.length);
  });

  test('查找', () => {
    // 福建省莆田市
    const node1 = tree.find('350300');
    const node2 = tree.find((node: TreeNode) => {
      return node.originalData.label === '涵江区';
    });

    expect(node1.originalData.label).toBe('莆田市');
    expect(node2.value).toBe('350303');
    expect(tree.find('unknown value')).toBe(undefined);
    expect(tree.find(undefined)).toBe(undefined);
  });

  test('祖先节点', () => {
    // 浙江省, 宁波市，江北区
    const node = tree.find('330205');
    const parents = tree.parents(node);

    expect(
      parents
        .reverse()
        .map((node) => node.originalData.label)
        .join(''),
    ).toBe('浙江省宁波市');
    expect(tree.parents(new TreeNode('newNodeVal')).length).toBe(0);
    expect(tree.parents(tree.root).length).toBe(0);
  });

  //  左右兄弟节点 & node.isRoot node.isLeaf 的判断
  // tree.length, tree.size  tree.depth tree.height;

  test('兄弟节点', () => {
    // 浙江省宁波市
    const node = tree.find('330200');
    const siblings = tree.siblings(node);
    const leftSiblings = tree.siblings(node, 'left');
    const rightSiblings = tree.siblings(node, 'right');

    const leftCities = ['杭州市'];
    const rightCities = [
      '温州市',
      '嘉兴市',
      '湖州市',
      '绍兴市',
      '金华市',
      '衢州市',
      '舟山市',
      '台州市',
    ];

    expect(tree.siblings(undefined).length).toBe(0);
    expect(tree.siblings(tree.root).length).toBe(0);
    expect(siblings.map((node) => node.originalData.label).join('')).toBe(
      [...leftCities, ...rightCities].join(''),
    );
    expect(leftSiblings.map((node) => node.originalData.label).join('')).toBe(leftCities.join(''));
    expect(rightSiblings.map((node) => node.originalData.label).join('')).toBe(
      rightCities.join(''),
    );
  });

  test('孩子节点', () => {
    // 浙江省宁波市
    const node = tree.find('330200');
    const children = tree.children(node);

    expect(tree.children(undefined).length).toBe(0);
    expect(tree.children(new TreeNode('singleNode')).length).toBe(0);
    expect(children.length).toBe(11);

    tree.insertAfter(new TreeNode('-1', { label: '新城市' }), children[0]);

    const newChildren = tree.children(node);

    expect(newChildren[1].originalData.label).toBe('新城市');
  });
});
