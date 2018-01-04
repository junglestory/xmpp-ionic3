import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Events } from 'ionic-angular';
declare var Strophe:any;

@Injectable()
export class XMPPService {
  	private dismissObserver: any;
  	public dismiss: any;

	private BOSH_SERVICE: string = "http://localhost:7070/http-bind/";
	private CONFERENCE_SERVICE: string = "conference.localhost";
  	private connection: Strophe.Connection;
 
	constructor(public events: Events) { 
		this.dismissObserver = null;
	    this.dismiss = Observable.create(observer => {
	        this.dismissObserver = observer;
	    });
    }

	login(jid, host, pass) {
		this.connection = new Strophe.Connection(this.BOSH_SERVICE, { 'keepalive': true });
		this.connection.connect(jid + '@' + host, pass, (status)=>{
              this.onConnect(status);
            });
	}

	logout() {
		this.connection.options.sync = true; // Switch to using synchronous requests since this is typically called onUnload.
        this.connection.flush();
        this.connection.disconnect();
	}

	allRoster() {	
        this.connection.muc.init(this.connection);
        return new Promise(resolve => {
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

    create(roomName) {
        let nick = this.getNick();
        let roomId = this.timestamp();
        let room = roomId + "@" + this.CONFERENCE_SERVICE + "/" + nick;

        console.log("room : " + room);
        console.log("nick : " + nick);
        console.log("timestamp : " + this.timestamp());

        this.connection.muc.setStatus(roomId + "@" + this.CONFERENCE_SERVICE, nick, null, null);
        this.connection.muc.createInstantRoom(room, roomName, 
            function (status) {
                console.log("Succesfully created ChatRoom", status);
            }, function (err) {
                console.log("Error creating ChatRoom", status);
                console.log(err);
            });

        this.connection.muc.setRoomName(roomId + "@" + this.CONFERENCE_SERVICE, nick);

        //ChatDetailsObj.setTo(roomId + "@" + sharedConn.CONFERENCE_SERVICE);
        //ChatDetailsObj.setRoomName(roomName);
        //ChatDetailsObj.setReceiver(roomName);
    }

    join(roomJid) {
        this.connection.muc.join(roomJid, this.getNick(), null, null, null, null, null, null);
    }

    sendMessage(roomJid, message) {
        this.connection.muc.groupchat(roomJid, message, null);
    }

    timestamp() {
        return Math.floor(new Date().getTime() / 1000);
    }

    getNick() {
        let nick = this.connection.jid;
        nick = nick.substring(0, nick.indexOf('@'));
        return nick;
    }

    getUserId() {
        return this.connection.jid;
    }

	onConnect(status) {
        var self = this;

        switch (status) {
            case Strophe.Status.CONNECTED:
                console.log('[Connection] Strophe is Connected');
                
                this.connection.addHandler((msg)=>{ self.onMessage(msg); return true;}, null, 'message', null, null, null);       

                //this.connection.addHandler((stanza)=>{this.onSubscriptionRequest(stanza)}, null, "presence", "subscribe");
                this.connection.addHandler((msg)=>{ self.onInvite(msg); return true;}, 'jabber:x:conference');

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

    getParseRoomJid(id) {
        var pos = id.indexOf('/');

        if (pos > 0) {
            id = id.substring(0, pos);
        }

        return id;
    }

    getParseID(id) {
        var pos = id.indexOf('/');

        if (pos > 0) {
            id = id.substring(pos+1, id.length);
        }

        return id;
    }

    onMessage(msg) {
        let message = [];
        let from = msg.getAttribute('from');
        let type = msg.getAttribute('type');
        let elems = msg.getElementsByTagName('body');
        var delays = msg.getElementsByTagName('delay');
  
        if (type == "groupchat" && elems.length > 0) {            
            let body = elems[0];
            let textMsg = Strophe.getText(body);
            let date = new Date();
            date = date.toLocaleTimeString().replace(/:\d+ /, ' ');

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

    onInvite(msg) {
        console.log("invite.............");   
        console.log(msg);
/*
        let messages = [];
        let from = msg.getAttribute('from');
        let type = msg.getAttribute('type');
        let elems = msg.getElementsByTagName('body');
  
        let d = new Date();
        d = d.toLocaleTimeString().replace(/:\d+ /, ' ');

        if (type == "groupchat" && elems.length > 0) {            
            let body = elems[0];
            let textMsg = Strophe.getText(body);
            
            messages.push({
              userId: this.getParseID(from),
              text: textMsg,
              time: d
            });
        }

        this.events.publish('messages', messages);
        */
    };
}