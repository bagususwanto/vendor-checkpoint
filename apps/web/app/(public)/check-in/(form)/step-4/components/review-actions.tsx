import { SendHorizonal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CardFooter } from '@/components/ui/card';

interface ReviewActionsProps {
  onConfirm: () => void;
  isSubmitting: boolean;
}

export function ReviewActions({ onConfirm, isSubmitting }: ReviewActionsProps) {
  return (
    <CardFooter>
      <Button
        size={'xl'}
        type="button"
        className="w-full"
        onClick={onConfirm}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Mengirim...' : 'Submit'}
        <SendHorizonal className="ml-2 size-6" />
      </Button>
    </CardFooter>
  );
}
