package metricsgroup

import (
	"compass/internal/util"
	"encoding/json"
	"errors"
	"io"
	"path/filepath"
	"plugin"

	"github.com/google/uuid"
)

type MetricsGroup struct {
	util.BaseModel
	Name        string    `json:"name"`
	Metrics     []Metric  `json:"metrics"`
	WorkspaceID uuid.UUID `json:"workspaceId"`
	CircleID    uuid.UUID `json:"circleId"`
}

func (metricsGroup MetricsGroup) Validate() []error {
	ers := make([]error, 0)

	if metricsGroup.Name == "" {
		ers = append(ers, errors.New("Name is required"))
	}

	if metricsGroup.Metrics == nil || len(metricsGroup.Metrics) == 0 {
		ers = append(ers, errors.New("Metrics is required"))
	}

	if metricsGroup.CircleID == uuid.Nil {
		ers = append(ers, errors.New("CircleID is required"))
	}

	for _, m := range metricsGroup.Metrics {
		if m.Validate() != nil {
			ers = append(ers, m.Validate())
		}
	}

	return ers
}

type Condition int

const (
	EQUAL Condition = iota
	GREATER_THEN
	LOWER_THEN
)

func (c Condition) String() string {
	return [...]string{"EQUAL", "GREATER_THEN", "LOWER_THEN"}[c]
}

func (main Main) Parse(metricsGroup io.ReadCloser) (MetricsGroup, error) {
	var newMetricsGroup *MetricsGroup
	err := json.NewDecoder(metricsGroup).Decode(&newMetricsGroup)
	if err != nil {
		return MetricsGroup{}, err
	}
	return *newMetricsGroup, nil
}

func (main Main) FindAll() ([]MetricsGroup, error) {
	metricsGroups := []MetricsGroup{}
	db := main.db.Find(&metricsGroups)
	if db.Error != nil {
		return []MetricsGroup{}, db.Error
	}
	return metricsGroups, nil
}

func (main Main) Save(metricsGroup MetricsGroup) (MetricsGroup, error) {
	db := main.db.Create(&metricsGroup)
	if db.Error != nil {
		return MetricsGroup{}, db.Error
	}
	return metricsGroup, nil
}

func (main Main) FindById(id string) (MetricsGroup, error) {
	metricsGroup := MetricsGroup{}
	db := main.db.Preload("Metrics").Where("id = ?", id).First(&metricsGroup)
	if db.Error != nil {
		return MetricsGroup{}, db.Error
	}
	return metricsGroup, nil
}

func (main Main) Update(id string, metricsGroup MetricsGroup) (MetricsGroup, error) {
	db := main.db.Table("metrics_groups").Where("id = ?", id).Update(&metricsGroup)
	if db.Error != nil {
		return MetricsGroup{}, db.Error
	}
	return metricsGroup, nil
}

func (main Main) Remove(id string) error {
	db := main.db.Where("id = ?", id).Delete(MetricsGroup{})
	if db.Error != nil {
		return db.Error
	}
	return nil
}

func (main Main) Query(id string) (map[string]interface{}, error) {
	metricsResults := map[string]interface{}{}
	pluginsPath := "plugins"
	metricsGroup, err := main.FindById(id)
	if err != nil {
		return nil, errors.New("Not found metrics group: " + id)
	}

	for _, metric := range metricsGroup.Metrics {
		dataSourceResult, err := main.datasourceMain.FindById(metric.DataSourceID.String())
		if err != nil {
			return nil, errors.New("Not found data source: " + metric.DataSourceID.String())
		}

		pluginResult, err := main.pluginMain.FindById(dataSourceResult.PluginID.String())
		if err != nil {
			return nil, errors.New("Not found plugin: " + dataSourceResult.PluginID.String())
		}

		plugin, err := plugin.Open(filepath.Join(pluginsPath, pluginResult.Src+".so"))
		if err != nil {
			return nil, err
		}

		getQuery, err := plugin.Lookup("Query")
		if err != nil {
			return nil, err
		}

		dataSourceConfigurationData, _ := json.Marshal(dataSourceResult.Data)
		metricData, _ := json.Marshal(metric)
		query, err := getQuery.(func(datasourceConfiguration, metric []byte) (interface{}, error))(dataSourceConfigurationData, metricData)
		if err != nil {
			return nil, err
		}

		metricsResults[metric.Metric] = query
	}

	return metricsResults, nil
}
