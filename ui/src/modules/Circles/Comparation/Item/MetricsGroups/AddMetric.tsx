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
import { useForm, FormProvider } from 'react-hook-form';
import Text from 'core/components/Text';
import { Option } from 'core/components/Form/Select/interfaces';
import { conditionOptions } from './constants';
import Input from 'core/components/Form/Input';
import StyledRule from 'modules/Circles/Segments/styled';
import { useMetricProviders, useSaveMetric, useProviderMetrics } from './hooks';
import { normalizeSelectOptions } from 'core/utils/select';
import { Metric } from './types';
import {
  normalizeMetricOptions,
  getCondition,
  getSelectDefaultValue
} from './helpers';
import BasicQueryForm from './BasicQueryForm';
import Styled from './styled';
import Button from 'core/components/Button/ButtonDefault';
import { isRequiredAndNotBlank } from 'core/utils/validations';

type Props = {
  id: string;
  onGoBack: Function;
  metric?: Metric;
};

const AddMetric = ({ onGoBack, id, metric }: Props) => {
  const formMethods = useForm<Metric>({
    mode: 'onChange',
    defaultValues: metric ?? {}
  });
  const {
    handleSubmit,
    register,
    control,
    errors,
    watch,
    formState: { isValid }
  } = formMethods;
  const [isBasicQuery, setIsBasicQuery] = useState(true);
  const { getMetricsProviders } = useMetricProviders();
  const [loadingProviders, setLoadingProviders] = useState(false);
  const [loadingMetrics, setLoadingMetrics] = useState(false);
  const { getAllDataSourceMetrics } = useProviderMetrics();
  const { saveMetric, status: creatingStatus } = useSaveMetric(
    metric?.id
  );
  const [providerOptions, setProviderOptions] = useState<Option[]>();
  const [showThresholdForm, setShowThresholdForm] = useState(
    () => !!metric?.condition
  );
  const [metrics, setMetrics] = useState<Option[]>();
  const watchDataSourceId = watch('dataSourceId');
  const canShowForm = watchDataSourceId || metric?.id;

  useEffect(() => {
    if (metric) {
      setIsBasicQuery(!!metric?.metric);
    } else {
      setIsBasicQuery(true);
    }
  }, [metric]);

  useEffect(() => {
    setLoadingProviders(true);
    getMetricsProviders()
      .then(providersResponse => {
        const normalizedOptions = normalizeSelectOptions(providersResponse);
        setProviderOptions(normalizedOptions);
      })
      .finally(() => setLoadingProviders(false));
  }, [getMetricsProviders]);

  useEffect(() => {
    if (isBasicQuery && watchDataSourceId) {
      setLoadingMetrics(true);
      getAllDataSourceMetrics(watchDataSourceId)
        .then(metricsResponse => {
          const normalizedOptions = normalizeMetricOptions(metricsResponse);
          setMetrics(normalizedOptions);
        })
        .finally(() => setLoadingMetrics(false));
    }
  }, [isBasicQuery, watchDataSourceId, getAllDataSourceMetrics]);

  const onSubmit = (data: Metric) => {
    const filtersPayload = data.filters?.map(({ id, ...rest }) => {
      return id ? { id, ...rest } : rest;
    });
    const payload = {
      ...data,
      id: metric?.id,
      circleId: metric?.circleId,
      filters: filtersPayload ?? [],
      threshold: Number(data.threshold)
    };

    saveMetric(id, payload)
      .then(response => {
        if (response) {
          onGoBack();
        }
      })
  };

  return (
    <div data-testid="add-metric">
      <Styled.Layer>
        <Styled.Icon
          name="arrow-left"
          color="dark"
          onClick={() => onGoBack()}
        />
      </Styled.Layer>
      <Styled.Layer>
        <Text tag="H2" color="light">
          {metric?.id ? 'Update metric' : 'Add metric'}
        </Text>
      </Styled.Layer>
      <FormProvider {...formMethods}>
        <Styled.Form
          onSubmit={handleSubmit(onSubmit)}
          data-testid="create-metric"
        >
          <Styled.Layer>
            <Styled.Input
              name="nickname"
              ref={register(isRequiredAndNotBlank)}
              label="Type a nickname for the metric"
              maxLength={100}
            />
            {!loadingProviders && (
              <Styled.Select
                control={control}
                name="dataSourceId"
                label="Select a datasource"
                options={providerOptions}
                rules={{ required: true }}
                defaultValue={getSelectDefaultValue(
                  metric?.dataSourceId,
                  providerOptions
                )}
              />
            )}

            {canShowForm && (
              <>
                <Text tag="H5" color="dark">
                  You can fill your query in a basic or advanced way:
                </Text>
                <Styled.Actions>
                  <Styled.ButtonIconRounded
                    color="dark"
                    onClick={() => setIsBasicQuery(true)}
                    isActive={isBasicQuery}
                  >
                    Basic
                  </Styled.ButtonIconRounded>
                  <Styled.ButtonIconRounded
                    color="dark"
                    onClick={() => setIsBasicQuery(false)}
                    isActive={!isBasicQuery}
                  >
                    Advanced
                  </Styled.ButtonIconRounded>
                </Styled.Actions>

                {isBasicQuery && (
                  <>
                    {!loadingMetrics && (
                      <>
                        <Styled.SelectMetric
                          control={control}
                          name="metric"
                          label="Metric"
                          options={metrics}
                          rules={{ required: true }}
                          hasError={!!errors?.metric}
                          defaultValue={getSelectDefaultValue(
                            metric?.metric,
                            metrics
                          )}
                        />
                      </>
                    )}
                    <BasicQueryForm />
                  </>
                )}

                {!isBasicQuery && (
                  <>
                    <Styled.AdvancedQueryWrapper>
                      <Input
                        name="query"
                        ref={register(isRequiredAndNotBlank)}
                        hasError={!!errors?.query}
                        label="Type a query"
                      />
                    </Styled.AdvancedQueryWrapper>
                  </>
                )}

                <Styled.Title tag="H2" color="light">Threshold</Styled.Title>
                <Styled.Subtitle tag="H5" color="dark">
                  Set the threshold for this metric:
                </Styled.Subtitle>

                {!showThresholdForm && (
                  <Styled.ButtonAdd
                    name="add"
                    icon="add"
                    color="dark"
                    onClick={() => setShowThresholdForm(true)}
                  >
                    Add threshold
                  </Styled.ButtonAdd>
                )}

                {showThresholdForm && (
                  <Styled.ThresholdWrapper>
                    <StyledRule.Rule data-testid="threshold-form">
                      <StyledRule.RuleTrash>
                        <StyledRule.Button.Icon
                          name="trash"
                          size="15px"
                          color="light"
                          onClick={() => setShowThresholdForm(false)}
                        />
                      </StyledRule.RuleTrash>
                      <Styled.ThresholdSelect
                        options={conditionOptions}
                        control={control}
                        rules={{ required: true }}
                        label="Conditional"
                        name="condition"
                        defaultValue={getCondition(metric?.condition)}
                      />

                      <Styled.InputNumber
                        name="threshold"
                        label="Threshold"
                        ref={register(isRequiredAndNotBlank)}
                        maxLength={100}
                      />
                    </StyledRule.Rule>
                  </Styled.ThresholdWrapper>
                )}

                <Button
                  type="submit"
                  isLoading={creatingStatus.isPending}
                  isDisabled={!isValid}
                  id="submit"
                >
                  Save
                </Button>
              </>
            )}
          </Styled.Layer>
        </Styled.Form>
      </FormProvider>
    </div>
  );
};

export default AddMetric;
