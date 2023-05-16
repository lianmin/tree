import DataSource from '../src/index';

describe('初始化', () => {
  const ds = new DataSource([]);

  test('转换数组', () => {
    expect(ds.size()).toBe(0);
  });

  test('判断空', () => {
    const isEmpty = ds.isEmpty();
    expect(isEmpty).toBe(true);
  });

  test('插入节点', () => {
    ds.insertChild({
      value: 1,
      label: 1,
    });

    expect(ds.size()).toBe(1);
  });

  test('判断非空', () => {
    expect(ds.isEmpty()).toBe(false);
  });

  test('转换数组, 得到具体值', () => {
    const arr = ds.flatten();
    expect(arr!.length).toBe(1);
  });
});
