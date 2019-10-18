import * as consul from 'consul'
import { IConsulConnectionOptions, IConsulKV } from './interfaces'
import { AppConstants } from '../../constants'

export class ConsulService {

  private static readonly consulConnection = ConsulService.getConnection()

  public static async getAppConfiguration(): Promise<IConsulKV> {

    return await ConsulService.getKV(AppConstants.CONSUL_KEY_PATH)
  }

  private static async getKV(key: string): Promise<IConsulKV> {

    return new Promise((resolve, reject) => {
      ConsulService.consulConnection.kv.get(key, (err, item) => {
        err ?
          reject(err) :
          resolve(ConsulService.parseKV(item.Value))
      })
    })
  }

  private static parseKV(value: string | IConsulKV): IConsulKV {

    return typeof value === 'string' ?
      JSON.parse(value) : value
  }

  private static getConnection() {

    return consul(
      ConsulService.getConnectionOptions()
    )
  }

  private static getConnectionOptions(): IConsulConnectionOptions {

    return {
      host: AppConstants.CONSUL_HOST
    }
  }
}
