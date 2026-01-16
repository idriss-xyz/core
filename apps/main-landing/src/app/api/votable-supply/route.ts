import { NextResponse } from 'next/server';
import { formatEther } from 'viem';
import { clientBase } from '@idriss-xyz/blockchain-clients';
import { ERC20_ABI } from '@idriss-xyz/constants';

import { IDRISS_TOKEN_ADDRESS } from '@/components/token-section/constants';
import {
  VESTING_CONTRACT_ADDRESS,
  VESTING_V2_CONTRACT_ADDRESS,
  DAO_TREASURY_ADDRESS,
  TEAM_TREASURY_ADDRESS,
  AIRDROP_TREASURY_ADDRESS,
  TOTAL_SUPPLY,
  DAO_LIQUIDITY_ID,
  UNISWAP_MINIMIZED_ABI,
  POSITION_MANAGER,
  POOL_ABI,
  POOL_ADDRESS,
  AERO_POOL_ADDRESS,
} from '@/constants';

const DEFAULT_HEADERS = {
  'Access-Control-Allow-Origin': '*',
};

const Q96 = 2n ** 96n;
const mulDiv = (a: bigint, b: bigint, denom: bigint) => {
  return (a * b) / denom;
};

function getTokenAmounts(
  liquidity: bigint,
  sqrtPriceX96: bigint,
  sqrtLower: bigint,
  sqrtUpper: bigint,
) {
  let amount0 = 0n;
  let amount1 = 0n;

  if (sqrtPriceX96 <= sqrtLower) {
    amount0 = mulDiv(
      liquidity << 96n,
      sqrtUpper - sqrtLower,
      sqrtUpper * sqrtLower,
    );
  } else if (sqrtPriceX96 < sqrtUpper) {
    amount0 = mulDiv(
      liquidity << 96n,
      sqrtUpper - sqrtPriceX96,
      sqrtUpper * sqrtPriceX96,
    );
    amount1 = mulDiv(liquidity, sqrtPriceX96 - sqrtLower, Q96);
  } else {
    amount1 = mulDiv(liquidity, sqrtUpper - sqrtLower, Q96);
  }

  return { amount0, amount1 };
}

function tickToSqrtPriceX96(tick: number): bigint {
  const sqrt = Math.pow(1.0001, tick / 2);
  return BigInt(Math.floor(sqrt * 2 ** 96));
}

// ts-unused-exports:disable-next-line
export async function GET() {
  try {
    const vestedBalance = await clientBase.readContract({
      abi: ERC20_ABI,
      functionName: 'balanceOf',
      args: [VESTING_CONTRACT_ADDRESS],
      address: IDRISS_TOKEN_ADDRESS,
    });
    const vestedBalance2 = await clientBase.readContract({
      abi: ERC20_ABI,
      functionName: 'balanceOf',
      args: [VESTING_V2_CONTRACT_ADDRESS],
      address: IDRISS_TOKEN_ADDRESS,
    });
    const daoBalance = await clientBase.readContract({
      abi: ERC20_ABI,
      functionName: 'balanceOf',
      args: [DAO_TREASURY_ADDRESS],
      address: IDRISS_TOKEN_ADDRESS,
    });
    const teamBalance = await clientBase.readContract({
      abi: ERC20_ABI,
      functionName: 'balanceOf',
      args: [TEAM_TREASURY_ADDRESS],
      address: IDRISS_TOKEN_ADDRESS,
    });
    const airdropBalance = await clientBase.readContract({
      abi: ERC20_ABI,
      functionName: 'balanceOf',
      args: [AIRDROP_TREASURY_ADDRESS],
      address: IDRISS_TOKEN_ADDRESS,
    });
    const aeroPoolBalance = await clientBase.readContract({
      abi: ERC20_ABI,
      functionName: 'balanceOf',
      args: [AERO_POOL_ADDRESS],
      address: IDRISS_TOKEN_ADDRESS,
    });
    const [
      _nonce,
      _operator,
      _token0,
      _token1,
      _fee,
      tickLower,
      tickUpper,
      liquidity,
      _feeGrowthInside0,
      _feeGrowthInside1,
      _tokensOwed0,
      _tokensOwed1,
    ] = await clientBase.readContract({
      address: POSITION_MANAGER,
      abi: UNISWAP_MINIMIZED_ABI,
      functionName: 'positions',
      args: [DAO_LIQUIDITY_ID],
    });

    const [sqrtPriceX96] = await clientBase.readContract({
      address: POOL_ADDRESS,
      abi: POOL_ABI,
      functionName: 'slot0',
    });

    const sqrtLower = tickToSqrtPriceX96(tickLower);
    const sqrtUpper = tickToSqrtPriceX96(tickUpper);

    const { amount0 } = getTokenAmounts(
      liquidity,
      sqrtPriceX96,
      sqrtLower,
      sqrtUpper,
    );

    const totalCirculatingSupply =
      TOTAL_SUPPLY -
      vestedBalance -
      vestedBalance2 -
      daoBalance -
      teamBalance -
      airdropBalance -
      aeroPoolBalance -
      amount0;

    const formattedBalance = formatEther(totalCirculatingSupply);
    return NextResponse.json(
      { result: formattedBalance },
      { status: 200, headers: DEFAULT_HEADERS },
    );
  } catch (error) {
    console.error('[ERROR] Failed fetching balances:', error);

    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500, headers: DEFAULT_HEADERS },
    );
  }
}
