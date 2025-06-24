import { Card, CardHeader, CardBody } from '@idriss-xyz/ui/card';

import { IDRISS_COIN } from '@/assets';

export default function Home() {
  return (
    <div className="grid grid-cols-3 gap-4">
      <h1 className="col-span-3 mb-4 text-heading3">Earnings</h1>
      <Card className="col-span-1">
        <CardHeader>Transactions</CardHeader>
        <CardBody>
          <div className="flex items-center justify-center p-14">
            <img src={IDRISS_COIN.src} alt="coin" />
          </div>
        </CardBody>
      </Card>
      <Card className="col-span-1">
        <CardHeader>Total earnings</CardHeader>
      </Card>
      <Card className="col-span-1">
        <CardHeader>Earnings by token</CardHeader>
      </Card>
      <Card className="col-span-3">
        <CardBody>history</CardBody>
      </Card>
    </div>
  );
}
