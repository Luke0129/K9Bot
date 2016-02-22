/**
 * Connection handler
 *
 * @author      Daniel J Griffiths <dgriffiths@section214.com>
 * @license     GPL-2.0
 * @since       1.0.0
 */

'use strict';


/**
 * Logging class
 *
 * @since       1.0.0
 */
class connection {


    /**
     * Get things started!
     *
     * @since       1.0.0
     * @access      public
     * @return      {void}
     */
    constructor() {
        let Discordie = require('discordie');
        GLOBAL.bot = new Discordie();
        /*let Discordie = require('discordie');
        let events = Discordie.Events;
        let client = new Discordie();
        let logger = require(GLOBAL.k9path + '/lib/core/logging.js');

        // Attempt to reconnect if disconnected
        client.Dispatcher.on(events.DISCONNECTED, (err) => {
            let delay = 5000;
            let sdelay = Math.floor(delay/100)/10;

            if(err.error.message.indexOf('gateway') >= 0) {
                logger.notify('warning', 'Disconnected from gateway, reconnecting in ' + sdelay + ' seconds');
            } else {
                logger.notify('warning', 'Failed to login or get gateway, reconnecting in ' + sdelay + ' seconds');
            }
            setTimeout(this.connect, delay);
        });*/
    }


    /**
     * Connect to Discord
     *
     * @since       1.0.0
     * @access      public
     * @return      {bool} True if connected successfully, false otherwise
     */
     connect() {
        let Discordie = require('discordie');
        //let events = Discordie.Events;
        //let client = new Discordie();
        let config = require(GLOBAL.k9path + '/lib/core/config.js');
        let logger = require(GLOBAL.k9path + '/lib/core/logging.js');
        let email = config.get('email');
        let password = config.get('password');


        // Bail if email or password is missing or invalid
        if(! email || email === 'The registered email address of the bot' ||
           ! password || password === 'The password for the registered email address') {
            if((! email && ! password) ||
               (! email && password === 'The password for the registered email address') ||
               (email === 'The registered email address of the bot' && ! password) ||
               (email === 'The registered email address of the bot' && password === 'The password for the registered email address')) {
                logger.notify('error', 'Please create or edit the config/auth.json file and specify the bot\'s email address and password!');
                process.exit(0);
            }
        }

        try {
            // Log into Discord
            GLOBAL.bot.connect({
                email: email,
                password: password
            });

            // Bail if email/pass is invalid
            GLOBAL.bot.Dispatcher.on(Discordie.Events.REQUEST_AUTH_LOGIN_ERROR, err => {
                logger.notify('error', err.error.message + ': Email address/password combination is invalid!');
                process.exit(0);
            });

            // Bail if gateway error occurred
            GLOBAL.bot.Dispatcher.on(Discordie.Events.REQUEST_GATEWAY_ERROR, err => {
                logger.notify('error', err.error.message + ': A gateway error occurred. Please try again.');
                process.exit(0);
            });

            // Connected!
            GLOBAL.bot.Dispatcher.on(Discordie.Events.GATEWAY_READY, err => {
                if(! err.error) {
                    logger.notify('info', 'Connected as ' + GLOBAL.bot.User.username);
                } else {
                    // How the fuck did we get here?!?
                    logger.notify('error', err.error.message);
                }
            });

            this.join();
        } catch(err) {
            logger.notify('error', 'An unknown error occurred. Please try again.\n' + err.message);
            process.exit(0);
        }
    }


    join(invite) {
        //let Discordie = require('discordie');
        //let client = new Discordie();
        let config = require(GLOBAL.k9path + '/lib/core/config.js');
        let logger = require(GLOBAL.k9path + '/lib/core/logging.js');

        if(! invite) {
            invite = config.get('invite');
        }

        // Bail if no default server is set
        if(! invite || invite === 'The invite URL for the server to connect to') {
            logger.notify('error', 'Please create or edit the config/auth.json file and specify an invite URL!');
            process.exit(0);
        }

        let inviteRegex = /https?:\/\/discord\.gg\/([A-Za-z0-9-]+)\/?/;

        invite = inviteRegex.exec(invite);

        if(invite === null) {
            logger.notify('error', 'The specified invite link is invalid!');
            process.exit(0);
        } else {
            console.log(GLOBAL.bot.Invites.accept(invite[1]));
            try{
                GLOBAL.bot.Invites.accept(invite[1]).then(function(res) {
                    console.log(res.channel);
                }, function() {
                    logger.notify('warning', 'The invite link was not accepted.');
                    process.exit(0);
                });
            } catch(err) {
                logger.notify('error', err);
                process.exit(0);
            }
        }
    }
}

module.exports = new connection();
