import * as signalR from "@microsoft/signalr";

export class HubConnectionService {
    connection = new signalR.HubConnectionBuilder()
        .withUrl('http://localhost:32768/game')
        .build();
    receiveMarkMethod: (i: number, j: number) => void = () => { };


    constructor() {
        this.connection.on("broadcastMessage", (i, j) => this.receiveMarkMethod(i, j));
    }

    start() {
        this.connection.start()
            .then(() => console.log('connection started'))
            .catch(error => console.error(error.message));
    }

    onReceiveMark(newMethod: (i: number, j: number) => void) {
        this.receiveMarkMethod = newMethod;
    }

    sendMark(i: number, j: number) {
        this.connection.invoke("send", i, j);
    }
}