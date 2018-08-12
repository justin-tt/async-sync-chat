const Hapi = require('hapi');
const Nes = require('nes');
const Path = require('path');

const server = new Hapi.Server({
  port: 4000,
  host: 'localhost',
  routes: {
    files: {
      relativeTo: Path.join(__dirname, 'public')
    }
  }
});

const start = async() => {

  await server.register(Nes);
  server.subscription('/chat');
  await server.register(require('vision'));
  await server.register(require('inert'));
  await server.register({
    plugin: require('good'),
    options: {
      reporters: {
        myConsoleReporter: [{
          module: 'good-console',
        }, 'stdout']
      }
    }
  });
  
  server.views({
    engines: {
      hbs: require('handlebars')
    },
    relativeTo: __dirname,
    path: './views',
    layoutPath: './views/layout',
    layout: true
  })

  server.route({
    method: 'GET',
    path: '/chat',
    handler: (request, h) => {
      return h.view('chat');
    }
  })
  
  server.route({
    method: 'GET',
    path: '/{filename}',
    handler: {
      file: function(request) {
        return request.params.filename;
      }
    }
  })

  server.route({
    method: 'POST',
    path: '/chat/post',
    handler: (request, h) => {
      // publish some stuff to all subscribers
      const msg = request.payload.msg;
      console.log(`chat/post ${msg}`);
      server.publish('/chat', { msg: msg });

      return h.response(request.payload.n).code(202);
    }
  })
  await server.start();
  console.log(`Server running at: ${server.info.uri}`);

};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
})

start();
