import { NextResponse } from 'next/server';
import { formatEther } from 'viem';
import { clientBase } from '@idriss-xyz/blockchain-clients';

import { IDRISS_TOKEN_ADDRESS } from '@/components/token-section/constants';
import { ERC20_ABI } from '@/app/creators/donate/constants';
import {
  VESTING_CONTRACT_ADDRESS,
  DAO_TREASURY_ADDRESS,
  TEAM_TREASURY_ADDRESS,
  AIRDROP_TREASURY_ADDRESS,
  TOTAL_SUPPLY,
} from '@/constants';

const DEFAULT_HEADERS = {
  'Access-Control-Allow-Origin': '*',
};

// ts-unused-exports:disable-next-line
export async function GET() {
  try {
    const vestedBalance = await clientBase.readContract({
      abi: ERC20_ABI,
      functionName: 'balanceOf',
      args: [VESTING_CONTRACT_ADDRESS],
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
    const totalCirculatingSupply =
      TOTAL_SUPPLY - vestedBalance - daoBalance - teamBalance - airdropBalance;
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
