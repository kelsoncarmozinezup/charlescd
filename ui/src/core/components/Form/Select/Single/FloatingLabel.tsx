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

import React, { ReactElement } from 'react';
import { components, OptionTypeBase, ValueContainerProps } from 'react-select';

const { Placeholder } = components;

const FloatingLabel = ({
  children,
  ...props
}: ValueContainerProps<OptionTypeBase, false>) => (
  <components.ValueContainer {...props}>
    <Placeholder {...props} innerProps={null} isDisabled={false} isFocused={false}>
      {props.selectProps.placeholder}
    </Placeholder>
    {React.Children.map(children as ReactElement[], child => {
      return child && child.type !== Placeholder ? child : null;
    })}
  </components.ValueContainer>
);

export default FloatingLabel;
