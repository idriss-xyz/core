import { Banner } from '@/app/creators/components/banner';
import { Card, CardBody, CardHeader } from '@idriss-xyz/ui/card';

// ts-unused-exports:disable-next-line
export default function DonationPanel() {
  return (
    <Card>
      <CardHeader className="text-heading4">
        <h1></h1>Download your donation panel image
        <hr />
      </CardHeader>
      <CardBody>
        <Banner />
      </CardBody>
    </Card>
  );
}
