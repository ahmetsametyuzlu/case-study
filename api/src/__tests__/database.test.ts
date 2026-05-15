const mockConnect = jest.fn();

jest.mock('mssql', () => ({
  connect: (...args: unknown[]) => mockConnect(...args),
}));

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
});

describe('getPool', () => {
  it('creates a new connection on first call', async () => {
    const mockPool = { connected: true };
    mockConnect.mockResolvedValue(mockPool);

    const { getPool } = await import('../config/database');
    const pool = await getPool();

    expect(pool).toBe(mockPool);
    expect(mockConnect).toHaveBeenCalledTimes(1);
  });

  it('reuses existing connection on subsequent calls', async () => {
    const mockPool = { connected: true };
    mockConnect.mockResolvedValue(mockPool);

    const { getPool } = await import('../config/database');
    const first = await getPool();
    const second = await getPool();

    expect(first).toBe(second);
    expect(mockConnect).toHaveBeenCalledTimes(1);
  });

  it('throws when connection fails', async () => {
    mockConnect.mockRejectedValue(new Error('connection refused'));

    const { getPool } = await import('../config/database');

    await expect(getPool()).rejects.toThrow('connection refused');
  });
});
