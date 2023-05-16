import DataSource from '../src/index';
import streets from './data/streets';
import tree from './data/tree';

describe('基础操作', () => {
  const dsTree = new DataSource();

  test('空判断', () => {
    expect(dsTree.isEmpty()).toBe(true);
  });

  test('非空判断', () => {
    dsTree.insertChild({
      label: '1',
      value: 1,
    });
    expect(dsTree.isEmpty()).toBe(false);
  });

  // 大数据量初始化
  const ds = new DataSource(streets, { valuePropName: 'code', childrenPropName: 'children' });

  test('深度判断', () => {
    const node = ds.find('330110005');
    const depth = ds.depth(node);

    // expect(ds.find('unknown value')).toBe(undefined);
    // expect(ds.find(undefined)).toBe(undefined);

    expect(ds.depth()).toBe(0);
    expect(ds.depth(undefined)).toBe(0);

    expect(ds.depth(ds.root)).toBe(0);
    expect(depth).toBe(4);
    expect(ds.depth(ds.find('33'))).toBe(1);
  });

  test('高度判断', () => {
    // 浙江省
    const provinceNode = ds.find('33');
    // 杭州市
    const cityNode = ds.find('3301');
    // 五常街道（叶子结点）
    const areaNode = ds.find('330110005');
    const h1 = ds.height(provinceNode);
    const h2 = ds.height(cityNode);
    const h3 = ds.height(areaNode);

    expect(h1).toBe(3);
    expect(h2).toBe(2);
    expect(h3).toBe(0);

    expect(ds.height(ds.root)).toBe(0);
  });

  test('大小判断', () => {
    const ds = new DataSource([]);
    expect(ds.size()).toBe(0);

    ds.insertChild({ value: 1, label: 1 });

    expect(ds.size()).toBe(1);

    expect(new DataSource(tree).size()).toBe(20);
  });
});
