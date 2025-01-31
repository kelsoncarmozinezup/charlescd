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

import styled, { css } from 'styled-components';
import { Props } from '.';

const Link = styled.a<Partial<Props>>`
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  text-decoration: underline;
  color: ${({ theme }) => theme.text.link};

  ${({ isDisabled }) =>
    isDisabled &&
    css`
      background: none;
      border: none;
      cursor: default;
      opacity: 0.3;
      padding: 0;

      * {
        cursor: default;
      }
    `}
`;

export default {
  Link
};
