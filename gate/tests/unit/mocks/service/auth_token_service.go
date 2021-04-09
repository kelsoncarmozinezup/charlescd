// Code generated by mockery v0.0.0-dev. DO NOT EDIT.

package mocks

import (
	service "github.com/ZupIT/charlescd/gate/internal/service"
	mock "github.com/stretchr/testify/mock"
)

// AuthTokenService is an autogenerated mock type for the AuthTokenService type
type AuthTokenService struct {
	mock.Mock
}

// ParseAuthorizationToken provides a mock function with given fields: authorization
func (_m *AuthTokenService) ParseAuthorizationToken(authorization string) (service.AuthToken, error) {
	ret := _m.Called(authorization)

	var r0 service.AuthToken
	if rf, ok := ret.Get(0).(func(string) service.AuthToken); ok {
		r0 = rf(authorization)
	} else {
		r0 = ret.Get(0).(service.AuthToken)
	}

	var r1 error
	if rf, ok := ret.Get(1).(func(string) error); ok {
		r1 = rf(authorization)
	} else {
		r1 = ret.Error(1)
	}

	return r0, r1
}