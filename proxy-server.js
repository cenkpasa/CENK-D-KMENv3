
const WebSocket = require('ws');
const net = require('net');

// WebSocket sunucusunu 8080 portunda başlat
const wss = new WebSocket.Server({ port: 8080 });

console.log('---------------------------------------------------------');
console.log('Personel Takip - Cihaz Bağlantı Köprüsü (Proxy Server)');
console.log('---------------------------------------------------------');
console.log('Durum: Çalışıyor (Port: 8080)');
console.log('Bekleniyor: Web arayüzünden bağlantı...');

wss.on('connection', ws => {
    console.log('>> Web arayüzü bağlandı.');
    let deviceSocket = null;

    ws.on('message', message => {
        try {
            const data = JSON.parse(message);

            // CİHAZA BAĞLANMA İSTEĞİ
            if (data.command === 'CONNECT') {
                if (deviceSocket) {
                    deviceSocket.destroy();
                }

                console.log(`>> Cihaza bağlanılıyor: ${data.ip}:${data.port}...`);
                
                deviceSocket = new net.Socket();
                
                deviceSocket.connect(parseInt(data.port), data.ip, () => {
                    console.log('<< Cihaz bağlantısı BAŞARILI.');
                    ws.send(JSON.stringify({ type: 'STATUS', status: 'CONNECTED' }));
                });

                deviceSocket.on('data', chunk => {
                    // Cihazdan gelen ham veriyi (binary/text) arayüze gönder
                    console.log(`<< Veri alındı (${chunk.length} byte)`);
                    ws.send(JSON.stringify({ 
                        type: 'DATA', 
                        data: chunk.toString('base64'), // Binary güvenliği için base64
                        raw: chunk.toString('utf-8')    // Okunabilir metin ise
                    }));
                });

                deviceSocket.on('close', () => {
                    console.log('<< Cihaz bağlantısı koptu.');
                    ws.send(JSON.stringify({ type: 'STATUS', status: 'DISCONNECTED' }));
                });

                deviceSocket.on('error', err => {
                    console.error('!! Cihaz hatası:', err.message);
                    ws.send(JSON.stringify({ type: 'ERROR', message: err.message }));
                });
            }

            // VERİ GÖNDERME İSTEĞİ (Cihaza komut yollama)
            if (data.command === 'SEND') {
                if (deviceSocket && !deviceSocket.destroyed) {
                    console.log('>> Cihaza komut gönderiliyor...');
                    // Örnek: ZKTeco bağlantı komutu veya metin tabanlı komut
                    // Not: Gerçek protokol binary ise Buffer kullanılmalı
                    deviceSocket.write(data.payload); 
                } else {
                    ws.send(JSON.stringify({ type: 'ERROR', message: 'Cihaz bağlı değil.' }));
                }
            }

            // BAĞLANTIYI KESME
            if (data.command === 'DISCONNECT') {
                if (deviceSocket) {
                    deviceSocket.destroy();
                    deviceSocket = null;
                }
                ws.send(JSON.stringify({ type: 'STATUS', status: 'DISCONNECTED' }));
            }

        } catch (e) {
            console.error('Hata:', e);
        }
    });

    ws.on('close', () => {
        console.log('>> Web arayüzü ayrıldı.');
        if (deviceSocket) {
            deviceSocket.destroy();
        }
    });
});
