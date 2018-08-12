const Nes = require('nes');
const $ = require('jquery');

const client = new Nes.Client('ws://localhost:4000');

function makeId() {
  let id = "";
  const validChars = "abcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < 10; i++) {
    id += validChars.charAt(Math.floor(Math.random() * validChars.length));
  }
  return id;
}

const start = async() => {

  // create some identifying info in connect()?
  const id = makeId();
  console.log(id);
  await client.connect({
    id: id,
  });
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
