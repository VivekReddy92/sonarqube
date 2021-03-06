/*
 * SonarQube
 * Copyright (C) 2009-2018 SonarSource SA
 * mailto:info AT sonarsource DOT com
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */
/* eslint-disable camelcase */
import * as React from 'react';
import { shallow } from 'enzyme';
import App from '../App';
import { waitAndUpdate } from '../../../../helpers/testUtils';

const COMPONENT = { key: 'foo', name: 'Foo', qualifier: 'TRK' };

const METRICS = {
  lines_to_cover: {
    id: '1',
    key: 'lines_to_cover',
    type: 'INT',
    name: 'Lines to Cover',
    domain: 'Coverage'
  },
  coverage: { id: '2', key: 'coverage', type: 'PERCENT', name: 'Coverage', domain: 'Coverage' },
  duplicated_lines_density: {
    id: '3',
    key: 'duplicated_lines_density',
    type: 'PERCENT',
    name: 'Duplicated Lines (%)',
    domain: 'Duplications'
  },
  new_bugs: { id: '4', key: 'new_bugs', type: 'INT', name: 'New Bugs', domain: 'Reliability' }
};

const PROPS = {
  branch: { isMain: true, name: 'master' },
  component: COMPONENT,
  currentUser: { isLoggedIn: false },
  location: { pathname: '/component_measures', query: { metric: 'coverage' } },
  fetchMeasures: jest.fn().mockResolvedValue({
    component: COMPONENT,
    measures: [{ metric: 'coverage', value: '80.0' }]
  }),
  fetchMetrics: jest.fn(),
  metrics: METRICS,
  metricsKey: ['lines_to_cover', 'coverage', 'duplicated_lines_density', 'new_bugs'],
  router: { push: jest.fn() } as any
};

it('should render correctly', async () => {
  const wrapper = shallow(<App {...PROPS} />);
  expect(wrapper.find('.spinner')).toHaveLength(1);
  await waitAndUpdate(wrapper);
  expect(wrapper).toMatchSnapshot();
});

it('should render a measure overview', async () => {
  const wrapper = shallow(
    <App
      {...PROPS}
      location={{ pathname: '/component_measures', query: { metric: 'Reliability' } }}
    />
  );
  expect(wrapper.find('.spinner')).toHaveLength(1);
  await waitAndUpdate(wrapper);
  expect(wrapper.find('MeasureOverviewContainer')).toHaveLength(1);
});

it('should render a message when there are no measures', async () => {
  const fetchMeasures = jest.fn().mockResolvedValue({ component: COMPONENT, measures: [] });
  const wrapper = shallow(<App {...PROPS} fetchMeasures={fetchMeasures} />);
  await waitAndUpdate(wrapper);
  expect(wrapper).toMatchSnapshot();
});
