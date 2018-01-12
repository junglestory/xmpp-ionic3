import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Events } from 'ionic-angular';
import { Strophe } from 'strophe.js';
declare var Strophe:any;

export class Message {
    id: String;
    senderId: String;
    text: String;
    time: String;
}

@Injectable()
export class XMPPService {
  	private dismissObserver: any;
  	public dismiss: any;

	private BOSH_SERVICE: string = "http://localhost:7070/http-bind/";
	private CONFERENCE_SERVICE: string = "conference.localhost";
  	private connection: Strophe.Connection;
    private roomName: string = "";
 
	constructor(public events: Events) { 
		this.dismissObserver = null;
	    this.dismiss = Observable.create(observer => {
	        this.dismissObserver = observer;
	    });
    }

    /*Function
        Connects the client from the Jabber server.
      Parameters:
        (String) jid - Jabber id.
        (String) host - Host name.
        (String) pass - Password.
      Returns:
    */
	login(jid, host, pass) {
		this.connection = new Strophe.Connection(this.BOSH_SERVICE, { 'keepalive': true });
		this.connection.connect(jid + '@' + host, pass, (status)=>{
              this.onConnect(status);
            });
	}
    
    /*Function
        Disconnects the client from the Jabber server.
      Parameters:
      Returns:
    */ 
	logout() {
		this.connection.options.sync = true; // Switch to using synchronous requests since this is typically called onUnload.
        this.connection.flush();
        this.connection.disconnect();
	}

    /*Function
        Queries a room for a list of occupants
      Parameters:
      Returns:
        iq - Room info.
    */
	allRoster() {	
        this.connection.muc.init(this.connection);
        return new Promise<any>(resolve => {
            this.connection.muc.queryOccupants(this.CONFERENCE_SERVICE, function (msg) {
                let items = [];
                let rosters = msg.querySelectorAll('item');
                
                rosters.forEach(function(roster) {
                    items.push({
                        id: roster.getAttribute("jid"),
                        name: roster.getAttribute("name") || roster.getAttribute("jid"),
                        lastText: 'Available to Chat',
                        avata: 'assets/imgs/ben.png'
                    });
                });

                resolve(items);
            }, function (err) {
                console.log("rooms - error: " + err);
                console.log(err);
            })
        });
	}

    /*Function
        Create multi-user chat room.
      Parameters:
        (String) roomName - The multi-user chat room name.
      Returns:
      id - the unique id used to create the chat room.
    */
    create(roomName) {
        let nick = this.getNick();
        let roomId = this.timestamp();
        let roomJid = roomId + "@" + this.CONFERENCE_SERVICE
        let room = roomJid + "/" + nick;

        this.connection.muc.setStatus(roomId + "@" + this.CONFERENCE_SERVICE, nick, null, null);
        this.connection.muc.createInstantRoom(room, roomName, 
            function (status) {
                console.log("Succesfully created ChatRoom", status);
            }, function (err) {
                console.log("Error creating ChatRoom", status);
                console.log(err);
            });

        this.connection.muc.setRoomName(roomId + "@" + this.CONFERENCE_SERVICE, nick);
        this.setRoomName(roomName);

        return roomJid;
    }

    /*Function
        Join a multi-user chat room
      Parameters:
        (String) roomJid - The multi-user chat room to join.
      Returns:
    */
    join(roomJid) {
        this.connection.muc.join(roomJid, this.getNick(), null, null, null, null, null, null);
    }

    /*Function
        Send the message in the chat room.
      Parameters:
        (String) roomJid - The multi-user chat room id.
        (String) message - Send message.
      Returns:
    */
    sendMessage(roomJid, message) {
        this.connection.muc.groupchat(roomJid, message, null);
    }

    /*Function
        Send a mediated invitation.
      Parameters:
        (String) roomJid - The multi-user chat room name.
        (String) id - The invitation's receiver.
      Returns:
    */
    invite(roomJid, id) {
        if (id !== "") {
          this.connection.muc.invite(roomJid, id, "hi?");
        }
    }

    // Create timestamp for multi-user chat room id.
    timestamp() {
        return Math.floor(new Date().getTime() / 1000);
    }

    // Set room name.
    setRoomName(roomName) {
        this.roomName = roomName;
    }

    // Get room Name
    getRoomName() {
        return this.roomName;
    }

    // Parse nickname of jabber id.
    getNick() {
        let nick = this.connection.jid;
        nick = nick.substring(0, nick.indexOf('@'));
        return nick;
    }

    /*Function
        Connect XMPP.
      Parameters:    
      Returns:
        status - Status of connection.
    */
	onConnect(status) {
        var self = this;

        switch (status) {
            case Strophe.Status.CONNECTED:
                console.log('[Connection] Strophe is Connected');
                
                this.connection.addHandler((msg)=>{ self.onMessage(msg); return true;}, null, 'message', null, null, null);       
                this.connection.addHandler((stanza)=>{self.onSubscriptionRequest(stanza)}, null, "presence", "subscribe");

                this.dismissObserver.next("login");

                break;
            case Strophe.Status.ATTACHED:
                console.log('[Connection] Strophe is Attached');
                break;

            case Strophe.Status.DISCONNECTED:
                console.log('[Connection] Strophe is Disconnected');
                this.dismissObserver.next("logout");
                break;

            case Strophe.Status.AUTHFAIL:
                console.log('[Connection] Strophe is Authentication failed');
                break;

            case Strophe.Status.CONNECTING:
                console.log('[Connection] Strophe is Connecting');
                break;

            case Strophe.Status.DISCONNECTING:
                console.log('[Connection] Strophe is Disconnecting');
                break;

            case Strophe.Status.AUTHENTICATING:
                console.log('[Connection] Strophe is Authenticating');
                break;

            case Strophe.Status.ERROR:
            case Strophe.Status.CONNFAIL:
                console.log('[Connection] Failed (' + status + ')');
                break;

            default:
                console.log('[Connection] Unknown status received:', status);
                break;
        }
    };

    // Parse multi-chat room id.
    getParseRoomJid(id) {
        var pos = id.indexOf('/');

        if (pos > 0) {
            id = id.substring(0, pos);
        }

        return id;
    }

    // parse jabber id.
    getParseID(id) {
        var pos = id.indexOf('/');

        if (pos > 0) {
            id = id.substring(pos+1, id.length);
        }

        return id;
    }

    //When a new message is recieved
    onMessage(msg) {
        let message: Message;
        let from = msg.getAttribute('from');
        let type = msg.getAttribute('type');
        let elems = msg.getElementsByTagName('body');
        var delays = msg.getElementsByTagName('delay');
  
        if (type == "groupchat" && elems.length > 0) {            
            let body = elems[0];
            let textMsg = Strophe.getText(body);
            //let currentDate: Date;
            let currentDate = new Date();
            let date = currentDate.toLocaleTimeString().replace(/:\d+ /, ' ');

            // history
            if (delays.length > 0) {               
               let delay = delays[0];
               date = delay.getAttribute('stamp');
            }

            message = {
              id: this.getParseRoomJid(from),
              senderId: this.getParseID(from),
              text: textMsg,
              time: date
            };
        }

        this.events.publish('message', message);
    };

    onSubscriptionRequest(stanza) {
        console.log(stanza);
    }
}