import { Card, CardBody, CardHeader } from '@idriss-xyz/ui/card';

import { Banner } from '@/app/creators/components/banner';

// ts-unused-exports:disable-next-line
export default function DonationPanel() {
  return (
    <Card>
      <CardHeader>
        <h1 className="pb-1 text-heading4 text-neutralGreen-900">
          Download your donation panel image
        </h1>
        <hr />
      </CardHeader>
      <CardBody>
        <Banner />
      </CardBody>
    </Card>
  );
}
