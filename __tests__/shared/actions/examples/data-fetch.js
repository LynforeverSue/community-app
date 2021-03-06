import actions from 'actions/examples/data-fetch';

global.fetch = jest.fn(() =>
  new Promise(resolve =>
    setTimeout(() => resolve({
      json: () => ({ data: 'DUMMY DATA' }),
    }), 1),
  ),
);

describe('examples.dataFetch.fetchDataDone', () => {
  const a = actions.examples.dataFetch.fetchDataDone();

  test('has expected type', () => {
    expect(a.type).toBe('EXAMPLES/DATA_FETCH/FETCH_DATA_DONE');
  });

  /* NOTE: Starting from Jest 20.x.x you should use the more elegant way:
   * expect(a.payload).resolves.toEqual({ data: 'DUMMY DATA' }); */
  test('payload is a promise which resolves to the expected object', () =>
    a.payload.then(res => expect(res).toEqual('DUMMY DATA')));
});
