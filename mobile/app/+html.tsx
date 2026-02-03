import { ScrollViewStyleReset } from 'expo-router/html';

// This file is web-only and used to configure the root HTML for every
// web page during static rendering.
// The contents of this function only run in Node.js environments and
// do not have access to the DOM or browser APIs.
export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, maximum-scale=1, user-scalable=no" />
        <title>Plainly - The Tool Hub</title>
        <meta name="theme-color" content="#000000" />

        {/* 
          Disable body scrolling on web. This makes ScrollView components work closer to how they do on native. 
          However, body scrolling is often nice to have for mobile web. If you want to enable it, remove this line.
        */}
        <ScrollViewStyleReset />

        {/* Mobile phone simulator styles for web preview */}
        <style dangerouslySetInnerHTML={{ __html: mobilePreviewStyles }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

const mobilePreviewStyles = `
* {
  box-sizing: border-box;
}
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
  background-color: #0a0908;
  overflow: hidden;
}
body {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #0a0908 50%, #16213e 100%);
}
#root {
  width: 100%;
  max-width: 430px;
  height: 100vh;
  max-height: 932px;
  background-color: #000000;
  overflow: hidden;
  position: relative;
}
@media (min-width: 500px) {
  #root {
    border-radius: 44px;
    margin: 20px;
    height: calc(100vh - 40px);
    box-shadow: 
      0 25px 80px rgba(0, 0, 0, 0.6),
      0 0 0 12px #1a1a1a,
      0 0 0 14px #333,
      inset 0 0 2px rgba(255,255,255,0.05);
  }
  #root::before {
    content: '';
    position: absolute;
    top: 12px;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 28px;
    background: #1a1a1a;
    border-radius: 20px;
    z-index: 9999;
  }
}
@media (max-width: 499px) {
  body {
    background: #000000;
  }
  #root {
    max-width: 100%;
    max-height: 100%;
    border-radius: 0;
  }
}
::-webkit-scrollbar {
  width: 0;
  height: 0;
}
`;
