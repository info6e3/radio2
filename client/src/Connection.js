class Connection {
    connected = false;
    socket;
    Start(_url){
        this.socket = new WebSocket(_url);

        this.socket.onopen = () => {
            if(!this.connected) {
                console.log('Подключено');
                this.connected = true;
            }
        }

        this.socket.onmessage = (event) => {
            console.log('Получено:');
            let message = JSON.parse(event.data);
            console.log(message);
        }

        this.socket.onclose = () => {
            console.log('Отключено');
        }

        this.socket.onerror = () => {
            console.log('Ошибка');
        }
    }

    Send(_data) {
        if(this.connected){
            const message = JSON.stringify(_data);
            this.socket.send(_data);
        }
    }

}

module.exports = Connection;