import { describe, it, expect, vi, beforeEach } from 'vitest';
import { zeroAddress } from 'viem';

import { getAlchemyCurrentPrice } from './pricing-utils.js';

const fetchMock = vi.fn();
vi.stubGlobal('fetch', fetchMock);

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubEnv('ALCHEMY_API_KEY', 'test-key');
});

describe('getAlchemyCurrentPrice parity with backend getAlchemyPrices', () => {
  it('sends same request as backend for ERC20 (POST /tokens/by-address)', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [{ prices: [{ value: '0.0123' }] }] }),
    });

    await getAlchemyCurrentPrice(
      '0x000096630066820566162079d3eeb2be510498e0',
      'BASE_MAINNET',
    );

    // Backend calls fetchERC20PricesFromAlchemy with same endpoint and body shape
    const [url, options] = fetchMock.mock.calls[0]!;
    expect(url).toContain('/tokens/by-address');
    expect(options.method).toBe('POST');
    const body = JSON.parse(options.body as string);
    expect(body).toEqual({
      addresses: [
        {
          address: '0x000096630066820566162079d3eeb2be510498e0',
          network: 'base-mainnet',
        },
      ],
    });
  });

  it('sends same request as backend for native (GET /tokens/by-symbol)', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: [{ symbol: 'ETH', prices: [{ value: '3500' }] }],
      }),
    });

    await getAlchemyCurrentPrice(zeroAddress, 'BASE_MAINNET');

    // Backend calls fetchNativePricesFromAlchemy with same endpoint
    const [url, options] = fetchMock.mock.calls[0]!;
    expect(url).toContain('/tokens/by-symbol');
    expect(url).toContain('symbols=ETH');
    expect(options.method).toBe('GET');
  });

  it('extracts same price as backend from identical ERC20 response', async () => {
    const alchemyResponse = {
      data: [
        {
          address: '0x000096630066820566162079d3eeb2be510498e0',
          network: 'base-mainnet',
          prices: [{ value: '0.01234567' }],
        },
      ],
    };

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => alchemyResponse,
    });

    const ponderPrice = await getAlchemyCurrentPrice(
      '0x000096630066820566162079d3eeb2be510498e0',
      'BASE_MAINNET',
    );

    // Backend extracts: Number(priceInfo.prices?.[0]?.value)
    const backendPrice = Number(alchemyResponse.data[0]!.prices[0]!.value);

    expect(ponderPrice).toBe(backendPrice);
  });

  it('extracts same price as backend from identical native response', async () => {
    const alchemyResponse = {
      data: [{ symbol: 'ETH', prices: [{ value: '3500.50' }] }],
    };

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => alchemyResponse,
    });

    const ponderPrice = await getAlchemyCurrentPrice(
      zeroAddress,
      'BASE_MAINNET',
    );

    // Backend extracts: Number(entry.prices[0].value) keyed by symbol
    const backendPrice = Number(alchemyResponse.data[0]!.prices[0]!.value);

    expect(ponderPrice).toBe(backendPrice);
  });

  it('returns null for unsupported network (no fetch call)', async () => {
    const price = await getAlchemyCurrentPrice(
      '0x000096630066820566162079d3eeb2be510498e0',
      'UNSUPPORTED_NETWORK',
    );

    expect(price).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('returns null when API returns empty data', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [] }),
    });

    const price = await getAlchemyCurrentPrice(
      '0x000096630066820566162079d3eeb2be510498e0',
      'BASE_MAINNET',
    );

    expect(price).toBeNull();
  });

  it('returns null on API error after retries', async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 500 });

    const price = await getAlchemyCurrentPrice(
      '0x000096630066820566162079d3eeb2be510498e0',
      'BASE_MAINNET',
    );

    expect(price).toBeNull();
  });
});
