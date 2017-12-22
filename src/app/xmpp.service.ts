import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
declare var Strophe:any;

@Injectable()
export class XMPPService {
  	private dismissObserver: any;
  	public dismiss: any;

	private BOSH_SERVICE: string = "http://localhost:7070/http-bind/";
	private CONFERENCE_SERVICE: string = "conference.localhost";
  	private connection: Strophe.Connection;

	constructor() { 
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

	getRooms() {	
		this.connection.muc.init(this.connection);
        return this.connection.muc.queryOccupants(this.CONFERENCE_SERVICE, function (msg) {
              console.log(msg);

              return msg;
            }, function (err) {
                console.log("rooms - error: " + err);
                console.log(err);
            });
	}

	onConnect(status) {
        switch (status) {
            case Strophe.Status.CONNECTED:
                console.log('[Connection] Strophe is Connected');
                
                //this.connection.addHandler(onMessage, null, 'message', null, null, null);                
                //this.connection.send($pres().tree());

                //this.connection.addHandler(onSubscriptionRequest, null, "presence", "subscribe");
                //this.connection.addHandler(onInvite, 'jabber:x:conference');

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
}