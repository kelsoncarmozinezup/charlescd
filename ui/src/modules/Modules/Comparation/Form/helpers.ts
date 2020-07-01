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

import forEach from 'lodash/forEach';

export const validFields = (fields: object) => {
  let status = true;
  forEach(fields, (value: string) => {
    if (value === '') {
      status = false;

      return status;
    }
  });
  return status;
};

export const fullScreenHandler = (fullScreenEnabled: boolean, setFullScreen: (fullScreenEnabled: boolean) => void) => {
  if (fullScreenEnabled) {
    document.exitFullscreen()
      .then(() => setFullScreen(false))
      .catch((err) => console.error(err))
  } else {
    setFullScreen(true)
    document.documentElement.requestFullscreen()
  }
}
