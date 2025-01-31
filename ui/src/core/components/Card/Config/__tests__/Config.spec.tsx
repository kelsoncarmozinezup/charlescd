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


import React from 'react';
import { render, waitFor } from 'unit-test/testUtils';
import userEvent from '@testing-library/user-event';
import CardConfig from '../';


const props = {
  icon: 'git',
  description: 'description'
}

test('render CardConfig default component', async () => {
	const click = jest.fn();
  const props = {
    icon: 'git',
    description: 'description'
  }

  const { getByText, queryByTestId } = render(
    <CardConfig
      icon={props.icon}
      description={props.description}
      onClose={click}
    />
  );

  const btnAction = queryByTestId('icon-cancel');

  expect(queryByTestId(`icon-${props.icon}`)).toBeInTheDocument();
  expect(getByText(props.description)).toBeInTheDocument();

	expect(btnAction).toBeInTheDocument();
	userEvent.click(btnAction);
	await waitFor(() => expect(click).toBeCalled());
});


test('render CardConfig default component with dropdown actions', async () => {
	const click = jest.fn();

  const { getByText, queryByTestId } = render(
    <CardConfig
      icon={props.icon}
      description={props.description}
      actions={<></>}
      onClick={click}
    />
  );

  const btnAction = queryByTestId('icon-cancel');

  expect(queryByTestId(`icon-${props.icon}`)).toBeInTheDocument();
  expect(getByText(props.description)).toBeInTheDocument();

	expect(btnAction).not.toBeInTheDocument();
});
