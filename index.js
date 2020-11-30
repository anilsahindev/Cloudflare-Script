const settings = {
    email: 'your@email',
    key: 'your_api_key',
    domain: 'domain.example'
}

(async() => {
    const cloudflare = require('cloudflare')({email: settings.email, key: settings.key});
    const zone_id = await cloudflare.zones.browse().then(zones => zones.result.find(x => x.name === settings.domain).id);
    const info = await cloudflare.dnsRecords.browse(zone_id).then(x => x.result_info);
    console.log(`Pages to delete: ${info.total_pages}`);
    for ( let value of info.total_pages ){
        const dns_records = await cloudflare.dnsRecords.browse(zone_id).then(x => x.result.map(dns_record => dns_record.id));
        await Promise.all(dns_records.map(id => cloudflare.dnsRecords.del(zone_id, id)));
        console.log(`Page ${i+1} is deleted remained ${info.total_pages-i} pages`);            
    }
})();
