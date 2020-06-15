import * as signalR from "@microsoft/signalr";
import { Player } from "../models/Player";
import { TicTacToeBoard } from "../models/TicTacToeBoard";

enum HubMethods {
    getPlayerUuid = "getPlayerUuid", // ()
    createRoom = "createRoom", // (player)
    joinRoom = "joinRoom", // (name, roomUuid)
    getBoard = "getBoard", // (roomUuid)
    startGame = "startGame", // (roomUuid)
    sendMark = "sendMark", // (number i, number j)
}

enum HubCallbackMethods {
    receivePlayerUuid = "playerUuid", // (uuid: number)
    roomCreated = "roomCreated", // ({name, id})
    onReceiveBoard = "board",
    startGame = "startGame", // ()
    broadcastBoardStatus = "broadcastBoardStatus", // (number i, number j)
    error = "error",  // (errorMessage)
}

export class HubConnectionService {
    connection = new signalR.HubConnectionBuilder()
        .withUrl('http://localhost:32769/game')
        .build();

    receiveBoardStatusCallback: (board: string[][]) => void = () => { };
    roomCreatedCallback: (room: { name: string, id: number }) => void = () => { };
    startGameCallback: () => void = () => { };
    receivePlayerUuid: (uuid: string) => void = () => { };
    receiveBoardCallback: (board: TicTacToeBoard) => void = () => { };

    constructor() {
        this.connection.on(HubCallbackMethods.receivePlayerUuid, (uuid) => this.receivePlayerUuid(uuid));
        this.connection.on(HubCallbackMethods.broadcastBoardStatus, (board) => this.receiveBoardStatusCallback(board));
        this.connection.on(HubCallbackMethods.roomCreated, (room) => this.roomCreatedCallback(room));
        this.connection.on(HubCallbackMethods.startGame, () => this.startGameCallback());
        this.connection.on(HubCallbackMethods.onReceiveBoard, (board) => this.receiveBoardCallback(board));
    }

    start(player: Player, board?: TicTacToeBoard, hostRoomUuid?: string) {
        if (this.connection.state == signalR.HubConnectionState.Connected ||
            this.connection.state == signalR.HubConnectionState.Connecting) {
            return;
        }

        this.connection.start()
            .then(() => {
                if (player.uuid === "") {
                    this.getPlayerUuid();
                }

                if (hostRoomUuid && !board) {
                    this.getBoard(hostRoomUuid);
                }
                console.log('connection started');
            }).catch(error => {
                console.error(error.message)
            });
    }

    getPlayerUuid() {
        this.connection.invoke(HubMethods.getPlayerUuid);
    }

    createRoom(player: Player) {
        this.connection.invoke(HubMethods.createRoom, player);
    }

    joinRoom(player: Player, roomUuid: string) {
        this.connection.invoke(HubMethods.joinRoom, player, roomUuid);
    }

    getBoard(roomUuid: string) {
        this.connection.invoke(HubMethods.getBoard, roomUuid);
    }

    startGame(roomUuid: string) {
        this.connection.invoke(HubMethods.startGame, roomUuid);
    }

    sendMark(i: number, j: number) {
        this.connection.invoke(HubMethods.sendMark, i, j);
    }

    onReceivePlayerUuid(method: (uuid: string) => void) {
        this.receivePlayerUuid = method;
    }

    onReceiveBoardStatus(method: (board: string[][]) => void) {
        this.receiveBoardStatusCallback = method;
    }

    onReceiveBoard(method: (board: TicTacToeBoard) => void) {
        this.receiveBoardCallback = method;
    }

    onRoomCreated(method: (room: { name: string, id: number }) => void) {
        this.roomCreatedCallback = method;
    }

    onStartGame(method: () => void) {
        this.startGameCallback = method;
    }
}