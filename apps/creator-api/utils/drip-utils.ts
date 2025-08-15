import { ERC20_ABI } from '@idriss-xyz/constants';
import {
  createPublicClient,
  encodeFunctionData,
  getAddress,
  Hex,
  http,
  parseUnits,
} from 'viem';
import { sepolia, base } from 'viem/chains';
import { InvokeCommand } from '@aws-sdk/client-lambda';
import { SIGNING_LAMBDA_NAME } from '../config/aws-config';

export const chainMap = {
  '11155111': sepolia,
  '8453': base,
};

export function getClient(chain: (typeof chainMap)[keyof typeof chainMap]) {
  return createPublicClient({ chain, transport: http() });
}

export async function estimateErc20GasOrDefault(params: {
  client: ReturnType<typeof getClient>;
  token?: Hex;
  from: Hex;
  to: Hex;
}) {
  const fallback = BigInt(65000);
  if (!params.token) return fallback;

  let tokenAddr;
  try {
    tokenAddr = getAddress(params.token);
  } catch {
    return fallback;
  }

  const data = encodeFunctionData({
    abi: ERC20_ABI,
    functionName: 'transfer',
    args: [params.to, BigInt(1)],
  });

  try {
    return await params.client.estimateGas({
      account: params.from,
      to: tokenAddr,
      data,
    });
  } catch (error) {
    console.log('Estimation failed, returning fallback', error);
    return fallback;
  }
}

export async function calcDripWei(params: {
  client: ReturnType<typeof getClient>;
  gasLimit: bigint;
  multiplier?: bigint;
  headroomPct?: string;
}) {
  const multiplier = params.multiplier ?? BigInt(3);
  const headroomPct = params.headroomPct ?? '0.20';

  let maxFeePerGas;
  try {
    const fees = await params.client.estimateFeesPerGas();
    maxFeePerGas = fees.maxFeePerGas;
  } catch {
    maxFeePerGas = await params.client.getGasPrice();
  }

  const base = params.gasLimit * maxFeePerGas * multiplier;

  const scale = parseUnits('1', 4);
  const factor = scale + parseUnits(headroomPct, 4);
  return (base * factor) / scale;
}

export function buildInvokeCommand(payload: unknown) {
  return new InvokeCommand({
    FunctionName: SIGNING_LAMBDA_NAME,
    InvocationType: 'RequestResponse',
    LogType: 'Tail',
    Payload: Buffer.from(JSON.stringify({ body: JSON.stringify(payload) })),
  });
}

export function decodeLambda(resp: any) {
  const s =
    resp.Payload && (resp.Payload as Uint8Array).byteLength
      ? Buffer.from(resp.Payload as Uint8Array).toString('utf8')
      : '';
  if (!s) return { error: 'Empty lambda payload' };
  const outer = JSON.parse(s);
  const bodyStr =
    typeof outer.body === 'string'
      ? outer.body
      : JSON.stringify(outer.body ?? {});
  return bodyStr ? JSON.parse(bodyStr) : {};
}
