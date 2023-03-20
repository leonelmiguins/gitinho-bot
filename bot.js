//criado por: Leonel Miguins, 2023

const { Client, LocalAuth } = require('whatsapp-web.js');
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
    console.log('Gitinho bot rodando!');
});

client.on('group_join', (notification) => {
    let wellcome = readFile('./txt/wellcome.txt')
    notification.reply(wellcome);
});


client.on('message', async (msg) => {
    
    if(msg.body === '$menu' || msg.body === '$start'){
        let data = readFile('./txt/main.txt')
        msg.reply(data);
    }

    if(msg.body === '$rules') {
        let data = readFile('./txt/rules.txt')
        msg.reply(data);
    }

    if(msg.body === '$about') {
        let data = readFile('./txt/about.txt')        
        msg.reply(data);
    }

    if(msg.body === '$gits') {
        let data = readFile('./txt/githubs.txt')        
        msg.reply(data);
    }

    if(msg.body === '$proj') {
        let data = readFile('./txt/projects.txt')        
        msg.reply(data);
    }

    if(msg.body === '$proj-add') { 
        let data = readFile('./txt/add-proj.txt')     
        msg.reply(data);
    }

    if(msg.body === '$git-add') { 
        let data = readFile('./txt/add-git.txt')        
        msg.reply(data);
    }

    if(msg.body === '$links') { 
        let data = readFile('./txt/links.txt')   
        msg.reply(data);
    }

    if(msg.body.includes('https://github.com/') && msg.body.includes('$git-info')) {
        let username = msg.body.substring(29)
        let userInfo = getProfileGithub(username);
        let text = `👤 *user:* ${(await userInfo).username}\n
                    📕 *bio:* ${(await userInfo).bio}\n
                    🌎 *location:* ${(await userInfo).location}\n
                    👥 *followers:* ${(await userInfo).followers}\n
                    📦 *repositories:* ${(await userInfo).publicRepos}`
        msg.reply(text)
    }

    if (msg.body.includes('https://github.com/') && msg.body.includes('$git-add')) {
        const tel = ((await msg.getContact()).id._serialized).substring(0, 12);
        const link = msg.body.substring(9);
        const data = await readFile('./txt/githubs.txt', 'utf-8');
      
        if (data.includes(link)) {
          msg.reply('*⚠ Esse perfil já está cadastrado em nossa base de dados!*');
        } else {
          const username = msg.body.substring(28);
          const userInfo = await getProfileGithub(username);
          const newEntry = `➥ user: *${userInfo.username}*\ngit: ${link} tel: *+${tel}*`;
          const newData = data + '\n' + newEntry;
          await writeFile('./txt/githubs.txt', newData);
          msg.reply('*✅ Perfil adicionado com sucesso!*');
        }
    }

    if (msg.body.includes('https://wa.me/') || msg.body.includes('chat.whatsapp.com/')) {

       //excluir menssagens de membros que mandam links de outros canais
       client.sendMessage(msg.from, '*⚠ Proibido enviar links de grupos sem permissão !*');
       msg.delete(true);

       //banindo quem enviou o link
       //let membro_id = (await msg.getContact()).id._serialized
       //console.log(membro_id)
       //let chat = await msg.getChat();
       //let chat_id = chat.id._serialized;
 
       //chat = await client.getChatById(chat_id);
       //await chat.removeParticipants([membro_id]);
    }

});

//função para ler arquivos
function readFile(file){
    let dados = fs.readFileSync(file, "utf8");
    fs.close;
    return dados;
}

//função para escrever arquivos
function writeFile(arq, data) {
fs.writeFile(arq, data, (err) => {
    if (err) throw err;
    });
}

function getProfileGithub(user) {
    return fetch(`https://api.github.com/users/${user}`)
    .then(response => response.json())
    .then(data => {
        let userInfo = {
            username: data['name'],
            location: data['location'],
            bio: data['bio'],
            avatarUrl: data['avatar_url'],
            publicRepos: data['public_repos'],
            followers: data['followers'],
        };
        return userInfo;
    });
}



