const fs = require("fs");
const http = require("http");
const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`)
  switch (url.pathname) {
    case '/':
      if ('GET') {
        const name = url.searchParams.get('name')
        res.writeHead(200, {
          'Content-Type':'text/html'
        })
        fs.createReadStream('index.html').pipe(res)
      } else if ('POST') {
        handlePostResponse(req, res)
        break;
      }
  default:
    res.writeHead(404, {
      'Content-type':'text/html'
    })
    fs.createReadStream('404.html').pipe(res)
    break;
  }
});

server.listen(4001, () => {
  console.log(server.address().port)
})

function handlePostResponse(request, response) {
  request.setEncoding("utf8");

  // Receive chunks on 'data' event and concatenate to body variable
  let body = "";
  request.on("data", function (chunk) {
    body += chunk;
  });

  request.on("end", function () {
    const choices = ["rock", "paper", "scissors"];
    const randomChoice = choices[Math.floor(Math.random() * 3)];

    const choice = body;

    let message;

    const tied = `Aww, we tied! I also chose ${randomChoice}.`;
    const victory = `Dang it, you won! I chose ${randomChoice}.`;
    const defeat = `Ha! You lost. I chose ${randomChoice}.`;

    if (choice === randomChoice) {
      message = tied;
    } else if (
      (choice === "rock" && randomChoice === "paper") ||
      (choice === "paper" && randomChoice === "scissors") ||
      (choice === "scissors" && randomChoice === "rock")
    ) {
      message = defeat;
    } else {
      message = victory;
    }
    response.writeHead(200, { "Content-Type": "text/plain" });
    response.end(`You selected ${choice}. ${message}`);
  });
}