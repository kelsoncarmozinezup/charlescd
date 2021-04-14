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

import { render, screen, waitFor } from 'unit-test/testUtils';
import { MemoryRouter } from 'react-router-dom';
import Token from '../index';
import 'unit-test/setup-msw';
import routes from 'core/constants/routes';
import { saveProfile } from 'core/utils/profile';
import userEvent from '@testing-library/user-event';
import { server, rest } from 'mocks/server';
import { DEFAULT_TEST_BASE_URL } from 'setupTests';

const originalWindow = window;

beforeAll(() => {
  saveProfile({
    id: '123',
    name: 'charles admin',
    email: 'charlesadmin@admin',
    root: true
  });

  Object.assign(window, originalWindow);
  const location = window.location;

  delete global.window.location;

  global.window.location = Object.assign({}, location);
})

test('render Token PlaceHolder', async () => {
  render(
    <MemoryRouter initialEntries={[routes.tokens]}>
      <Token />
    </MemoryRouter>
  );
  await waitFor(() => expect(screen.queryByText('TOKEN 1')).toBeInTheDocument());
  expect(screen.getByTestId('placeholder-empty-groups')).toBeInTheDocument();
});

test.only('render Token View mode', async () => {
  const tokenID = 'abd6efc4-3b98-4049-8bdb-e8919c3d09f4';

  window.location = {
    ...window.location,
    pathname: `${routes.tokensComparation}`,
    search: `?token=${tokenID}`
  };

  server.use(
    rest.post(`${DEFAULT_TEST_BASE_URL}/gate/api/v1/system-token/:token`, async (req, res, ctx) => {
      return res(ctx.json({
        "id":"abd6efc4-3b98-4049-8bdb-e8919c3d09f4",
        "name":"TOKEN 2",
        "permissions":[
          "maintenance_write",
          "deploy_write",
          "circles_read",
          "circles_write",
          "modules_read"
        ],
        "workspaces": "",
        "allWorkspaces": true,
        "revoked": false,
        "created_at": "2021-04-12T23:02:39.304307Z",
        "revoked_at": "",
        "last_used_at": "",
        "author":"charlesadmin@admin"
      }))
    }),
  );

  render(
    <MemoryRouter initialEntries={[`${routes.tokensComparation}?token=${tokenID}`]}>
      <Token />
    </MemoryRouter>
  );

  await waitFor(() => expect(screen.getByText('TOKEN 2')).toBeInTheDocument());
  expect(screen.getByText('Created by charlesadmin@admin')).toBeInTheDocument();
  expect(screen.getByText('Your token has access to all workspaces (including new ones)')).toBeInTheDocument();

  // const modules = await screen.findByTestId('modules');
  // const circles = screen.getByTestId('circles');

  // expect(modules).toHaveTextContent('ModulesAll permissions');
  // expect(circles).toHaveTextContent('CirclesRead');

  screen.debug();
});