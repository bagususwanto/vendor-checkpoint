import { SendHorizonal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CardFooter } from '@/components/ui/card';

interface ReviewActionsProps {
  onConfirm: () => void;
  isSubmitting: boolean;
}

export function ReviewActions({ onConfirm, isSubmitting }: ReviewActionsProps) {
  return (
    <CardFooter className="px-4 sm:px-6 pb-6">
      <Button
        type="button"
        className="w-full h-12 sm:h-14 text-sm sm:text-base"
        onClick={onConfirm}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Mengirim...' : 'Submit'}
        <SendHorizonal className="ml-2 w-5 h-5 sm:w-6 sm:h-6" />
      </Button>
    </CardFooter>
  );
}
