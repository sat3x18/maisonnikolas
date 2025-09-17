import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { order, items, type } = await req.json()
    
    const webhookUrl = Deno.env.get('DISCORD_WEBHOOK_URL')
    if (!webhookUrl) {
      return new Response(
        JSON.stringify({ error: 'Webhook URL not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    let embed: any = {}

    if (type === 'order') {
      const itemsText = items.map((item: any) =>
        `• ${item.quantity}x ${item.product?.name || 'Product'} (${item.color || 'N/A'}, ${item.size || 'N/A'}) - ₾${item.price}`
      ).join('\n')

      embed = {
        title: '🛍️ New Order Received!',
        color: 0xD4AF37,
        fields: [
          { name: 'Order Number', value: order.order_number, inline: true },
          { name: 'Customer', value: `${order.customer_name} ${order.customer_surname}`, inline: true },
          { name: 'Total Amount', value: `₾${order.total_amount}`, inline: true },
          { name: 'Contact', value: `📞 ${order.customer_phone}\n🏙️ ${order.customer_city}`, inline: true },
          { name: 'Payment Method', value: order.payment_method, inline: true },
          { name: 'Address', value: order.customer_address, inline: false },
          { name: 'Items', value: itemsText, inline: false }
        ],
        timestamp: new Date().toISOString()
      }
    } else if (type === 'newsletter') {
      embed = {
        title: '📧 New Newsletter Subscription!',
        color: 0x1e3a8a,
        fields: [
          { name: 'Email', value: order.email, inline: true },
          { name: 'Subscribed At', value: new Date().toLocaleString(), inline: true }
          { name: 'Source', value: 'Tbilisi Wear Website', inline: true }
        ],
        timestamp: new Date().toISOString(),
        footer: { text: 'Newsletter Subscription' }
      }
    } else if (type === 'status_update') {
      const statusEmojis: { [key: string]: string } = {
        pending: '⏳',
        confirmed: '✅',
        shipped: '🚚',
        completed: '🎉',
        cancelled: '❌'
      }

      const statusColors: { [key: string]: number } = {
        pending: 0xFBBF24,
        confirmed: 0x3B82F6,
        shipped: 0x8B5CF6,
        completed: 0x10B981,
        cancelled: 0xEF4444
      }

      embed = {
        title: `${statusEmojis[order.status]} Order Status Updated`,
        color: statusColors[order.status] || 0x6B7280,
        fields: [
          { name: 'Order Number', value: order.order_number, inline: true },
          { name: 'Customer', value: `${order.customer_name} ${order.customer_surname}`, inline: true },
          { name: 'New Status', value: order.status.charAt(0).toUpperCase() + order.status.slice(1), inline: true },
          { name: 'Total Amount', value: `₾${order.total_amount}`, inline: true }
        ],
        timestamp: new Date().toISOString()
      }

      if (order.status === 'completed') {
        embed.fields.push({
          name: '📝 Review Link',
          value: `${Deno.env.get('SITE_URL') || 'https://your-site.com'}/review/${order.order_number}`,
          inline: false
        })
        embed.description = '✨ Order completed! Customer can now leave a review using the link above.'
      }
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ embeds: [embed] })
    })

    if (!response.ok) {
      throw new Error(`Webhook failed: ${response.status}`)
    }

    return new Response(
      JSON.stringify({ success: true }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})