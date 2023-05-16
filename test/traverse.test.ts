import DataSource, { Node } from '../src/index';
import areas from './data/areas';

describe('查找', () => {
  const ds = new DataSource(areas);

  test('遍历所有叶子节点', () => {
    const arr: any = [];
    ds.traverse((node) => {
      if (node.isLeaf) {
        arr.push(node);
      }
    });
    expect(arr.length).toBe(3275);
  });

  test('过滤深度为 1 的节点', () => {
    const arr = ds.filter((node: Node) => {
      return ds.depth(node) === 0;
    });
    expect(arr.length).toBe(areas.length);
  });

  test('查找', () => {
    const node1 = ds.find('350300');
    const node2 = ds.find((node: Node) => {
      return node.originalData.label === '涵江区';
    });

    expect(node1.originalData.label).toBe('莆田市');
    expect(node2.value).toBe('350303');
    expect(ds.find('unknown value')).toBe(undefined);
    expect(ds.find(undefined)).toBe(undefined);
  });

  test('获取一级节点', () => {
    const arr: any = [];

    ds.traverse((node) => {
      if (ds.depth(node) === 0) {
        arr.push(node.originalData.label);
      }
    });
    expect(arr.length).toBe(areas.length);
  });
});
