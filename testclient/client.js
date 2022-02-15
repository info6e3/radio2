let connected = false;

socket = new WebSocket(`ws://localhost:5000`);

socket.onopen = () => {
    console.log('open');
    connected = true;
    let message = {
       event: 'connection'
    }
    socket.send(JSON.stringify((message)))
}
socket.onmessage = (event) => {
    console.log('message');
}
socket.onclose = () => {
    console.log('close');
}
socket.onerror = () => {
    console.log('error');
}