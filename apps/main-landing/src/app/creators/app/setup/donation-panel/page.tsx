import { Card, CardBody, CardHeader } from '@idriss-xyz/ui/card';

import { Banner } from '@/app/creators/components/banner';

// ts-unused-exports:disable-next-line
export default function DonationPanel() {
  return (
    <Card>
      <CardHeader className="text-heading4">
        <h1>Download your donation panel image</h1>
        <hr />
      </CardHeader>
      <CardBody>
        <Banner />
      </CardBody>
    </Card>
  );
}
