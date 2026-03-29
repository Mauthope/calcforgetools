const https = require('https');

async function triggerIndexNow() {
  console.log('📡 Fetching live sitemap from https://calcforgetools.com/sitemap.xml...');
  
  try {
    const sitemapData = await new Promise((resolve, reject) => {
       https.get('https://calcforgetools.com/sitemap.xml', (res) => {
         let data = '';
         if (res.statusCode !== 200) {
           reject(new Error(`Failed to fetch sitemap. Status: ${res.statusCode}`));
           return;
         }
         res.on('data', chunk => data += chunk);
         res.on('end', () => resolve(data));
       }).on('error', reject);
    });

    const matches = [...sitemapData.matchAll(/<loc>(.*?)<\/loc>/g)];
    const urls = matches.map(m => m[1]);

    if (urls.length === 0) {
      console.log('⚠️ No URLs found in sitemap! Cannot ping IndexNow.');
      return;
    }

    console.log(`✅ Found ${urls.length} URLs.`);
    console.log('🚀 Sending Bulk Submission to IndexNow...');

    const payload = JSON.stringify({
      host: 'calcforgetools.com',
      key: '437efe81d5e240828574764422ca460d',
      keyLocation: 'https://calcforgetools.com/437efe81d5e240828574764422ca460d.txt',
      urlList: urls
    });

    // Pinging api.indexnow.org which syndicates to Bing, Yandex, etc.
    const req = https.request('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, (res) => {
       console.log(`🎯 IndexNow Response Status: ${res.statusCode}`);
       if (res.statusCode === 200 || res.statusCode === 202) {
         console.log('🟢 Success! Search engines have been pinged.');
       } else {
         console.log('🔴 Unexpected Status. Response body:');
         res.on('data', d => console.log(d.toString()));
       }
    });

    req.on('error', e => console.error('Error hitting IndexNow API:', e));
    req.write(payload);
    req.end();

  } catch (error) {
    console.error('❌ Failed to ping IndexNow:', error.message);
  }
}

triggerIndexNow();
