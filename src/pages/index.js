import Head from 'next/head'
import Image from 'next/image'
import Router from 'next/router'
import Stripe from 'stripe'

/* Create asyncronous function */

export async function getServerSideProps(context) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', 
  {apiVersion: '2020-08-27'})

  const res = await stripe.prices.list({
    limit: 10,
    expand: ['data.product']
  })

  /* Set the price variable */

  const prices = res.data.filter(price => price.active)

  return {
    props: { prices }
  }
}

/* Products listed on Home screen */

export default function Home({prices}) {
  async function checkout() {
    const lineItems = [{
      price: prices[0].id,
      quantity: 1
    }]

    const res = await fetch('api/checkout', {
      method: 'POST',
      body: JSON.stringify({lineItems})
    })

    const data = await res.json()
    console.log(lineItems)
    console.log(data)
    Router.push(data.session.url)
  }

  return (
    <div>
      <div className='header'><h1>Caddy's Poo Factory</h1></div>
      <Head>
        <title>Caddy's Poo Factory</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {prices.map((price, index) => {
        return <div key={index}>{price.product.name}</div>
      })}
      <button onClick={checkout}>Checkout</button>
    </div>
  )
}
