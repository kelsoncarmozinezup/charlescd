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

import { ReactElement } from "react";
import { render, waitFor, screen, act } from "@testing-library/react";
import FormModule from "../";
import * as UpdateModuleHook from '../../../hooks/module';
import { Component as ComponentInterface } from "modules/Modules/interfaces/Component";
import { AllTheProviders } from "unit-test/testUtils";
import { Module, Author } from "modules/Modules/interfaces/Module";
import { Actions, Subjects } from "core/utils/abilities";
import userEvent from "@testing-library/user-event";
import { saveWorkspace } from 'core/utils/workspace';

interface fakeCanProps {
  I?: Actions;
  a?: Subjects;
  passThrough?: boolean;
  isDisabled?: boolean;
  allowedRoutes?: boolean;
  children: ReactElement;
}

const fakeAuthor: Author = {
  createdAt: "fake-data",
  email: "pseudonym@gmail.com",
  id: "1",
  name: "pseudonym"
}

const fakeComponent: ComponentInterface = {
  id: "fake-id",
  name: "fake-name",
  latencyThreshold: "30",
  errorThreshold: "30",
  hostValue: "fakeHost",
  gatewayName: "fakeGateway"
};

const fakeModule: Module = {
  gitRepositoryAddress: "fake-github",
  helmRepository: "http://api.github.com/repos/zupit/charlescd/content?ref=master",
  id: "1",
  name: "fake-module",
  author: fakeAuthor,
  components: [fakeComponent]
}

const mockOnChange = jest.fn()

jest.mock('containers/Can', () => {
  return {
    __esModule: true,
    default: ({ children }: fakeCanProps) => {
      return <div>{children}</div>;
    }
  };
});

beforeAll(() => {
  saveWorkspace({ id: '123', name: 'Workspace', gitProvider: 'GITHUB' });
});

test("component for edit mode render", async () => {
  const { container } = render(
    <AllTheProviders>
      <FormModule
        onChange={mockOnChange}
        module={fakeModule}
        key={"fake-key"}
      />
    </AllTheProviders>
  );

  await waitFor(() => expect(container.innerHTML).toMatch("Edit module"));
});

test("component for edit mode create", async () => {
  const { container } = render(
    <AllTheProviders>
      <FormModule
        onChange={mockOnChange}
        module={null}
        key={"fake-key"}
      />
    </AllTheProviders>
  );

  await waitFor(() => expect(container.innerHTML).toMatch("Create module"));
});

test("Should render submit button", async () => {
  const updateModuleSpy = jest.spyOn(UpdateModuleHook, 'useUpdateModule');

  render(
    <AllTheProviders>
      <FormModule
        onChange={jest.fn()}
        module={fakeModule}
        key={"fake-key"}
      />
    </AllTheProviders>
  );

  userEvent.click(screen.getByTestId('button-default-submit'));
  expect(updateModuleSpy).toHaveBeenCalled();
  updateModuleSpy.mockRestore();
});

test('should validate blank in optional helm path', async () => {
  render(
    <AllTheProviders>
      <FormModule
        onChange={jest.fn()}
        module={{} as Module}
        key={"fake-key"}
      />
    </AllTheProviders>
  );

  const pathInput = await screen.findByTestId('input-text-helmPath');
  await act(async () => userEvent.type(pathInput, '   '))
  await waitFor(() => expect(screen.getByText('No whitespaces')).toBeInTheDocument());
});

test('should validate blank in optional branch path', async () => {
  render(
    <AllTheProviders>
      <FormModule
        onChange={jest.fn()}
        module={{} as Module}
        key={"fake-key"}
      />
    </AllTheProviders>
  );

  const branchInput = await screen.findByTestId('input-text-helmBranch');
  await act(async () => userEvent.type(branchInput, '   '))
  await waitFor(() => expect(screen.getByText('No whitespaces')).toBeInTheDocument());
});

test('should not show error when optional field is empty (helm path)', async () => {
  render(
    <AllTheProviders>
      <FormModule
        onChange={jest.fn()}
        module={{} as Module}
        key={"fake-key"}
      />
    </AllTheProviders>
  );

  const helmPath = await screen.findByTestId('input-text-helmPath');
  await act(async () => userEvent.type(helmPath, ''))
  await waitFor(() => expect(screen.queryByText('This field is required')).not.toBeInTheDocument());
});

test('should not show error when optional field is empty (helm branch)', async () => {
  render(
    <AllTheProviders>
      <FormModule
        onChange={jest.fn()}
        module={{} as Module}
        key={"fake-key"}
      />
    </AllTheProviders>
  );

  const helmBranch = await screen.findByTestId('input-text-helmBranch');
  await act(async () => userEvent.type(helmBranch, ''))
  await waitFor(() => expect(screen.queryByText('This field is required')).not.toBeInTheDocument());
});

test('should not show error when typing whitespaces followed by some value', async () => {
  render(
    <AllTheProviders>
      <FormModule
        onChange={jest.fn()}
        module={{} as Module}
        key={"fake-key"}
      />
    </AllTheProviders>
  );

  const helmBranch = screen.getByTestId('input-text-helmBranch');
  await act(async () => userEvent.type(helmBranch, '   some value'))
  await waitFor(() => expect(screen.queryByText('No whitespaces')).not.toBeInTheDocument());
});