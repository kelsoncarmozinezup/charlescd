/*
 *
 *  Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

package main

import (
	"github.com/joho/godotenv"
	"hermes/internal/configuration"
	"hermes/internal/message"
	"hermes/internal/messageexecutionhistory"
	"hermes/internal/subscription"
	"hermes/web/api"
	"log"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	configuration.CheckEnvValues()

	db, err := configuration.GetDBConnection("migrations")
	if err != nil {
		log.Fatal(err)
	}

	subscriptionMain := subscription.NewMain(db)
	messageMain := message.NewMain(db)
	messageExecutionMain := messageexecutionhistory.NewMain(db)

	router := api.NewApi(subscriptionMain, messageMain, messageExecutionMain)
	api.Start(router)
}
