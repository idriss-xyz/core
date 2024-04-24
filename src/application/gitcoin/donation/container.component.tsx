import { memo, useEffect, useMemo, useState } from 'react';

import { useTwitterUsersPooling } from 'shared/twitter';
import { ErrorBoundary } from 'shared/monitoring';

import { useGetApplicationsCommand } from './commands';
import { selectTwitterApplications } from './donation.library';
import { DonationWidget } from './components';
import { Application } from './donation.types';

interface Properties {
  handle?: string;
}

export const GitcoinDonationWidget = memo(({ handle }: Properties) => {
  const getApplicationsQuery = useGetApplicationsCommand({
    select: selectTwitterApplications,
  });

  const { results } = useTwitterUsersPooling();

  const applications = useMemo(() => {
    if (!getApplicationsQuery.data) {
      return [];
    }

    return results
      .map((result) => {
        const application = getApplicationsQuery.data.find((application) => {
          return (
            application.project.metadata.projectTwitter?.toLowerCase() ===
            result.username.toLowerCase()
          );
        });

        if (!application) {
          return;
        }

        return { ...result, application };
      })
      .filter(Boolean);
  }, [getApplicationsQuery.data, results]);

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

  return (
    <>
      {handleApplication ? (
        <DonationWidget {...handleApplication} iconSize={22} />
      ) : null}
      {applications.map((application) => {
        return (
          <ErrorBoundary
            key={`${application.username}-${application.top}`}
            exceptionEventName="gitcoin-donation-widget"
          >
            <DonationWidget {...application} iconSize={16} />
          </ErrorBoundary>
        );
      })}
    </>
  );
});

GitcoinDonationWidget.displayName = 'GitcoinDonationWidgetContainer';
