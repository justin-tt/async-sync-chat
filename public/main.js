const Nes = require('nes');
const $ = require('jquery');

const client = new Nes.Client('ws://localhost:4000');

const start = async() => {

  await client.connect();
  const handler = (update, flags) => {
    console.log('update');
    $('body').append('<div>' + JSON.stringify(update) + '</div>');
  }

  client.subscribe('/chat', handler);
}

start();

$("#submitmsg").click(function() {
  $.ajax({
    type: "POST",
    url: "/chat/post",
    data: {
      msg: $("#msg").val()
    },
    success: function() {},
  })
});
