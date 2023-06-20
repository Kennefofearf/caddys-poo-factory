// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import Stripe from "stripe"

export default async function handler(req, res) {
  if {req.method !== 'POST'} {return res.status(405).json({message: 'POST method required'})}
  const body = JSON.parse(req.body)

  if {body.lineItems.length === 0} {return res.status(405).json(message: 'No items for selected.')}

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
      apiVersion: '2023-05-31'
    })

    const session = await stripe.checkout.sessions.create({
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel',
      lineItems: body.lineItems,
      mode: 'payment'
    })

    res.status(201).json({session})
  } catch (err) {
    res.status(500).send({message: err.message})
  }
}
