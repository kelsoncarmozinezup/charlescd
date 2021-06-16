package models

import (
	"github.com/ZupIT/charlescd/compass/internal/util"
	"github.com/ZupIT/charlescd/compass/pkg/datasource"
	"github.com/google/uuid"
)

type Metric struct {
	util.BaseModel
	MetricsGroupID  uuid.UUID                 `json:"metricGroupId"`
	DataSourceID    uuid.UUID                 `json:"dataSourceId"`
	Nickname        string                    `json:"nickname"`
	Query           string                    `json:"query"`
	Metric          string                    `json:"metric"`
	Filters         []datasource.MetricFilter `json:"filters"`
	GroupBy         []MetricGroupBy           `json:"groupBy"`
	Condition       string                    `json:"condition"`
	Threshold       float64                   `json:"threshold"`
	CircleID        uuid.UUID                 `json:"circleId"`
	MetricExecution MetricExecution           `json:"execution"`
}

type MetricGroupBy struct {
	util.BaseModel
	MetricID uuid.UUID `json:"-"`
	Field    string    `json:"field"`
}
