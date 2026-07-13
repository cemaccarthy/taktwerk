<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="default">
  <meta name="theme-color" content="#ffffff">
  <title>Taktwerk</title>
  <link rel="manifest" href="/taktwerk/manifest.json">
  <link rel="apple-touch-icon" href="/taktwerk/icon-192.png">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, system-ui, sans-serif; 
      background: #ffffff; 
      color: #1d1d1f;
      min-height: 100dvh; 
      padding: env(safe-area-inset-top) 16px calc(env(safe-area-inset-bottom) + 160px);
      display: flex;
      flex-direction: column;
      align-items: center;
      -webkit-user-select: none;
      user-select: none;
    }
    h1 { margin-bottom: 16px; }

    .tab-bar {
      display: flex;
      width: 100%;
      max-width: 300px;
      margin-bottom: 20px;
      border: 2px solid #000000;
      border-radius: 12px;
      overflow: hidden;
    }
    .tab-btn {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 12px;
      border: none;
      background: #ffffff;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      color: #1d1d1f;
      font-family: inherit;
      transition: background 0.15s ease, color 0.15s ease;
      -webkit-tap-highlight-color: transparent;
    }
    </script>
</body>
</html>
