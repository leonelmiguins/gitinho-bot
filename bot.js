//criado por: Leonel Miguins, 2023

const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const console = require('console');

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


client.on('message', async (msg) => {

    if(msg.body === '$menu' || msg.body === '$start'){
        let data = readFile('./menus/main.txt')
        msg.reply(data);
    }

    if(msg.body === '$rules'){
        let data = readFile('./menus/rules.txt')
        msg.reply(data);
    }

    if(msg.body === '$about'){
        let data = readFile('./menus/about.txt')        
        msg.reply(data);
    }

    if(msg.body === '$gits'){
        let data = readFile('./menus/githubs.txt')        
        msg.reply(data);
    }

    if(msg.body === '$proj'){
        let data = readFile('./menus/projects.txt')        
        msg.reply(data);
    }

    if(msg.body === '$add-proj'){ 
        let data = readFile('./menus/add-proj.txt')     
        msg.reply(data);
    
    }

    if(msg.body === '$add-git'){ 
        let data = readFile('./menus/add-git.txt')        
        msg.reply(data);
    
    }

    if(msg.body.includes('https://github.com/') && msg.body.includes('$add-git')){
        let tel = ((await msg.getContact()).id._serialized).substring(0, 12);
        let link = msg.body.substring(9);
        let data = readFile('./menus/githubs.txt');

        if(data.includes(link)){
          msg.reply('*⚠ Esse perfil já está cadastrado em nossa base de dados!*')

        }else{
            let username = msg.body.substring(28)
            data = data+`\n ➥ user: *${username}*\ngit: ${link} tel: *+*96.${tel}*`;
            writeFile('./menus/githubs.txt', data);
            msg.reply('*✅ Perfil adicionado com sucesso!*')
        }

    }

    if (msg.body.includes('https://wa.me/') || msg.body.includes('chat.whatsapp.com/')) {

       //excluir menssagens de membros que mandam links de outros canais
       client.sendMessage(msg.from, '*⚠ Proibido enviar links de grupos sem permissão !*');
       msg.delete(true);

       //banindo quem enviou o link
       const membro_id = (await msg.getContact()).id._serialized
       console.log(membro_id)
       let chat = await msg.getChat();
       let chat_id = chat.id._serialized;
 
       chat = await client.getChatById(chat_id);
       await chat.removeParticipants([membro_id]);
    }

});

//função para ler arquivos
function readFile(file){
    let dados = fs.readFileSync(file, "utf8");
    fs.close;
    return dados;
}

function writeFile(arq, data) {
fs.writeFile(arq, data, (err) => {
    if (err) throw err;
    });
}