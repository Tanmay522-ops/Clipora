import { Button } from '@/components/ui/button'
import Loader from '../loader'
import { useSubscription } from '@/hooks/useSubscription'

type Props = {}

const PaymentButton = (props: Props) => {

    const {onSubscribe, isProcessing} = useSubscription()

    return (
        <Button className="text-sm w-full "
            onClick={onSubscribe}>
            <Loader
                color="#000"
                loading={isProcessing}
            >
                Upgrade
            </Loader>
        </Button>
    )
}

export default PaymentButton