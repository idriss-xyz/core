import { Web3 } from 'web3';

import {
  Command,
  FailureResult,
  HandlerError,
  OkResult,
} from 'shared/messaging';

import { convertPhone, digestMessage, lowerFirst } from '../utils';
import {
  MULTIRESOLVER_ABI,
  MULTIRESOLVER_ADDRESS,
  regM,
  regPh,
  regT,
  walletTags,
} from '../constants';

interface Payload {
  identifier: string;
  twitterId?: string;
}

interface Response {
  input: string | undefined;
  result: Record<string, string>;
  twitterID?: string;
}

interface IDrissResult {
  hash: string;
  result: string;
}

interface MultiResolverMethods {
  getMultipleIDriss(hashes: string[]): { call: () => Promise<IDrissResult[]> };
}

export class GetResolvedAddressCommand extends Command<Payload, Response> {
  public readonly name = 'GetResolvedAddressCommand' as const;
  private web3;
  private multiResolver;

  constructor(public payload: Payload) {
    super();
    this.web3 = new Web3('https://polygon-rpc.com/');
    this.multiResolver = new this.web3.eth.Contract(
      MULTIRESOLVER_ABI,
      MULTIRESOLVER_ADDRESS,
    );
  }

  simpleResolve = async (
    identifier: string,
    coin = '',
    network = '',
    twitterId?: string,
  ) => {
    let twitterID;
    let identifierT;
    identifier = lowerFirst(identifier).replaceAll(' ', '');
    if (regPh.test(identifier)) {
      identifier = convertPhone(identifier);
    } else if (!regM.test(identifier) && !regT.test(identifier)) {
      throw new HandlerError(
        'Not a valid input. Input must start with valid phone number, email or @twitter handle.',
      );
    }
    if (regT.test(identifier)) {
      identifierT = identifier;
      identifier = twitterId ?? 'Not found';
      if (!identifier || identifier == 'Not found') {
        throw new HandlerError('Twitter handle not found.');
      }
      twitterID = true;
    }

    const digestedPromises: Record<string, string> = {};
    for (const [network_, coins] of Object.entries(walletTags)) {
      if (network && network_ != network) continue;
      for (const [coin_, tags] of Object.entries(coins)) {
        if (coin && coin_ != coin) continue;
        for (const [tag_, tag_key] of Object.entries(tags)) {
          if (tag_key && typeof tag_key === 'string') {
            digestedPromises[tag_] = await digestMessage(identifier + tag_key);
          }
        }
      }
    }

    const digestedMessages = Object.values(digestedPromises);

    if (!this.multiResolver.methods.getMultipleIDriss) {
      throw new HandlerError('Unable to access Web3 resolver');
    }

    // Cast the method call to the correct type
    const multiResolverMethods = this.multiResolver
      .methods as unknown as MultiResolverMethods;

    const resolvedPromises = await multiResolverMethods
      .getMultipleIDriss(digestedMessages)
      .call();

    const foundMatches: Record<string, string> = {};

    for (const object of resolvedPromises) {
      if (object.result && object.result !== '') {
        const hashKey = Object.keys(digestedPromises).find((key) => {
          return digestedPromises[key] === object.hash;
        });
        if (hashKey) {
          foundMatches[hashKey] = object.result;
        }
      }
    }

    return twitterID
      ? { input: identifierT, result: foundMatches, twitterID: identifier }
      : { input: identifier, result: foundMatches };
  };

  async handle() {
    try {
      const result = await this.simpleResolve(
        this.payload.identifier,
        undefined,
        undefined,
        this.payload.twitterId,
      );

      return new OkResult(result);
    } catch (error) {
      this.captureException(error);
      if (error instanceof HandlerError) {
        return new FailureResult(error.message);
      }

      return new FailureResult();
    }
  }
}
