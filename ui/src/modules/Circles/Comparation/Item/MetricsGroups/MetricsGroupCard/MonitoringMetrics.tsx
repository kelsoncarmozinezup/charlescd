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
import { OptionTypeBase } from 'react-select';
import Styled from './styled';
import Chart from 'core/components/Chart';
import areaChartOption from './areaChart.options';
import { useMetricQuery } from '../hooks';
import { getMetricSeries, filterMetricsSeries } from '../helpers';
import Loader from '../../Loaders/index';

type Props = {
  metricsGroupId: string;
  selectFilters: OptionTypeBase[];
  onChangePeriod: Function;
};

const MonitoringMetrics = ({
  metricsGroupId,
  selectFilters,
  onChangePeriod
}: Props) => {
  const [chartData, setChartData] = useState([]);
  const [chartDataLoading, setChartDataLoading] = useState(true);
  const [period, setPeriod] = useState('1h');
  const [interval, setInterval] = useState('5m');
  const { getMetricByQuery } = useMetricQuery();

  useEffect(() => {
    setChartDataLoading(true);
    getMetricByQuery(metricsGroupId, { period, interval })
      .then(metricByQueryResponse => {
        const series = getMetricSeries(metricByQueryResponse);
        setChartData(series);
      })
      .finally(() => setChartDataLoading(false));
  }, [getMetricByQuery, metricsGroupId, period, interval]);

  const toogleChartPeriod = (chartPeriod: string, chartInterval: string) => {
    onChangePeriod();
    setPeriod(chartPeriod);
    setInterval(chartInterval);
  };

  const renderChartPeriodFilter = () => (
    <Styled.MonitoringMetricsPeriodFilter data-testid="monitoring-metrics-period-filter">
      <Styled.ButtonIconRoundedPeriod
        color="dark"
        onClick={() => toogleChartPeriod('1h', '5m')}
        isActive={period === '1h'}
        isDisabled={chartDataLoading}
      >
        Hour
      </Styled.ButtonIconRoundedPeriod>
      <Styled.ButtonIconRoundedPeriod
        color="dark"
        onClick={() => toogleChartPeriod('1d', '1h')}
        isActive={period === '1d'}
        isDisabled={chartDataLoading}
      >
        Day
      </Styled.ButtonIconRoundedPeriod>
      <Styled.ButtonIconRoundedPeriod
        color="dark"
        onClick={() => toogleChartPeriod('1w', '1d')}
        isActive={period === '1w'}
        isDisabled={chartDataLoading}
      >
        Week
      </Styled.ButtonIconRoundedPeriod>
      <Styled.ButtonIconRoundedPeriod
        color="dark"
        onClick={() => toogleChartPeriod('1m', '1w')}
        isActive={period === '1m'}
        isDisabled={chartDataLoading}
      >
        Month
      </Styled.ButtonIconRoundedPeriod>
    </Styled.MonitoringMetricsPeriodFilter>
  );

  return (
    <Styled.MonitoringMetricsContent data-testid="monitoring-metrics">
      {chartDataLoading ? (
        <Loader.MetricsGroupsChart />
      ) : (
        <Chart
          options={areaChartOption}
          series={filterMetricsSeries(chartData, selectFilters)}
          width={500}
          height={200}
          data-testid="monitoring-metrics-chart"
          type="area"
        />
      )}
      {renderChartPeriodFilter()}
    </Styled.MonitoringMetricsContent>
  );
};

export default MonitoringMetrics;
