import * as signalR from "@microsoft/signalr";

enum HubMethods {
    sendMark = "sendMark" // (number i, number j)
}

enum HubCallbackMethods {
    broadcastBoardStatus = "broadcastBoardStatus" // (number i, number j)
}

export class HubConnectionService {
    connection = new signalR.HubConnectionBuilder()
        .withUrl('http://localhost:32768/game')
        .build();
    receiveBoardStatus: (board: string[][]) => void = () => { };


    constructor() {
        this.connection.on(HubCallbackMethods.broadcastBoardStatus, (board) => this.receiveBoardStatus(board));
    }

    start() {
        this.connection.start()
            .then(() => console.log('connection started'))
            .catch(error => console.error(error.message));
    }

    onReceiveBoardStatus(newMethod: (board: string[][]) => void) {
        this.receiveBoardStatus = newMethod;
    }

    sendMark(i: number, j: number) {
        this.connection.invoke(HubMethods.sendMark, i, j);
    }
}