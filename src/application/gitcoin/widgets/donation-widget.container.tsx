import { memo, useEffect, useMemo, useState } from 'react';

import { useTwitterScraping } from 'host/twitter';
import { ErrorBoundary } from 'shared/observability';
import { useCommandQuery } from 'shared/messaging';
import { GetTokenPriceCommand } from 'shared/web3';

import { GetApplicationsCommand } from '../commands';
import { Application } from '../types';
import { selectTwitterApplications } from '../utils';
import { GET_ETH_PER_DOLLAR_COMMAND_DETAILS } from '../constants';

import { DonationWidget } from './donation-widget';

interface Properties {
  handle?: string;
}

export const DonationWidgetContainer = memo(({ handle }: Properties) => {
  const getApplicationsQuery = useCommandQuery({
    command: new GetApplicationsCommand({}),
    select: selectTwitterApplications,
    placeholderData: (previousData) => {
      return previousData;
    },
  });

  const getEthPerDollarQuery = useCommandQuery({
    command: new GetTokenPriceCommand(GET_ETH_PER_DOLLAR_COMMAND_DETAILS),
    refetchInterval: 60_000,
    select: (v) => {
      return Number(v.price);
    },
  });

  const { users } = useTwitterScraping();

  const applications = useMemo(() => {
    if (!getApplicationsQuery.data) {
      return [];
    }

    return users
      .map((result) => {
        const application = getApplicationsQuery.data.find((application) => {
          return (
            application.project.metadata.projectTwitter?.toLowerCase() ===
            result.value.toLowerCase()
          );
        });

        if (!application) {
          return;
        }

        return { ...result, application };
      })
      .filter(Boolean);
  }, [getApplicationsQuery.data, users]);

  const [handleApplication, setHandleApplication] = useState<{
    application: Application;
    node: Element;
    username: string;
    top: number;
  }>();

  useEffect(() => {
    if (!handle) {
      return;
    }
    const foundApplication = getApplicationsQuery.data?.find((application) => {
      return (
        application.project.metadata.projectTwitter?.toLowerCase() ===
        handle.toLowerCase()
      );
    });

    const spans = document.querySelectorAll('[data-testid="UserName"] span');
    const mainUserName = document.querySelector(
      '[data-testid="UserName"] span',
    );

    // eslint-disable-next-line unicorn/prefer-spread
    const username = Array.from(spans)
      .find((element) => {
        return element.textContent?.startsWith('@');
      })
      ?.textContent?.slice(1);

    if (!foundApplication || !mainUserName || !username) {
      return;
    }
    setHandleApplication({
      application: foundApplication,
      top: 0,
      username: username,
      node: mainUserName,
    });

    return () => {
      setHandleApplication(undefined);
    };
  }, [getApplicationsQuery.data, handle]);

  if (!getEthPerDollarQuery.data) {
    return null;
  }

  return (
    <>
      {handleApplication ? (
        <DonationWidget
          ethPerDollar={getEthPerDollarQuery.data}
          application={handleApplication.application}
          username={handleApplication.username}
          node={handleApplication.node as HTMLElement}
          iconSize={22}
        />
      ) : null}
      {applications.map(({ node, value, application, top }) => {
        return (
          <ErrorBoundary
            key={`${value}-${top}`}
            exceptionEventName="gitcoin-donation-widget"
          >
            <DonationWidget
              ethPerDollar={getEthPerDollarQuery.data}
              application={application}
              username={value}
              node={node as HTMLElement}
              iconSize={16}
            />
          </ErrorBoundary>
        );
      })}
    </>
  );
});

DonationWidgetContainer.displayName = 'DonationWidgetContainer';
