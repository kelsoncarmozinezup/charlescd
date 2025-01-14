/*
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { useState } from 'react';
import Tab, { Props as TabProps } from './Tab';
import Text from 'core/components/Text';
import Styled from './styled';
import Placeholder from './Placeholder';

type Child = Pick<TabProps, 'title'>;

export type Props = {
  children: React.ReactElement<Child>[];
};

const NavTabs = ({ children }: Props) => {
  const [activeTab, setActiveTab] = useState(0);

  const renderTitles = () => (
    <Styled.TabList>
      {children.map((child, index) => (
        <Styled.TabItem
          key={index}
          isActive={index === activeTab}
          onClick={() => setActiveTab(index)}
          data-testid={`tab-${index}`}
        >
          <Text
            tag="H4"
            weight="bold"
            color={index === activeTab ? 'light' : 'dark'}
          >
            {child.props.title}
          </Text>
        </Styled.TabItem>
      ))}
    </Styled.TabList>
  );

  const renderContent = () => children[activeTab];

  return (
    <div>
      {renderTitles()}
      {renderContent()}
    </div>
  );
};

NavTabs.Tab = Tab;
NavTabs.Placeholder = Placeholder;

export default NavTabs;
