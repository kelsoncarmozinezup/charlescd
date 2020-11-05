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

import 'jest'
import { Component } from '../../../../app/v2/api/deployments/interfaces'
import { ArgoCdRequestBuilder } from '../../../../app/v2/core/integrations/argocd/request-builder'
import { createComponentFixture } from '../../../unit/conectors/argocd/fixtures/component-fixture'
import { createDeploymentFixture } from '../../../unit/conectors/argocd/fixtures/deployment-fixture'

const deploymentWith3Components = createDeploymentFixture('deployment-id', [
  createComponentFixture('component-id-1', 'A', 'v2'),
  createComponentFixture('component-id-2', 'B', 'v2'),
  createComponentFixture('component-id-3', 'C', 'v2')
])

describe('V2 Argocd Deployment Request Builder', () => {
  
  it('should return empty newDeploys list when there is no components', async() => {
    const deployment = createDeploymentFixture('deployment-id')
    const deploymentRequest = new ArgoCdRequestBuilder().buildDeploymentRequest(deployment, [])

    expect(deploymentRequest.newDeploys).toHaveLength(0)
  })

  it('should ignore deployment components when already exists', async() => {
    const deployment = createDeploymentFixture('deployment-id', [createComponentFixture('component-id-1', 'A', 'v1')])
    const activeComponents: Component[] = [
      createComponentFixture('component-id-2', 'A', 'v1', createDeploymentFixture('deployment-id1'))
    ]

    const deploymentRequest = new ArgoCdRequestBuilder().buildDeploymentRequest(deployment, activeComponents)

    expect(deploymentRequest.newDeploys).toHaveLength(0)
  })

  it('should format application name with the correct size', async() => {
    const deployment = createDeploymentFixture('deployment-id', [createComponentFixture('component-id-1', 'unit-test-application', 'v1')])
    const activeComponents: Component[] = [
      createComponentFixture('component-id-2', 'B', 'v1', createDeploymentFixture('deployment-id1'))
    ]

    const deploymentRequest = new ArgoCdRequestBuilder().buildDeploymentRequest(deployment, activeComponents)

    expect(deploymentRequest.newDeploys[0].metadata.name).toEqual('unit-test-applica-b46fd548-0082-4021-ba80-a50703c44a3b')
  })

  it('should format application name with the correct size when there is not circleId', async() => {
    const deployment = createDeploymentFixture('deployment-id', [createComponentFixture('component-id-1', 'unit-test-application', 'v1')], null)
    const activeComponents: Component[] = [
      createComponentFixture('component-id-2', 'B', 'v1', createDeploymentFixture('deployment-id1'))
    ]

    const deploymentRequest = new ArgoCdRequestBuilder().buildDeploymentRequest(deployment, activeComponents)

    expect(deploymentRequest.newDeploys[0].metadata.name).toEqual('unit-test-application-v1')
  })

  it('should create the correct complete request object with 3 new components and some unused components', async() => {

    const activeComponents: Component[] = [
      createComponentFixture('component-id-4', 'A', 'v1', createDeploymentFixture('deployment-id4')),
      createComponentFixture('component-id-5', 'B', 'v1', createDeploymentFixture('deployment-id5')),
      createComponentFixture('component-id-6', 'B', 'v0', createDeploymentFixture('deployment-id6')),
      createComponentFixture('component-id-7', 'B', 'v0', createDeploymentFixture('deployment-id7')),
      createComponentFixture('component-id-8', 'C', 'v0', createDeploymentFixture('deployment-id8'))
    ]
    const deploymentRequest = new ArgoCdRequestBuilder().buildDeploymentRequest(deploymentWith3Components, activeComponents)
    
    expect(deploymentRequest.newDeploys).toHaveLength(3)
    expect(deploymentRequest.deleteDeploys).toHaveLength(3)
    expect(deploymentRequest.proxyDeployments).toHaveLength(3)
  })
})