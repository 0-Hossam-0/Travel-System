type PaymentEventStatus = "COMPLETED" | "FAILED";

interface PaymentEventPayload {
  paymentId: string;
  bookingId: string;
  status: PaymentEventStatus;
  method: string;
  amount: number;
}

type PaymentEventHandler = (payload: PaymentEventPayload) => Promise<void>;

class PaymentEventEmitter {
  private handlers: PaymentEventHandler[] = [];

  subscribe(handler: PaymentEventHandler) {
    this.handlers.push(handler);
  }

  async emit(payload: PaymentEventPayload) {
    for (const handler of this.handlers) {
      await handler(payload);
    }
  }
}

export const paymentEventEmitter = new PaymentEventEmitter();
