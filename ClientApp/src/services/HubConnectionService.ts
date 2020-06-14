import * as signalR from "@microsoft/signalr";

enum HubMethods {
    createRoom = "createRoom", // (roomName)
    joinRoom = "joinRoom", // (name, roomUuid)
    startGame = "startGame", // (roomUuid)
    sendMark = "sendMark", // (number i, number j)
}

enum HubCallbackMethods {
    roomCreated = "roomCreated", // ({name, id})
    startGame = "startGame", // ()
    broadcastBoardStatus = "broadcastBoardStatus", // (number i, number j)
    error = "error",  // (errorMessage)
}

export class HubConnectionService {
    connection = new signalR.HubConnectionBuilder()
        .withUrl('http://localhost:32770/game')
        .build();
    receiveBoardStatusCallback: (board: string[][]) => void = () => { };
    roomCreatedCallback: (room: { name: string, id: number }) => void = () => { };
    startGameCallback: () => void = () => { };

    constructor() {
        this.connection.on(HubCallbackMethods.broadcastBoardStatus,(board) => this.receiveBoardStatusCallback(board));
        this.connection.on(HubCallbackMethods.roomCreated,(room) => this.roomCreatedCallback(room));
        this.connection.on(HubCallbackMethods.startGame,() =>  this.startGameCallback());
    }

    start() {
        this.connection.start()
            .then(() => console.log('connection started'))
            .catch(error => console.error(error.message));
    }

    createRoom(name: string) {
        this.connection.invoke(HubMethods.createRoom, name);
    }

    joinRoom(name: string, roomUuid: string) {
        this.connection.invoke(HubMethods.joinRoom, name, roomUuid);
    }

    startGame(roomUuid: string) {
        this.connection.invoke(HubMethods.startGame, roomUuid);
    }

    sendMark(i: number, j: number) {
        this.connection.invoke(HubMethods.sendMark, i, j);
    }

    onReceiveBoardStatus(method: (board: string[][]) => void) {
        this.receiveBoardStatusCallback = method;
    }

    onRoomCreated(method: (room: { name: string, id: number }) => void) {
        this.roomCreatedCallback = method;
    }

    onStartGame(method: () => void) {
        this.startGameCallback = method;
    }
}