import { Card, CardBody, CardHeader } from '@idriss-xyz/ui/card'
import { formatFiatValue } from '@idriss-xyz/utils'

type Props = {
  totalRewards: number
}

// ts-unused-exports:disable-next-line
export default function TotalRewardsCard({ totalRewards }: Props) {
  return (
    <Card className="col-span-1">
      <CardHeader className="text-label3 text-neutral-900">
        Total rewards
      </CardHeader>
      <CardBody className="flex size-full items-center">
        <h3 className='text-heading2 text-black'>{formatFiatValue(totalRewards)}</h3>
      </CardBody>
    </Card>
  )
}
