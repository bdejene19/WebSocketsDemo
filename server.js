// KEY NOTE: need to be in debug to communicate with server while offline
// http => our raw server
const http = require('http');
// to create websocket;
const WebSocketServer = require("websocket").server;
let connection = null;
// will now create server using native http server and inject it into another library that will allow us to do websocket handshake
// creating server still requires req and res
const httpServer =  http.createServer((req, res)     => {
    console.log('request has been made')
})

// this is where we initialize the websocket, so need to create a new websocketserver object
// takes in a json 
const websocket = new WebSocketServer({
    "httpServer": httpServer // pass httpServer here to do handshake 
});

// now need an event for your websocket
websocket.on('request', req => {
    // now you decide if you want to accept this websocket from the client or not
    // can specify want you want => e.g. messagin (text), gaming, etc.
    // to accept anything, we pass in null
    // accept function sends back the switching function and we get a connection as a result
    connection = req.accept(null, req.origin) // you pass origin of request, therefore, can verify origin before accepting
    connection.on('open', () => console.log("web socket connection open")) // where you pass what your websocket does when it is opened
    connection.on('close', () => console.log('Websocket connection closed'))
    // the most important function is onmessage => if you receive a message you want to give the message to the client
    connection.on('message', message => {
        console.log(`Received message: ${message.utf8Data}`)
    })

    sendRandomEveryFive();


    /** 
     * This is the very basics of websockets => now you can run with it
     * the key is your connection => e.g. building a chat app -> would have to build an array of connections (when a new person joins you add their connection to the array)
     * 
     */


});
const PORT = 8080 || process.env.PORT;

// you can write websockets directly into into devtools chrome console 

httpServer.listen(PORT, () => console.log(`Server is running on port ${PORT}`));


// Websocket (WS) devtools protocol for console 
/**
 * let ws = new WebSocket("ws://localhost:8000")
 * ws.onmessage = message => console.log(`We have received message from server ${message.data}`) // now when message is sent from server this message will be consoled (can test by typing something into debug console (instead of terminal))
 */


 // lets now looks at how to build a function that sends a message (e.g. random number) to the client
 function sendRandomEveryFive() {
    connection.send(`Message: ${Math.random()}`);
    // want message to be reoccuring every 5 seconds => therefore use setTimeout
    setTimeout(sendRandomEveryFive, 5000);
    // now lets go to where websocket is accepted to run our function
 }