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

import React, { useState, useEffect } from 'react';
import { useForm, FormContext } from 'react-hook-form';
import Text from 'core/components/Text';
import Card from 'core/components/Card';
import Popover, { CHARLES_DOC } from 'core/components/Popover';
import { normalizeSelectOptions } from 'core/utils/select';
import Button from 'core/components/Button';
import { usePlugins, useCreateAction } from './hooks';
import { Props } from '../interfaces';
import Styled from './styled';
import { ActionForm, ActionPayload } from './types';
import { buildActionPayload } from './helpers';

const FormAddAction = ({ onFinish }: Props) => {
  const [loadingPlugins, setLoadingPlugins] = useState(true);
  const [showConfigAction, setShowConfigAction] = useState(false);
  const [isDefault, setIsDefault] = useState(true);
  const [pluginsOptions, setPluginsOptions] = useState([]);
  const formMethods = useForm<ActionForm>({ mode: 'onChange' });
  const {
    handleSubmit,
    register,
    control,
    watch,
    formState: { isValid }
  } = formMethods;
  const nickname = watch('nickname') as string;

  const { getPlugins } = usePlugins();
  const { createAction, status } = useCreateAction();

  useEffect(() => {
    setLoadingPlugins(true);
    getPlugins('action')
      .then(pluginsResponse => {
        const normalizedOptions = normalizeSelectOptions(pluginsResponse);
        setPluginsOptions(normalizedOptions);
      })
      .finally(() => setLoadingPlugins(false));
  }, [getPlugins]);

  const onSubmit = (data: ActionForm) => {
    const payload = buildActionPayload(data, isDefault) as ActionPayload;

    createAction(payload)
      .then(response => {
        if (response) {
          onFinish();
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const renderActionConfig = () => (
    <>
      <Card.Config
        icon="action"
        description={nickname}
        onClose={() => setShowConfigAction(false)}
      />
      <Styled.OptionText color="dark">
        You select an action configuration in a basic way or fill an advanced
        one.
      </Styled.OptionText>
      <Styled.ButtonGroup>
        <Styled.ButtonIconRounded
          color="dark"
          onClick={() => setIsDefault(true)}
          isActive={isDefault}
        >
          Default
        </Styled.ButtonIconRounded>
        <Styled.ButtonIconRounded
          color="dark"
          onClick={() => setIsDefault(false)}
          isActive={!isDefault}
        >
          Custom path
        </Styled.ButtonIconRounded>
      </Styled.ButtonGroup>
      {!isDefault && (
        <Styled.Input
          name="configuration"
          ref={register({ required: true })}
          label="Enter a action configuration"
        />
      )}
      <Button.Default
        id="save"
        type="submit"
        isDisabled={!isValid}
        isLoading={status.isPending}
      >
        Save
      </Button.Default>
    </>
  );

  const renderForm = () => (
    <Styled.FormContent showForm={!showConfigAction}>
      <Styled.Input
        name="nickname"
        ref={register({ required: true })}
        label="Type a nickname"
        maxLength={100}
      />
      <Styled.Input
        name="description"
        ref={register({ required: true })}
        label="Type a description"
      />
      <Styled.Select
        control={control}
        name="type"
        label="Select a plugin"
        isLoading={loadingPlugins}
        options={pluginsOptions}
        rules={{ required: true }}
      />
      <Button.Default
        id="next"
        isDisabled={!isValid}
        onClick={() => setShowConfigAction(true)}
      >
        Next
      </Button.Default>
    </Styled.FormContent>
  );

  return (
    <Styled.Content>
      <Text.h2 color="light" weight="bold">
        Add Action config
        <Popover
          title="What is a action?"
          icon="info"
          link={`${CHARLES_DOC}/reference/metrics`}
          linkLabel="View documentation"
          description="You can create an action and add a trigger to perform an aitomatic task."
        />
      </Text.h2>
      <FormContext {...formMethods}>
        <Styled.Form
          onSubmit={handleSubmit(onSubmit)}
          data-testid="create-action"
        >
          {renderForm()}
          {showConfigAction && renderActionConfig()}
        </Styled.Form>
      </FormContext>
    </Styled.Content>
  );
};

export default FormAddAction;
