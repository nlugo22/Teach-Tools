import React from 'react'

interface TabProps {
    label: string,
    onClick: () => void;
    isActive: boolean,
}

const Tab = ({ label, onClick, isActive }: TabProps) => {
  return (
    <div
      onClick={onClick}
      style={{
        cursor: "pointer",
        backgroundColor: isActive ? 'lightblue' : 'lightgray',
        border: '1px solid gray',
        borderRadius: '4px',
      }}
    >
      {label}
    </div>
  );
};

interface TabsProps {
    tabs: string[],
    activeTab: number,
    onTabChange: (index: number) => void;
}

const Tabs = ({ tabs, activeTab, onTabChange } : TabsProps) => {
  return (
    <div>
        {tabs.map((tab, index) => {
          return (
            <Tab
                key={index}
                label={tab}
                onClick={() => onTabChange(index)}
                isActive={index === activeTab}
            />
          );
        })}
    </div>
  );
}

export default Tabs;