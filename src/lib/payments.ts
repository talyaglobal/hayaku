import { createClient } from '@/lib/supabase-server'
import { stripe, convertToStripeAmount } from '@/lib/stripe'
import type Stripe from 'stripe'

export interface PaymentIntentData {
  orderId: string
  amount: number
  currency?: string
  metadata?: Record<string, string>
}

/**
 * Create a Stripe Payment Intent
 */
export async function createPaymentIntent(data: PaymentIntentData) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: convertToStripeAmount(data.amount),
      currency: data.currency || 'try',
      payment_method_types: ['card'],
      metadata: {
        order_id: data.orderId,
        ...data.metadata,
      },
    })

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    }
  } catch (error) {
    console.error('Error creating payment intent:', error)
    throw error
  }
}

/**
 * Store payment transaction in database
 */
export async function storePaymentTransaction(
  orderId: string,
  transactionData: {
    type: 'payment' | 'refund' | 'partial_refund' | 'chargeback'
    status: 'pending' | 'succeeded' | 'failed' | 'cancelled'
    amount: number
    currency: string
    provider: string
    providerTransactionId?: string
    providerFee?: number
    gatewayResponse?: any
    failureReason?: string
    processedAt?: Date
  }
) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('payment_transactions')
    .insert({
      order_id: orderId,
      type: transactionData.type,
      status: transactionData.status,
      amount: transactionData.amount,
      currency: transactionData.currency,
      provider: transactionData.provider,
      provider_transaction_id: transactionData.providerTransactionId,
      provider_fee: transactionData.providerFee,
      gateway_response: transactionData.gatewayResponse,
      failure_reason: transactionData.failureReason,
      processed_at: transactionData.processedAt?.toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.error('Error storing payment transaction:', error)
    throw error
  }

  return data
}

/**
 * Update order payment status
 */
export async function updateOrderPaymentStatus(
  orderId: string,
  paymentStatus: 'pending' | 'authorized' | 'paid' | 'partially_paid' | 'refunded' | 'voided'
) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('orders')
    .update({
      payment_status: paymentStatus,
      updated_at: new Date().toISOString(),
    })
    .eq('id', orderId)
    .select()
    .single()

  if (error) {
    console.error('Error updating order payment status:', error)
    throw error
  }

  return data
}

/**
 * Handle successful payment
 */
export async function handleSuccessfulPayment(
  orderId: string,
  paymentIntent: Stripe.PaymentIntent
) {
  try {
    // Store payment transaction
    await storePaymentTransaction(orderId, {
      type: 'payment',
      status: 'succeeded',
      amount: paymentIntent.amount / 100, // Convert from cents
      currency: paymentIntent.currency,
      provider: 'stripe',
      providerTransactionId: paymentIntent.id,
      providerFee: paymentIntent.application_fee_amount
        ? paymentIntent.application_fee_amount / 100
        : undefined,
      gatewayResponse: paymentIntent,
      processedAt: new Date(),
    })

    // Update order payment status
    await updateOrderPaymentStatus(orderId, 'paid')

    return { success: true }
  } catch (error) {
    console.error('Error handling successful payment:', error)
    throw error
  }
}

/**
 * Handle failed payment
 */
export async function handleFailedPayment(
  orderId: string,
  paymentIntent: Stripe.PaymentIntent,
  failureReason?: string
) {
  try {
    // Store payment transaction
    await storePaymentTransaction(orderId, {
      type: 'payment',
      status: 'failed',
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency,
      provider: 'stripe',
      providerTransactionId: paymentIntent.id,
      gatewayResponse: paymentIntent,
      failureReason: failureReason || paymentIntent.last_payment_error?.message,
      processedAt: new Date(),
    })

    // Update order payment status (keep as pending for retry)
    await updateOrderPaymentStatus(orderId, 'pending')

    return { success: true }
  } catch (error) {
    console.error('Error handling failed payment:', error)
    throw error
  }
}
