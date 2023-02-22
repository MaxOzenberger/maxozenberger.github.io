/** @jsx jsx */
/**
  Licensing

  Copyright 2022 Esri

  Licensed under the Apache License, Version 2.0 (the "License"); You
  may not use this file except in compliance with the License. You may
  obtain a copy of the License at
  http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
  implied. See the License for the specific language governing
  permissions and limitations under the License.

  A copy of the license is available in the repository's
  LICENSE file.
*/
import { React, jsx, css, IMDataSourceInfo, DataSource, DataSourceStatus, FeatureLayerQueryParams, AllWidgetProps, DataSourceComponent, classNames } from 'jimu-core'
import { Button } from 'jimu-ui'

/**
 * This widget shows how to listen to the selection change of a data source.
 */
export default function Widget (props: AllWidgetProps<{}>) {
  const isDsConfigured = () => {
    if (props.useDataSources && props.useDataSources.length === 1) {
      return true
    }
    return false
  }
  const dataRender = (ds: DataSource, info: IMDataSourceInfo) => {
    return <div className='record-list'>
        {
          ds && ds.getStatus() === DataSourceStatus.Loaded
            ? ds.getRecords().map((r, i) => {
              if(r.getFieldValue("datetimesubmitted") == ds.getRecords().sort((a, b) => (a.getFieldValue("datetimesubmitted") > b.getFieldValue("datetimesubmitted") ? -1 : 1))[0].getFieldValue("datetimesubmitted")){
                let unixDate = r.getFieldValue("datetimesubmitted");
                let formatDate = String(new Date(unixDate));
                let priorityValue = r.getFieldValue("PriorityLevel");
                console.log(formatDate);
                if(priorityValue == "Critical" || priorityValue == "High"){
                  return <div className='highAlert'><h2 className='whiteText'>Newest SALUTE Report</h2>
                    <br />
                    <h3 className='whiteText'>WARNING: A {r.getFieldValue("PriorityLevel")} priority SALUTE Report has been submitted recently,</h3> 
                    <br />
                    <Button type='tertiary' key={i} onClick={() => ds.selectRecordById(r.getId())} className="whiteText largeFont">
                      Submitted on {formatDate}, please click here to review immediately.
                    </Button>
                  </div>
                }
                else
                {
                  return <div className='mediumAlert'><h2>Newest SALUTE Report</h2>
                    <br />
                    <h3>Alert: A {r.getFieldValue("PriorityLevel")} priority SALUTE Report has been submitted</h3> 
                    <br />
                    <Button type='tertiary' key={i} onClick={() => ds.selectRecordById(r.getId())} className="largeFont">
                      Submitted on {formatDate}, please click here to review.
                    </Button>
                  </div>
                }
              }
            })
            : null
        }
      </div>
  }

  if (!isDsConfigured()) {
    return <h2>
      New SALUTE Reports will highlight here.
      <br />
      Please configure the data source.
    </h2>
  }
  return <div className='widget-listen-selection-change' css={style}>
    <DataSourceComponent useDataSource={props.useDataSources[0]} query={{ where: '1=1' } as FeatureLayerQueryParams} widgetId={props.id}>
      {dataRender}
    </DataSourceComponent>
  </div>
}

const style = css`
  width: 100%;
  height: 100%;
  max-height: 800px;
  overflow: auto;
  .blue-border {
    border: 1px solid var(--primary-500);
  }
  .record-list {
    width: 100%;
    height: 100%;
    overflow: auto;
    text-align: center;
  }
  .highAlert {
    background-image: linear-gradient(to bottom right, red, orange); 
    padding: 5px;
    height: 100%
  }
  .mediumAlert {
    background-image: linear-gradient(to bottom right, yellow, lightgreen); 
    padding: 5px;
    height: 100%
  }
  .whiteText {
    color: white;
  }
  .largeFont {
    font-size: large;
  }
  .largeFont:hover {
    border: 3px solid black
  }
`
