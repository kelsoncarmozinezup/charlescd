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

import { ReactNode, useState, useRef } from 'react';
import Icon from 'core/components/Icon';
import Text from 'core/components/Text';
import useOutsideClick from 'core/hooks/useClickOutside';
import Styled from './styled';

export const CHARLES_DOC = 'https://docs.charlescd.io';

type PopoverProps = {
  title: string;
  size?: string;
  description: string;
  link?: string;
  linkLabel?: string;
  className?: string;
};

interface WithIcon extends PopoverProps {
  icon: string;
}

interface WithChildren extends PopoverProps {
  children: ReactNode;
}

export type Props = WithIcon | WithChildren;

const Popover = (props: Props) => {
  const {
    title,
    size = '24px',
    link = CHARLES_DOC,
    linkLabel = 'View documentation',
    description,
    className,
  } = props;
  const { icon } = props as WithIcon;
  const { children } = props as WithChildren;
  const [toggle, setToggle] = useState(false);
  const ref = useRef<HTMLDivElement>();

  useOutsideClick(ref, () => {
    setToggle(false);
  });

  const renderIcon = () => (
    <Icon
      name={icon}
      color="dark"
      size={size}
      onClick={() => setToggle(!toggle)}
    />
  );

  const renderAnchor = () => (
    <Styled.Anchor onClick={() => setToggle(!toggle)}>{children}</Styled.Anchor>
  );

  return (
    <Styled.Wrapper ref={ref} className={className}>
      {icon && renderIcon()}
      {children && renderAnchor()}
      {toggle && (
        <Styled.Popover
          data-testid={`popover-${title}`}
          className="popover-container"
        >
          <Text tag="H4" color="light">
            {title}
          </Text>
          <Styled.Content>
            <Text tag="H5" color="dark">
              {description}
            </Text>
          </Styled.Content>
          <Styled.Link href={link} target="_blank">
            <Text tag="H6" color="light">
              {linkLabel}
            </Text>
          </Styled.Link>
        </Styled.Popover>
      )}
    </Styled.Wrapper>
  );
};

export default Popover;
