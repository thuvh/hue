// Licensed to Cloudera, Inc. under one
// or more contributor license agreements.  See the NOTICE file
// distributed with this work for additional information
// regarding copyright ownership.  Cloudera, Inc. licenses this file
// to you under the Apache License, Version 2.0 (the
// 'License'); you may not use this file except in compliance
// with the License.  You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import SqlExecutable from 'apps/editor/execution/sqlExecutable';
import huePubSub from 'utils/huePubSub';
import { nextTick } from 'vue';
import { mount, shallowMount } from '@vue/test-utils';
import { EXECUTABLE_UPDATED_EVENT, ExecutionStatus } from 'apps/editor/execution/executable';
import sessionManager from 'apps/editor/execution/sessionManager';
import ExecuteButton from './ExecuteButton.vue';
import { noop } from 'utils/hueUtils';

describe('ExecuteButton.vue', () => {
  it('should render', () => {
    const wrapper = shallowMount(ExecuteButton);
    expect(wrapper.element).toMatchSnapshot();
  });

  it('should show execute once the session is loaded', async () => {
    const spy = spyOn(sessionManager, 'getSession').and.returnValue(
      Promise.resolve({ type: 'foo' })
    );

    const mockExecutable = {
      cancel: noop,
      cancelBatchChain: noop,
      execute: noop,
      isPartOfRunningExecution: () => false,
      isReady: () => true,
      reset: noop,
      nextExecutable: {},
      executor: {
        defaultLimit: noop,
        connector: () => ({
          id: 'foo'
        })
      },
      status: ExecutionStatus.ready
    } as SqlExecutable;

    const wrapper = shallowMount(ExecuteButton, {
      props: {
        executable: mockExecutable
      }
    });

    await nextTick();

    expect(spy).toHaveBeenCalled();
    expect(wrapper.element).toMatchSnapshot();
  });

  it('should handle execute and stop clicks', async () => {
    const spy = spyOn(sessionManager, 'getSession').and.returnValue(
      Promise.resolve({ type: 'foo' })
    );
    let executeCalled = false;
    let cancelCalled = false;
    const mockExecutable = {
      cancel: () => {
        cancelCalled = true;
      },
      cancelBatchChain: () => {
        cancelCalled = true;
      },
      execute: async () => {
        executeCalled = true;
      },
      isPartOfRunningExecution: () => false,
      isReady: () => true,
      reset: noop,
      nextExecutable: {},
      executor: {
        defaultLimit: noop,
        connector: () => ({
          id: 'foo',
          type: 'foo'
        })
      },
      status: ExecutionStatus.ready
    } as SqlExecutable;

    const wrapper = mount(ExecuteButton, {
      props: {
        executable: mockExecutable
      }
    });

    await nextTick();

    expect(spy).toHaveBeenCalled();

    // Click play
    expect(executeCalled).toBeFalsy();
    expect(wrapper.get('button').text()).toContain('Execute');
    wrapper.get('button').trigger('click');

    await nextTick();

    expect(executeCalled).toBeTruthy();
    mockExecutable.status = ExecutionStatus.running;
    huePubSub.publish(EXECUTABLE_UPDATED_EVENT, mockExecutable);

    await nextTick();

    // Click stop
    expect(cancelCalled).toBeFalsy();
    expect(wrapper.get('button').text()).toContain('Stop');
    wrapper.get('button').trigger('click');

    await nextTick();

    expect(cancelCalled).toBeTruthy();
  });
});
