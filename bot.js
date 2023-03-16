const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-extensions']}
});
  
client.initialize();

client.on('qr', (qr) => {
    console.log('Código QR Recebido!');
    qrcode.generate(qr, { small: true });
});
  
client.on('authenticated', () => {
    console.log('Sessão Autenticada!');
});

  
client.on('ready', () => {
    console.log(' rodando!');
});

//menssagem de boas-vindas ao novo membro
client.on('group_join', (notification) => {
    let wellcome = readFile('./menu/wellcome.txt')
    notification.reply(wellcome);
});

//menssagem de saida do grupo
    client.on('group_leave', (notification) => {
    console.log('--» membro saiu'); 
    let bye = readFile('./menu/bye.txt')
    notification.reply(bye);
});


client.on('message', async (msg) => {

    if(msg.body === '$menu' || msg.body === '$start'){
        let data = readFile('./menus/main.txt')
        msg.reply(data);

    }

    if(msg.body === '$regras'){
        let data = readFile('./menus/rules.txt')
        msg.reply(data);

    }

    if(msg.body === '$sobre'){
        let data = readFile('./menus/about.txt')        
        client.sendMessage(msg.from, data)

    }

    if(msg.body === '$gits'){
        let data = readFile('./menus/githubs.txt')        
        client.sendMessage(msg.from, data)

    }

    if(msg.body === '$projetos'){
        let data = readFile('./menus/projects.txt')        
        client.sendMessage(msg.from, data)

    }

});

//função para ler arquivos
function readFile(file){
    let dados = fs.readFileSync(file, "utf8");
     fs.close;
   
     return dados;
  }