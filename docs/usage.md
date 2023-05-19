---
sidebar_label: 用法
---

树的用法

```jsx preview
import { useState, useEffect } from 'react';
import Tree, { TreeNode } from '@xtree/tree';
import { areas } from './usage.js';
import { Button, Cascader } from '@alifd/next';
import { Row, Col, Cell, P, Text } from '@alifd/layout';
import useForceUpdate from 'use-force-update';

import '@alifd/next/dist/next.css';

export default function App() {
  const [tree, setTree] = useState(new Tree());
  const forceUpdate = useForceUpdate();

  return (
    <div>
      <Cell gap={16}>
        <P>
          <Button
            type="primary"
            onClick={() => {
              setTree(new Tree(areas));
              forceUpdate();
            }}
          >
            生成数据
          </Button>
        </P>
        <P>尺寸: {tree.size()}</P>
        <Text type="h6" strong>
          层级结构
        </Text>
        <Cascader
          defaultExpandedValue={['330000', '330100', '330110']}
          listStyle={{ width: '180px', height: '256px' }}
          dataSource={tree.toData()}
        />

        <P>
          <Button
            size="small"
            onClick={() => {
              const nodes = tree.parseDataToNodes([
                { value: '330110005', label: '五常街道' },
                { value: '330110009', label: '仁和街道' },
                { value: '330110010', label: '良渚街道' },
                { value: '330110011', label: '闲林街道' },
                { value: '330110012', label: '仓前街道' },
                { value: '330110013', label: '余杭街道' },
                { value: '330110014', label: '中泰街道' },
                { value: '330110109', label: '径山镇' },
                { value: '330110110', label: '瓶窑镇' },
                { value: '330110111', label: '鸬鸟镇' },
                { value: '330110112', label: '百丈镇' },
                { value: '330110113', label: '黄湖镇' },
              ]);
              const sourceNode = tree.find('330110');

              nodes.map((node) => {
                tree.insertChild(node, sourceNode);
              });

              forceUpdate();
            }}
          >
            插入第四层数据
          </Button>
        </P>

        <P>
          <Button
            type="secondary"
            onClick={() => {
              const data = tree.flatten();
              console.log(data);
            }}
          >
            打印平铺数据(console)
          </Button>
        </P>
      </Cell>
    </div>
  );
}
```
