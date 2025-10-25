import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>PathFinder</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem' }}>
        <h1>PathFinder</h1>
        <p>Web app scaffold is live. Add your pages in web/pages and components in web/components.</p>
      </main>
    </>
  )
}
