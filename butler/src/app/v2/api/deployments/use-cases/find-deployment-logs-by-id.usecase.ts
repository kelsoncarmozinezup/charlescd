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
import { InjectRepository } from '@nestjs/typeorm'
import { LogRepository } from '../repository/log.repository'
import { NotFoundException } from '@nestjs/common'
import { ReadLogsDto } from '../dto/read-logs.dto'

export class FindDeploymentLogsByIdUsecase {

  constructor(
        @InjectRepository(LogRepository)
        private readonly logsRepository: LogRepository
  ){}
    
  public async execute(deploymentId: string): Promise<ReadLogsDto> {
    const deploymentLogs = await this.logsRepository.findDeploymentLogs(deploymentId)
    if (!deploymentLogs) {
      throw  new NotFoundException(`No logs found associated with the deployment: ${deploymentId}`)
    }

    return  deploymentLogs.toReadDto()
  }
}