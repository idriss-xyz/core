import { Card, CardBody, CardHeader } from '@idriss-xyz/ui/card';

import { GradientCircle } from '@/app/components/invite-section';

type Properties = {
  header: string;
  stat: string;
};

// ts-unused-exports:disable-next-line
export default function GeneralStatCard({ header, stat }: Properties) {
  return (
    <Card className="col-span-1 space-y-3">
      <CardHeader className="text-label3 text-neutral-900">{header}</CardHeader>
      <CardBody className="flex items-center justify-center">
        <div className="relative flex size-24 items-center justify-center">
          <GradientCircle className="size-full" />
          <h3 className="absolute text-heading4 text-neutral-900">{stat}</h3>
        </div>
      </CardBody>
    </Card>
  );
}
