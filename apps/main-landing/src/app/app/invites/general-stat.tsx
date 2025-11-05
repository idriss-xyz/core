import { Card, CardBody, CardHeader } from '@idriss-xyz/ui/card';

type Properties = {
  header: string;
  stat: string;
};

// ts-unused-exports:disable-next-line
export default function GeneralStatCard({ header, stat }: Properties) {
  return (
    <Card className="col-span-1">
      <CardHeader className="text-label3 text-neutral-900">
        {header}
      </CardHeader>
      {/* centre content and wrap it with the “glow” circle */}
      <CardBody className="flex size-full items-center justify-center">
        <div
          className="
            flex h-[96px] w-[94px] items-center justify-center
            rounded-[1200px]
            bg-[linear-gradient(0deg,rgba(255,255,255,0.25)_0%,rgba(255,255,255,0.05)_100%)]
            opacity-100
          "
          style={{
            borderTopLeftRadius: 1000,
            borderTopRightRadius: 1000,
            borderBottomRightRadius: 1200,
            borderBottomLeftRadius: 1200,
          }}
        >
          <h3 className="text-heading4 text-neutralGreen-900">{stat}</h3>
        </div>
      </CardBody>
    </Card>
  );
}
