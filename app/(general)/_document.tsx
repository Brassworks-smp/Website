// pages/_document.tsx
import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';
import crypto from 'crypto';

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    // Nonce für diese Response generieren
    const nonce = crypto.randomBytes(16).toString('base64');
    return { ...initialProps, nonce };
  }

  render() {
    const { nonce } = this.props as any;

    const csp = `
      default-src 'self';
      base-uri 'self';
      frame-ancestors 'self';
      form-action 'self';
      block-all-mixed-content;
      upgrade-insecure-requests;
      img-src 'self' data: blob: https://cdn.discordapp.com https://*.discord.com;
      font-src 'self' data:;
      script-src 'self' 'nonce-${nonce}' https://cdn.discordapp.com https://*.discord.com;
      style-src 'self';
      connect-src 'self' https: wss: https://*.discord.com https://*.discordapp.com;
      object-src 'none';
      frame-src 'self' https://brassmap.572.at/ https://discord.com https://*.discord.com https://*.discordapp.com;
    `.replace(/\n/g, ' ');

    return (
      <Html>
        <Head>
          <meta httpEquiv="Content-Security-Policy" content={csp} />
        </Head>
        <body>
          <Main />
          <NextScript nonce={nonce} />
        </body>
      </Html>
    );
  }
}