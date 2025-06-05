import React from 'react';
import Tabs, { Tab } from '@/components/ui/tabs/tabs';

const tabList: Tab[] = [
  { id: 'tab1', label: 'Tab 1' },
  { id: 'tab2', label: 'Tab 2' },
  { id: 'tab3', label: 'Tab 3' },
];

const TabsPage: React.FC = () => {
  return (
    <div className="p-8">
      <Tabs tabs={tabList}>
        <div>Content for Tab 1</div>
        <div>Content for Tab 2</div>
        <div>Content for Tab 3</div>
      </Tabs>
    </div>
  );
};

export default TabsPage; 