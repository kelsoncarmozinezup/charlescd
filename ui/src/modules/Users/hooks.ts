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

import { useEffect, useCallback, useState } from 'react';
import {
  useFetch,
  useFetchData,
  useFetchStatus,
  FetchStatus,
  ResponseError,
  FetchStatuses
} from 'core/providers/base/hooks';
import {
  findAllUsers,
  resetPasswordById,
  patchProfileById,
  findUserByEmail,
  createNewUser,
  deleteUserById
} from 'core/providers/users';
import { useDispatch } from 'core/state/hooks';
import { toogleNotification } from 'core/components/Notification/state/actions';
import { LoadedUsersAction } from './state/actions';
import { UserPagination } from './interfaces/UserPagination';
import { User, NewUser, NewPassword } from './interfaces/User';
import { isIDMEnabled } from 'core/utils/auth';

export const useUser = (): {
  findByEmail: Function;
  user: User;
  error: ResponseError;
} => {
  const dispatch = useDispatch();
  const getUserByEmail = useFetchData<User>(findUserByEmail);
  const [user, setUser] = useState<User>(null);
  const [error, setError] = useState<ResponseError>(null);

  const findByEmail = useCallback(
    async (email: Pick<User, 'email'>) => {
      try {
        if (email) {
          const res = await getUserByEmail(email);
          setUser(res);

          return res;
        }
      } catch (e) {
        setError(e);

        if (!isIDMEnabled()) {
          dispatch(
            toogleNotification({
              text: `Error when trying to fetch the user info for ${email}`,
              status: 'error'
            })
          );
        }
      }
    },
    [dispatch, getUserByEmail]
  );

  return {
    findByEmail,
    user,
    error
  };
};

export const useCreateUser = (): {
  create: Function;
  newUser: User;
} => {
  const dispatch = useDispatch();
  const createUser = useFetchData<NewUser>(createNewUser);
  const [newUser, setNewUser] = useState(null);

  const create = useCallback(
    async (user: NewUser) => {
      try {
        if (user) {
          const res = await createUser(user);

          setNewUser(res);

          return res;
        }
      } catch (e) {
        const error = await e.json();

        dispatch(
          toogleNotification({
            text: error.message,
            status: 'error'
          })
        );
      }
    },
    [createUser, dispatch]
  );

  return {
    create,
    newUser
  };
};

export const useDeleteUser = (): [Function, string] => {
  const [deleteData, deleteUser] = useFetch<User>(deleteUserById);
  const [userName, setUserName] = useState(undefined);
  const [userStatus, setUserStatus] = useState('');
  const { response, error } = deleteData;
  const dispatch = useDispatch();

  const delUser = useCallback(
    (id: string, name: string) => {
      setUserName(name);
      deleteUser(id);
    },
    [deleteUser]
  );

  useEffect(() => {
    if (error) {
      dispatch(
        toogleNotification({
          text: `The user ${userName} could not be deleted.`,
          status: 'error'
        })
      );
    } else if (response) {
      setUserStatus('Deleted');
      dispatch(
        toogleNotification({
          text: `The user ${userName} has been deleted.`,
          status: 'success'
        })
      );
    }
  }, [response, error, dispatch, userName]);

  return [delUser, userStatus];
};

export const useUpdateName = (): {
  status: string;
  user: User;
  updateNameById: (id: string, name: string) => Promise<User>;
} => {
  const dispatch = useDispatch();
  const [status, setStatus] = useState<FetchStatuses>('idle');
  const [user, setNewUser] = useState<User>();
  const patch = useFetchData<User>(patchProfileById);

  const updateNameById = useCallback(
    async (id: string, name: string) => {
      try {
        setStatus('pending');
        const res = await patch(id, name);
        setNewUser(res);
        setStatus('resolved');

        return Promise.resolve(res);

      } catch (e) {
        setStatus('rejected');

        const error = await e?.json?.();

        dispatch(
          toogleNotification({
            text: error?.message,
            status: 'error'
          })
        );

       return Promise.reject(error);
      }
    },
    [patch, dispatch]
  );

  return { status, user, updateNameById };
};

export const useResetPassword = (): {
  resetPassword: (id: string) => void;
  response: NewPassword;
  status: FetchStatus;
} => {
  const dispatch = useDispatch();
  const status = useFetchStatus();
  const [response, setResponse] = useState<NewPassword>();
  const putResetPassword = useFetchData<NewPassword>(resetPasswordById);

  const resetPassword = async (id: string) => {
    try {
      status.pending();
      const putResponse = await putResetPassword(id);
      setResponse(putResponse);
      status.resolved();
    } catch (e) {
      const error = await e.json();

      dispatch(
        toogleNotification({
          text: error?.message,
          status: 'error'
        })
      );

      status.rejected();
    }
  };

  return { resetPassword, response, status };
};

export const useUsers = (): [Function, UserPagination, boolean] => {
  const dispatch = useDispatch();
  const [usersData, getUsers] = useFetch<UserPagination>(findAllUsers);
  const { response, error, loading } = usersData;

  const filterUsers = useCallback(
    (name: string, page: number) => {
      getUsers({ name, page });
    },
    [getUsers]
  );

  useEffect(() => {
    if (!error) {
      dispatch(LoadedUsersAction(response));
    } else {
      console.error(error);
    }
  }, [dispatch, response, error]);

  return [filterUsers, response, loading];
};

export default useUsers;
