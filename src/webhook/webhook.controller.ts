import { Controller, Post, Body, HttpCode } from '@nestjs/common';

@Controller('webhooks')
export class WebhookController {
  @Post('payment')
  @HttpCode(200)
  async handlePaymentWebhook(@Body() payload: any) {
    // Stub: Handle payment webhook
    await Promise.resolve();
    console.log('Payment Webhook:', payload);
    return { received: true };
  }
}
