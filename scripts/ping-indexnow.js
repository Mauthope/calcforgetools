async function triggerIndexNow() {
  console.log('📡 Fetching live sitemap from https://calcforgetools.com/sitemap.xml...');
  
  try {
    const sitemapRes = await fetch('https://calcforgetools.com/sitemap.xml');
    if (!sitemapRes.ok) {
        throw new Error(`Failed to fetch sitemap. Status: ${sitemapRes.status}`);
    }
    const sitemapData = await sitemapRes.text();

    const matches = [...sitemapData.matchAll(/<loc>(.*?)<\/loc>/g)];
    const urls = matches.map(m => m[1]);

    if (urls.length === 0) {
      console.log('⚠️ No URLs found in sitemap! Cannot ping IndexNow.');
      return;
    }

    console.log(`✅ Found ${urls.length} URLs.`);
    console.log('🚀 Sending Bulk Submission to IndexNow...');

    const payload = {
      host: 'calcforgetools.com',
      key: '437efe81d5e240828574764422ca460d',
      keyLocation: 'https://calcforgetools.com/437efe81d5e240828574764422ca460d.txt',
      urlList: urls
    };

    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(payload)
    });

    console.log(`🎯 IndexNow Response Status: ${res.status}`);
    if (res.status === 200 || res.status === 202) {
      console.log('🟢 Success! Search engines have been pinged.');
    } else {
      console.log('🔴 Unexpected Status. Response body:');
      const text = await res.text();
      console.log(text);
    }
  } catch (error) {
    console.error('❌ Failed to ping IndexNow:', error.message);
  }
}

triggerIndexNow();
