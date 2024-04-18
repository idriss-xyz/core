import {
  FailureResult,
  Handler,
  HandlerError,
  OkResult,
} from 'shared/messaging';
import { sendHandlerExceptionEvent } from 'shared/monitoring';

import {
  marketsQueryStateSchema,
  polymarketPagePropertiesSchema,
} from '../../polymarket.schema';

import { GetConditionIdCommand } from './get-condition-id.command';

const extractSlugFromHtml = (htmlString: string) => {
  const regex = /<meta\s+name="twitter:image"\s+content="[^"]*mslug=([^"&]+)"/i;

  const match = regex.exec(htmlString);
  return match?.[1];
};

const extractScriptContent = (htmlString: string, scriptId: string) => {
  // Regular expression to find the script tag with the specific id and extract its content
  // This regex accounts for variations in attribute ordering and spacing
  const regex = new RegExp(
    `<script[^>]*id=["']${scriptId}["'][^>]*>([\\s\\S]*?)<\\/script>`,
    'im',
  );

  // Execute the regex on the HTML string
  const match = regex.exec(htmlString);

  return match?.[1];
};

export class GetConditionIdHandler implements Handler<GetConditionIdCommand> {
  async handle(command: GetConditionIdCommand) {
    try {
      const twitterUrlShortenerResponse = await fetch(command.details.url, {
        redirect: 'manual', // TODO: is it needed?
      });
      const twitterUrlShortenerResponseText =
        await twitterUrlShortenerResponse.text();
      const eventUrlRegex = /https:\/\/polymarket\.com\/event\/[^\s"']+/g;
      const urlMatch = twitterUrlShortenerResponseText.match(eventUrlRegex);
      const url = urlMatch?.[0];
      if (!url) {
        return new FailureResult();
      }
      const polymarketResponse = await fetch(
        `https://www.idriss.xyz/fetch-data?url=${url}`,
      );
      const { text: polymarketHtml } = (await polymarketResponse.json()) as {
        text: string;
      };
      const openGraphSlug = extractSlugFromHtml(polymarketHtml);
      const scriptContent = extractScriptContent(
        polymarketHtml,
        '__NEXT_DATA__',
      );

      const nextDataJson = scriptContent
        ? JSON.parse(scriptContent)
        : undefined;

      if (!nextDataJson) {
        throw new HandlerError('Document does not __NEXT_DATA__ script tag');
      }

      const polymarketPageProperties =
        polymarketPagePropertiesSchema.parse(nextDataJson);

      const apiEventQuery =
        polymarketPageProperties.props.pageProps.dehydratedState.queries.find(
          (query) => {
            return query.queryKey[0] === '/api/event';
          },
        );

      if (!apiEventQuery) {
        throw new HandlerError(
          'Could not find api event query in page properties',
        );
      }

      const marketsQueryState = marketsQueryStateSchema.parse(
        apiEventQuery.state,
      );

      const marketForOpenGraphSlug = marketsQueryState.data.markets.find(
        (market) => {
          return market.slug === openGraphSlug;
        },
      );

      if (!marketForOpenGraphSlug) {
        throw new HandlerError('Could not find market for open graph slug');
      }

      return new OkResult(marketForOpenGraphSlug.conditionId);
    } catch (error) {
      await sendHandlerExceptionEvent(command);

      if (error instanceof HandlerError) {
        return new FailureResult(error.message);
      }

      return new FailureResult();
    }
  }
}
