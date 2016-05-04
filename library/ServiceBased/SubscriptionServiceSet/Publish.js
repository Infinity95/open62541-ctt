// Some useful constants useful to this library object
const NO_ACKS = true;


/* Object definition
        Properties:
            Request                       - intended for internal use only. The publishRequest header object.
            Response                      - intended for internal use only. The publishResponse header object.
            Session                       - a reference to the Session object.
            TimeoutHint                   - time out hint
            SubscriptionIds               - collection of SubscriptionIds to acknowledge.
            ReceivedSequenceNumbers       - collection of sequenceNumbers received
            AcknowledgedSequenceNumbers   - collection of sequenceNumbers confirmed as acknowledged
            UnAcknowledgedSequenceNumbers - collection of unacknowledged sequenceNumbers.
            PurgedSequenceNumbers
            PurgedSubscriptionIds
            ReceivedDataChanges           - collection of ALL dataChanges received.
            CurrentDataChanges            - collection of DataChanges just received.
            ReceivedEvents                - collection of ALL Events received.
            CurrentEvents                 - collection of Events just received.
            ReceivedStatusChanges         - collection of ALL statusChanges received.
            CurrentStatusChanges          - collection of StatusChanges just received.
            HookBeforeCall                - a reference to an external function to invoke, just before making the Publish call. Remember to clear when done!
            Subscriptions                 - related 'subscription' objects

        Methods:
            CurrentlyContainsData               - returns True/False suggesting Publish() yielded data to process!
            Execute                             - invokes the call to Publish().
            PrintDataChanges                    - simply 'prints' the current DataChanges information.
            PrintEvents                         - simply 'prints' the current Event information.
            SetMonitoredItemTypesFromDataChange - sets the DataTypes for the moniotoredItems based on dataChanges received.
            SetItemValuesFromDataChange         - updates specified items with values in current DataChange event.
            Clear                               - resets all of the properties, particularly the arrays.
            ClearServerNotifications            - attempts to clear out all pending notifications from a server
            HandleIsInCurrentDataChanges        - queries the current dataChange for a specified clientHandle
            HandleIsInReceivedDataChanges       - queries the received dataChanges for a specified clientHandle
            PendingAcknowledgmentsForSubscription - how many SequenceNumbers are pending ACK for a specified Subscription.
            RegisterSubscription                  - registers a subscription (object) with the Publish service.
            UnregisterSubscription                - removes a previously registered subscription with the Publish service.*/
function PublishService( args ) {
    // objects used by this class
    this.Name = "Publish";
    this.Request = null;
    this.Response = null;
    this.uaStatus = null;
    this.Session;

    if( !isDefined( args ) ) throw( this.Name + " CTOR, arguments not specified." );
    if( !isDefined( args.Session ) ) throw( this.Name + " CTOR, session not specified." );
    else this.Session = args.Session;

    // settings (for Publish call )
    var defaultTimeoutHintSettingValue = parseInt( readSetting( "/Server Test/Session/DefaultTimeoutHint" ).toString(), 10 );
    this.TimeoutHint = parseInt( defaultTimeoutHintSettingValue, 10 );

    // sequence number and subscriptionId to acknowledge in the NEXT call to Publish
    this.SubscriptionIds = [];

    // history of sequence numbers
    this.AvailableSequenceNumbers = [];
    this.ReceivedSequenceNumbers = [];
    this.AcknowledgedSequenceNumbers = [];
    this.PurgedSequenceNumbers = [];
    this.UnAcknowledgedSequenceNumbers = [];
    this.UnAcknowledgedSequenceTimestamps = [];
    this.PurgedSubscriptionIds = [];

    // access to the DATACHANGES that have been received.
    this.ReceivedDataChanges = []; // intended to store ALL dataChanges received.
    this.CurrentDataChanges  = []; // intended to store ONLY the dataChanges just received.
    this.ReceivedStatusChanges = []; // intended to store ALL statusChanges received.
    this.PublishDuration = null;     // a duration of Publish request and response, based on the CTT's clock and calculation.

    // access to the EVENTS that have been received
    this.ReceivedEvents = [];      // intended to store ALL events received.
    this.CurrentEvents  = [];      // intended to store ONLY the events just received

    // relationship of Subscriptions associated with this Session
    this.Subscriptions = [];

    // a reference to an external function to invoke just before calling Publish.
    this.HookBeforeCall;

    this.CallCount = 0;    // the number of times Publish has been called

    this.CurrentlyContainsData = function() {
        var isData = ( this.CurrentDataChanges.length > 0 && this.CurrentDataChanges[0].MonitoredItems.length > 0 ) || this.CurrentEvents.length > 0;
        return( isData );
    }// this.CurrentlyContainsData = function()

    this.CurrentlyContainsEvents = function() {
        var isEvents = ( this.CurrentEvents.length > 0 ) || this.CurrentEvents.length > 0;
        return( isEvents );
    }// this.CurrentlyContainsEvents = function()

    this.LookupDataChange = function( args ) {
        if( !isDefined( args.Items ) ) { throw( "Publish.js::LookupDataChange() parameter missing: Items." ); }
        if( !isDefined( args.Items.length ) ) args.Items = [ args.Items ];
        if( !isDefined( args.ReceivedItems ) ) args.ReceivedItems = this.CurrentDataChanges[0].MonitoredItems;
        if( !isDefined( args.ReceivedItems ) ) args.ReceivedItems = [ args.ReceivedItems ];
        var isEquals = false;
        for( var i=0; i<args.Items.length; i++ ) {
            for( var j=0; j< args.ReceivedItems.length; j++ ) {
                if( args.Items[i].ClientHandle === args.ReceivedItems[j].ClientHandle ) {
                    isEquals = true;
                    if( isDefined( args.ExpectedValue ) ) {
                        if( args.ExpectedValue.equals( args.ReceivedItems[j].Value.Value ) ) {
                            isEquals = true;
                            if( isDefined( args.StatusCode ) ){
                                if( isDefined( args.StatusCode ) && args.StatusCode === ( args.ReceivedItems[j].Value.StatusCode.StatusCode & args.StatusCode ) ) {
                                    return( true );
                                }
                                else isEquals = false;
                            }
                        }
                        else isEquals = false;                       
                    }
                }
            }
        }
        return( isEquals );
    }// this.LookupDataChange = function()

    /*  invokes the Publish call
        Parameters:
            noAcks   (optional ) - TRUE = Do not send any acknowledgements; FALSE = send acks.
            ServiceResult: expected for the service
            OperationResults: expected for the operations
            AckAllAvailableSequenceNumbers: true/false; if TRUE then acknowledge ALL AvailableSequenceNumbers. This will clear the seq #s accumulated for normal acknowledgment.
            SuppressMessaging: true/false; show/hide print messages
            SkipValidation: true/false */
    this.Execute = function( args ) {
        // if the parameters aren't defined, then define them. Simplifies checking for null.
        if( !isDefined( args ) ) args = new Object();
        if( !isDefined( args.NoAcks ) ) args.NoAcks = false;
        if( !isDefined( args.AckAllAvailableSequenceNumbers ) ) args.AckAllAvailableSequenceNumbers = false;
        if( !isDefined( args.FirstPublish ) ) args.FirstPublish = false;
        if( !isDefined( args.SuppressMessaging ) ) args.SuppressMessaging = false;
        if( !isDefined( args.SkipValidation ) ) args.SkipValidation = false;

        ServiceRegister.Register( { Service: ServiceRegister.UaService( { Name: this.Name, Available: true, Tested: true } ) } );

        this.CallCount++;
        var success = true;
        var r, d;

        // Build the request/response header objects
        this.Request = new UaPublishRequest();
        this.Response = new UaPublishResponse();
        var session = isDefined( this.Session.Session )? this.Session.Session : this.Session;
        this.Request.RequestHeader = UaRequestHeader.New( { Session: session } );

        if( !args.SuppressMessaging ) print( "Publish() called " + this.CallCount + " times. TimeoutHint: " + this.TimeoutHint + "; RequestHandle: " + this.Request.RequestHeader.RequestHandle );

        // override the TimeoutHint (requestHeader)
        this.Request.RequestHeader.TimeoutHint = this.TimeoutHint;

        // do we need to acknowledge anything? if so, then add them now...
        if( this.UnAcknowledgedSequenceNumbers.length > 0 && this.SubscriptionIds.length > 0 || args.AckAllAvailableSequenceNumbers ) {
            //if( noAcks )
            if( args.NoAcks ) {
                if( !args.SuppressMessaging ) print( "\tIgnoring subscription acknowledgements (although acknowledgements are queued to be sent to the server)..." );
            }
            else {
                var doAcks = true;
                if( args.AckAllAvailableSequenceNumbers ) { 
                    // first, do we have any seq #s in the availableSequenceNumbers from the last Publish call.
                    if( !args.SuppressMessaging ) print( "Publish.AvailableSequenceNumbers collection (size: " + this.AvailableSequenceNumbers.length + ") will be acknowledged." );
                    if( this.Response !== null && this.AvailableSequenceNumbers.length > 0 ) {
                        for( var i=0; i<this.AvailableSequenceNumbers.length; i++ ) {
                            this.Request.SubscriptionAcknowledgements[i].SubscriptionId = this.LastSubscriptionId;
                            this.Request.SubscriptionAcknowledgements[i].SequenceNumber = this.AvailableSequenceNumbers[i];
                        }
                        doAcks = false;
                        this.UnAcknowledgedSequenceNumbers = [];
                        this.SubscriptionIds = [];
                    }
                }
                if( doAcks ) {
                    if( !args.SuppressMessaging ) print( "\tBuilding Publish() request: Acknowledging " + this.UnAcknowledgedSequenceNumbers.length + " sequence numbers (MaxRetransmitQueueSize: " + gServerCapabilities.RetransmissionQueueSizePerSession + "):" );
                    // get a list of sequence numbers and subscriptions to acknowledge
                    var subIds=[], seqIds=[];
                    while( this.UnAcknowledgedSequenceNumbers.length !== 0 ) {
                        subIds.push( this.SubscriptionIds.shift() );
                        seqIds.push( this.UnAcknowledgedSequenceNumbers.shift() );
                    }//while
                    var purgedSubs=[];
                    var index = 0;
                    // now to acknowledge
                    while( subIds.length !== 0 ) {
                        var subId = subIds.shift();
                        var seqId = seqIds.shift();
                        // did the server previously purge notifications? if so then we should assume that the *next*
                        // notification message has also been purged; also make sure we don't exceed RetransmissionQueueSizePerSession.
                        // OR....
                        //     what if the server HAS NOT purged a message BUT is about to?
                        if( this.PurgedSubscriptionIds.length > 0 || subIds.length >= gServerCapabilities.RetransmissionQueueSizePerSession ) {
                            // have we purged a sequence for this subscriptionId? if not then purge it
                            var found = false;
                            for( var f=0; f<purgedSubs.length; f++ ) {
                                if( purgedSubs[f] === subId ) {
                                    found = true;
                                    break;
                                }
                            }
                            if( !found ) {
                                purgedSubs.push( subId );
                                var printMsg = "\t\t\tAssuming purge of Subscription: " + subId + ", and Sequence: " + seqId;
                                // the fact that we've removed sequences, which might be EXPECTED by a test-script
                                // means that we also need to check if a set of expected results were specified and if
                                // so then we need to trim them too 
                                if( isDefined( args.ExpectedErrors ) && args.ExpectedErrors.length > 0 ) {
                                    printMsg += "Trimming expected result [0], which was: " + args.ExpectedErrors[0].toString();
                                    args.ExpectedErrors.splice( 0, 1 );
                                }
                                if( !args.SuppressMessaging ) print( printMsg );
                                continue;
                            }
                        }
                        // go ahead and add the subscription/sequence to the request message
                        this.Request.SubscriptionAcknowledgements[index].SubscriptionId = subId;
                        this.Request.SubscriptionAcknowledgements[index++].SequenceNumber = seqId;
                    }//for a
                    if( !args.SuppressMessaging ) print( "\t\tSubscriptionId(s): " + subIds.toString() );
                    if( !args.SuppressMessaging ) print( "\t\tSequenceId(s): " + seqIds.toString() );
                }
            }
        }
        else if( !args.SuppressMessaging ) print( "\tNothing to acknowledge in this Publish() call (the UACTT's list of unacknowledged sequence numbers is empty!)." );

        // before we call Publish(), clear the contents of CurrentDataChanges and 
        // currentEvents
        this.CurrentDataChanges = [];
        this.CurrentEvents = [];
        this.CurrentStatusChanges = [];

        // check if we need to invoke a "hook" method...
        if( this.HookBeforeCall !== undefined && this.HookBeforeCall !== null ) {
            if( !args.SuppressMessaging ) addLog( "Publish() invoking hook script: " + this.HookBeforeCall.name + "..." );
            this.HookBeforeCall();
            if( !args.SuppressMessaging ) addLog( "Publish() hook script invocation complete, calling Publish()" );
        }

        // call Publish()
        var publishCallDT = UaDateTime.utcNow();
        if( isDefined( args.PreHook ) ) args.PreHook();
        this.uaStatus = session.publish( this.Request, this.Response );
        var publishReturnDT = UaDateTime.utcNow();
        this.PublishDuration = Math.abs( publishReturnDT.msecsTo( publishCallDT ) );
        if( isDefined( args.PostHook ) ) args.PostHook();
        if( args.SkipValidation ) return( this.uaStatus.isGood() );
        success = UaResponseHeader.IsValid( { Service: this, ServiceResult: args.ServiceResult, SuppressMessaging: args.SuppressMessaging, SuppressErrors: args.SuppressErrors, ServiceInfo: "SubscriptionAcknowledgements #" + this.Request.SubscriptionAcknowledgements.length } );
        if( success ) {
            if( !args.SuppressMessaging ) print( "\tPublish return: " + publishReturnDT );
            if( this.uaStatus.isGood() ) {
                // check for KeepAlives in the firstPublishCall
                if( args.FirstPublish === true && this.Response.NotificationMessage.NotificationData.size === 0 ){
                    if( !args.SuppressMessaging ) print( "\tReceived KeepAlive. Calling Publish one more time to get the initial DataChange" );
                    args.FirstPublish = false;
                    return( this.Execute( args ) );
                 }

                // store the availableSequenceNumbers parameter
                this.LastSubscriptionId = this.Response.SubscriptionId;
                this.AvailableSequenceNumbers = [];
                for( var a=0; a<this.Response.AvailableSequenceNumbers.length; a++ ) this.AvailableSequenceNumbers[a] = this.Response.AvailableSequenceNumbers[a];

                if( isDefined( args.OperationResults ) ) success = checkPublishError( this.Request, this.Response, args.OperationResults );
                if ( this.Response.ResponseHeader.ServiceResult.isGood() && !isDefined( args.OperationResults ) ) {
                    if( checkPublishValidParameter( this.Request, this.Response, args.SuppressMessaging, args.noAcks ) ) {
                        // check the Results parameter, because this will tell us if our previous acknowledgements 
                        // were accepted/ignored etc.
                        for( r=0; r<this.Response.Results.length; r++ ) { // 'r' for Results 
                            if( this.Response.Results[r].isGood() ) {
                                var sequenceNoAckd = this.Request.SubscriptionAcknowledgements[r].SequenceNumber;
                                this.UnAcknowledgedSequenceNumbers.shift();
                                this.UnAcknowledgedSequenceTimestamps.shift();
                                this.AcknowledgedSequenceNumbers.push( sequenceNoAckd );
                            }
                        }// for r...

                        // have we received any data? if not then this is a keep-alive!
                        if( !args.SuppressMessaging ) print( "\tReceived " + this.Response.NotificationMessage.NotificationData.size + " notifications in the Publish response." );
                        if( this.Response.NotificationMessage.NotificationData.size > 0 ) {
                            // capture the DataChanges & Events etc.
                            for( d=0; d<this.Response.NotificationMessage.NotificationData.size; d++ ) { // 'd' for DataChange

                                // DATA CHANGE HANDLING
                                var dataChangeEvent = this.Response.NotificationMessage.NotificationData[d].toDataChangeNotification();
                                if( dataChangeEvent !== undefined && dataChangeEvent !== null ) {
                                    // store the subscriptionId, so we can ACK it later!
                                    this.SubscriptionIds.push( this.Response.SubscriptionId );

                                    if( !args.SuppressMessaging ) print( "\tHere's what we need to ack next time: Sub=" + this.Response.SubscriptionId + "; Seq=" + this.Response.NotificationMessage.SequenceNumber );
                                    // capture anything that we need for acknowledging on the next trip (Publish call)
                                    this.ReceivedSequenceNumbers.push( this.Response.NotificationMessage.SequenceNumber );
                                    this.UnAcknowledgedSequenceNumbers.push( this.Response.NotificationMessage.SequenceNumber );
                                    this.UnAcknowledgedSequenceTimestamps.push( this.Response.ResponseHeader.Timestamp );

                                    if( !args.SuppressMessaging ) print( "\tDataChange event received with '" + dataChangeEvent.MonitoredItems.length + "' MonitoredItem changes." );
                                    this.ReceivedDataChanges.push( dataChangeEvent );
                                    this.CurrentDataChanges.push( dataChangeEvent );
                                }

                                // EVENTS HANDLING
                                var eventNotification = this.Response.NotificationMessage.NotificationData[d].toEventNotificationList();
                                if( eventNotification !== undefined && eventNotification !== null ) {
                                    if( !args.SuppressMessaging ) print( "\tEventNotification event received." );
                                    if( !args.SuppressMessaging ) print( "\tEventNotification.toString() = " + eventNotification.toString() );
                                    this.ReceivedEvents.push( eventNotification );
                                    this.CurrentEvents.push(  eventNotification );
                                }

                                // STATUS CHANGE HANDLING
                                var statusChangeEvent = this.Response.NotificationMessage.NotificationData[d].toStatusChangeNotification();
                                if( statusChangeEvent !== undefined && statusChangeEvent !== null ) {
                                    if( !args.SuppressMessaging ) print( "\tStatusChangeNotification event received." );
                                    this.ReceivedStatusChanges.push( statusChangeEvent );
                                    this.CurrentStatusChanges.push( statusChangeEvent );
                                }

                            }// for d...
                        }// if... NotificationData.size > 0 
                    }
                    else success = false;

                    // did the server purge some notifications from the queue? If so then we need to revise our 
                    // queues accordingly so that we do not ACK messages that the server no longer knows about.
                    if( this.AvailableSequenceNumbers !== null && this.AvailableSequenceNumbers.length > 0 ) {
                        // figure out how many sequences are buffered in the server vs. how many we're currently prepared
                        // to acknowledge. The two must be the same number so we don't introduce errors by attempting to 
                        // acknowledge something that the server has purged from its buffers.
                        var missingSequences = this.FindPurgedNotifications( this.Response.SubscriptionId );
                        if( !isDefined( missingSequences ) && missingSequences.length > 0 ) {
                            Assert.InRange( gServerCapabilities.RetransmissionQueueSizePerSession - 1, gServerCapabilities.RetransmissionQueueSizePerSession + 1, this.AvailableSequenceNumbers.length, "Server has purged sequence numbers too soon. The retransmission queue should be at least 2x the number of Publish() requests per Session. Current retransmission queue length appears to be: " + this.AvailableSequenceNumbers.length );
                            var iPosition = 0;
                            var removalMessage = "";
                            while( missingSequences.length > 0 ) {
                                // find the matching sequenceNumber for *this* subscription
                                if( this.SubscriptionIds[iPosition] === this.Response.SubscriptionId ) {
                                    var currSub;
                                    var currMax
                                    if( !isDefined( this.Subscriptions ) || this.Subscriptions.length === 0 ) {
                                        addError( "The Publish object does not know about the subscription details and therefore cannot determine the lifetime of a notification message necessary for validating whether or not the server has legally purged a notification from the retransmission queue. Please contact the script developer and ask them to invoke the \"RegisterSubscription\" on the Publish object." );
                                    }
                                    else {
                                        for( var subFindPos=0; subFindPos<this.Subscriptions.length; subFindPos++ ) {
                                            if( this.Subscriptions[subFindPos].SubscriptionId === this.Response.SubscriptionId ) {
                                                currSub = this.Subscriptions[subFindPos];
                                                break;
                                            }
                                        }//for subFindPos
                                    }
                                    if( !isDefined( currSub ) ) addError( "Publish object does not know of the Subscription with Id: " + this.Response.SubscriptionId + ", and therefore cannot determine if the purged notification messages in the server are legal or not." );

                                    // log the message and then remove the sequenceNumber and timestamp from our buffer
                                    if( removalMessage === "" ) "Removed the following SequenceNumbers from the Acknowledgement request for Subscription: " + this.Response.SubscriptionId;
                                    removalMessage = "\n\tSequenceNumber: " + this.UnAcknowledgedSequenceNumbers[iPosition];
                                    this.PurgedSequenceNumbers.push( this.UnAcknowledgedSequenceNumbers[iPosition] );
                                    this.PurgedSubscriptionIds.push( this.SubscriptionIds[iPosition] );
                                    this.UnAcknowledgedSequenceTimestamps.splice( iPosition, 1 );
                                    this.UnAcknowledgedSequenceNumbers.splice( iPosition, 1 );
                                    this.SubscriptionIds.splice( iPosition, 1 );
                                    // decrement the number of Sequences we needed to purge and then move onto the next record.
                                    missingSequences.splice( 0, 1 );
                                }
                                iPosition++;
                            }//while missingSequences
                            if( removalMessage !== "" ) addLog( removalMessage );
                        }
                    }// AvailableSequenceNumbers !== null
    
                }// if( expectedErrors == undefined )
            }
            else {
                addError( "Publish() failed, status: " + this.uaStatus, this.uaStatus );
                success = false;
            }

            // display current state of sequence Numbers
            if( this.SubscriptionIds.length > 0 && !args.SuppressMessaging ) print( "\t\tSubscriptions pending ack: (size: " + this.SubscriptionIds.length + ") " + this.SubscriptionIds.toString() );
            if( this.ReceivedSequenceNumbers.length > 0 && !args.SuppressMessaging ) print( "\t\tReceived sequence numbers: (size: " + this.ReceivedSequenceNumbers.length + ") " + this.ReceivedSequenceNumbers.toString() );
            if( this.AcknowledgedSequenceNumbers.length > 0 && !args.SuppressMessaging ) print( "\t\tAcknowledged sequence nos: (size: " + this.AcknowledgedSequenceNumbers.length + ") " + this.AcknowledgedSequenceNumbers.toString() );
            if( this.UnAcknowledgedSequenceNumbers.length > 0 && !args.SuppressMessaging ) print( "\t\tUnacknowledged sequence #: (size: " + this.UnAcknowledgedSequenceNumbers.length + ") " + this.UnAcknowledgedSequenceNumbers.toString() );
            if( this.PurgedSequenceNumbers.length > 0 && !args.SuppressMessaging ) print( "\t\tPURGED sequence #: (size: " + this.PurgedSequenceNumbers.length + ") " + this.PurgedSequenceNumbers.toString() );
            if( !args.SuppressMessaging ) print( "\t\tDataChanges received: " + this.ReceivedDataChanges.length );
            if( !args.SuppressMessaging ) print( "\t\tStatusChanges received: "+ this.ReceivedStatusChanges.length );
            if( !args.SuppressMessaging ) print( "\t\tEvents received: " + this.ReceivedEvents.length );
        }
        if( !success ) ServiceRegister.SetFailed( { Name: this.Name } )
        return( success );
    }// this.Execute = function( args )



    // checks the values within a dataChange to see which timestamps were returned.
    this.ValidateTimestampsInDataChange = function( dataChange, timestamps ) {
        var m;
        if( dataChange === null || dataChange === undefined ) { return( false ); }
        if( timestamps === null || timestamps === undefined ) { return( false ); }
        for( m=0; m<dataChange.MonitoredItems.length; m++ ) {
            if( timestamps === TimestampsToReturn.Neither ) {
                Assert.Equal( new UaDateTime(), dataChange.MonitoredItems[m].Value.ServerTimestamp, "SERVER timestamp NOT expected." );
                Assert.Equal( new UaDateTime(), dataChange.MonitoredItems[m].Value.SourceTimestamp, "SOURCE timestamp NOT expected." );
            }
            else if( timestamps === TimestampsToReturn.Both ) {
                Assert.NotEqual( new UaDateTime(), dataChange.MonitoredItems[m].Value.ServerTimestamp, "Expected a SERVER timestamp." );
                Assert.NotEqual( new UaDateTime(), dataChange.MonitoredItems[m].Value.SourceTimestamp, "Expected a SOURCE timestamp." );
            }
            else if( timestamps === TimestampsToReturn.Server ) {
                Assert.NotEqual( new UaDateTime(), dataChange.MonitoredItems[m].Value.ServerTimestamp, "Expected a SERVER timestamp." );
                Assert.Equal( new UaDateTime(), dataChange.MonitoredItems[m].Value.SourceTimestamp, "SOURCE timestamp NOT expected." );
            }
            else if( timestamps === TimestampsToReturn.Source ) {
                Assert.NotEqual( new UaDateTime(), dataChange.MonitoredItems[m].Value.SourceTimestamp, "Expected a SOURCE timestamp." );
                Assert.Equal( new UaDateTime(), dataChange.MonitoredItems[m].Value.ServerTimestamp, "SERVER timestamp NOT expected." );
            }
        }//for m...
    };

    this.ValidateTimestampsInAllDataChanges = function( timestamps ) {
        var d;
        for( d=0; d<this.ReceivedDataChanges.length; d++ ) this.ValidateTimestampsInDataChange( this.ReceivedDataChanges[d], timestamps );
    };

    // simply prints the values of the CurrentDataChanges
    this.PrintDataChanges = function( doNotPrint ) { 
        var message = "";
        var d;
        if( this.CurrentDataChanges !== undefined && this.CurrentDataChanges !== null && this.CurrentDataChanges.length > 0 ) {
            for( d=0; d<this.CurrentDataChanges.length; d++ ) message += PublishService.PrintDataChange( this.CurrentDataChanges[d], true );
        }
        else message = "No DataChanges to display!";
        if( doNotPrint === undefined || doNotPrint === null || doNotPrint === false ) print( message );
        return( message );
    };

    // simply prints the values of the ReceivedDataChanges
    this.PrintReceivedDataChanges = function( doNotPrint ) {
        var message = "";
        var i;
        if( this.ReceivedDataChanges !== undefined && this.ReceivedDataChanges !== null && this.ReceivedDataChanges.length > 0 ) {
            for( i = 0; i < this.ReceivedDataChanges.length; ++i ) {
                message += ( "\n\tReceiviedDataChanges[" + i + "]\n" );
                message += PublishService.PrintDataChange( this.ReceivedDataChanges[i], true );
            }
        }
        else message = "No ReceivedDataChanges to display!";
        if( doNotPrint === undefined || doNotPrint === null || doNotPrint === false ) print( message );
        return( message );
    };

    this.PrintEvents = function() {
        var message = "";
        var e;
        if( this.CurrentEvents !== undefined && this.CurrentEvents.length > 0 ) {
            for( e=0; e<this.CurrentEvents.length; e++ ) {
                message += "\tEvent: " +
                    "\n\t\t" + this.CurrentEvents[e].toString();
            }
        }
        else message = "No Events to display!";
        print( message );
    };

    this.SetMonitoredItemTypesFromDataChange = function( monitoredItems ) {
        var d, m, p;
        if( monitoredItems === undefined || monitoredItems.length === undefined || monitoredItems.length === 0 ) return( false );
        if( this.CurrentlyContainsData ) {
            if( this.CurrentDataChanges !== undefined && this.CurrentDataChanges.length > 0 ) {
                for( d=0; d<this.CurrentDataChanges.length; d++ ) { // 'd' is for DataChange
                    for( m=0; m<this.CurrentDataChanges[d].MonitoredItems.length; m++ ) { // 'm' for MonitoredItem 
                        // we need to now find the matching monitoredItem that was passed in
                        for( p=0; p<monitoredItems.length; p++ ) { // 'p' is for Parameter
                            if( monitoredItems[p].ClientHandle === this.CurrentDataChanges[d].MonitoredItems[m].ClientHandle ) {
                                monitoredItems[p].DataType = this.CurrentDataChanges[d].MonitoredItems[m].Value.Value.DataType;
                                break;
                            }
                        }// for p...                        
                    }//for m...
                }//for d...
            }//if CurrentDataChanges
        }//if CurrentlyContainsData
    };

    /* iterates thru the current dataChange results (monitoredItems) and then
       searches for each item in the 'items' parameter. Once found, the item in
       the 'items' parameter is updated.
       Parameters:
           - items          : array of MonitoredItem objects to update
           - valuesToUpdate : string value controls what to update, i.e. "vqt"
                                 "v"  = value,
                                 "q"  = quality,
                                 "st" = SERVER timestamp,
                                 "dt" = DEVICE timestamp,
                                 You can vary them, i.e. "v", "vq", "vqstdt"
    */ 
    this.SetItemValuesFromDataChange = function( items, valuesToUpdate ) {
        var d, m, i;
        if( items === null || items.length === undefined || items.length === 0 ) { return( false ); }
        if( this.CurrentDataChanges === null || this.CurrentDataChanges.length === 0 ) { return( false ); }
        if( valuesToUpdate === undefined || valuesToUpdate === null ) {
            valuesToUpdate = "vqstdt";
        }
        else {
            valuesToUpdate = valuesToUpdate.toLowerCase();
        }
        // more than 1 dataChange may have occurred in the Publish call, so
        // loop through them all...
        var msg = "\tUpdating " + items.length + " MonitoredItems with values received from Publish:";
        for( d=0; d<this.CurrentDataChanges.length; d++ ) {
            // within the dataChange, now loop through each monitoredItem
            for( m=0; m<this.CurrentDataChanges[d].MonitoredItems.length; m++ ) {
                var currentMonitoredItem = this.CurrentDataChanges[d].MonitoredItems[m];
                var currentItem = null;
                // now to find the above monitoredItem in our 'items' parameter:
                for( i=0; i<items.length; i++ ) {
                    if( items[i].ClientHandle === currentMonitoredItem.ClientHandle ) {
                        currentItem = items[i];
                        break;//for i
                    }
                }
                // have we found a match? if so, update the item
                if( currentItem !== null ) {
                    msg += "\n\t\tItem[" + m + "]" + ( isDefined( currentItem.NodeSetting ) ? "(Setting: '" + currentItem.NodeSetting + "')" : "" );
                    // update the item's value as specified
                    if( valuesToUpdate.indexOf( "v" ) !== -1 ) {
                        msg += " Value: " + currentMonitoredItem.Value.Value;
                        currentItem.Value.Value = currentMonitoredItem.Value.Value;
                    }
                    if( valuesToUpdate.indexOf( "q" ) !== -1 ) {
                        msg += "; Status: " + currentMonitoredItem.Value.StatusCode;
                        currentItem.Value.StatusCode = currentMonitoredItem.Value.StatusCode;
                    }
                    if( valuesToUpdate.indexOf( "st" ) !== -1 ) {
                        msg += "; ServerTimestamp: " + currentMonitoredItem.Value.ServerTimestamp;
                        currentItem.Value.ServerTimestamp = currentMonitoredItem.Value.ServerTimestamp;
                    }
                    if( valuesToUpdate.indexOf( "dt" ) !== -1 ) {
                        msg += "; SourceTimestamp: " + currentMonitoredItem.Value.SourceTimestamp;
                        currentItem.Value.SourceTimestamp = currentMonitoredItem.Value.SourceTimestamp;
                    }
                }
            }//for m...
        }// for d...
        print( msg );
    };

    this.ClearServerNotifications = function() {
        // call Publish() until a keep-alive is returned - added a 25-call MAX to avoid an endless-loop
        const MAX_PUBLISH_CALL_COUNT = 25;
        var i=0;
        do {
            this.Execute( { ServiceResult: new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadNoSubscription ] ) } );
            print( "Called Publish to clear the Server's queue. Receivied " + ( this.CurrentlyContainsData() === true ? "data" : "keep-alive" ) + ", on iteration " + (1+i) + " of a MAX of " + MAX_PUBLISH_CALL_COUNT + " calls." );
            // incremement the call count and exit if we hit the max
            i++;
            if( i >= MAX_PUBLISH_CALL_COUNT ) {
                addError( "Unable to Clear the Server's notification queue (when calling Publish) after trying " + i + " times." );
                break;
            }
        } while( this.CurrentlyContainsData() );
    };

    this.Clear = function() {
        addLog( "***** CLEARING Publish() data *****" );
        this.SubscriptionIds = [];
        this.ReceivedSequenceNumbers = [];
        this.AvailableSequenceNumbers = [];
        this.AcknowledgedSequenceNumbers = [];
        this.UnAcknowledgedSequenceNumbers = [];
        this.UnAcknowledgedSequenceTimestamps = [];
        this.PurgedSequenceNumbers = [];
        this.PurgedSubscriptionIds = [];
        this.ReceivedDataChanges   = [];
        this.CurrentDataChanges    = [];
        this.ReceivedStatusChanges = [];
        this.ReceivedEvents = [];
        this.CurrentEvents  = [];
        this.CallCount = 0;
    };
    
     /*  Deepthi Teegala; deepthi.teegala@opcfoundation.org
        This function compares the Subscription Publishing Interval and Item Sampling Interval and uses the highest value to wait */
    this.WaitInterval = function( args ) {
        if( !isDefined( args ) ) throw( "Publish.js::WaitInterval() parameter missing: args" );
        if( !isDefined( args.Items ) && !isDefined( args.Subscription ) ) throw( "Publish.js::WaitInterval() parameter missing: need either Subscription or Items." );
        var Waittime = null;
        
        // find slowest sampling interval
        if( isDefined( args.Items ) ) { 
            // continue with the compariion
            if( !isDefined( args.Items.length ) ) args.Items = [ args.Items ];
            Waittime = 0;
            for( var i=0; i<args.Items.length;i++ ) if( args.Items[i].RevisedSamplingInterval > Waittime ) Waittime = args.Items[i].RevisedSamplingInterval
        }
        // check publishing interval
        if( isDefined( args.Subscription) ) {
            if( !isDefined( Waittime ) || Waittime < args.Subscription.RevisedPublishingInterval ) Waittime = args.Subscription.RevisedPublishingInterval;
        }
        print( "\t\tPublish.Waiting: " + Waittime + " ms" );
        wait( Waittime );
    };

    /*  Nathan Pocock; nathan.pocock@opcfoundation.org
        This function simply returns TRUE/FALSE to identify if the EventQueueOverflowEventType is the first
        notificationMessage received in the results. */
    this.EventQueueOverflowIsFirst = function() {
        if( this.Response.NotificationMessage.NotificationData.length === 0 ) { return( false ); }
        var eventNotification = this.Response.NotificationMessage.NotificationData[0].toEventNotificationList();
        return( eventNotification !== null && eventNotification !== undefined );
    };
    
    /*  Nathan Pocock; nathan.pocock@opcfoundation.org
    This function simply returns TRUE/FALSE to identify if the EventQueueOverflowEventType is the LAST
    notificationMessage received in the results. */
    this.EventQueueOverflowIsLast = function() {
        if( this.Response.NotificationMessage.NotificationData.length === 0 ) { return( false ); }
        var messagesReceived = this.Response.NotificationMessage.NotificationData.length;
        var eventNotification = this.Response.NotificationMessage.NotificationData[messagesReceived-1].toEventNotificationList();
        return( eventNotification !== null && eventNotification !== undefined );
    };
    
    this.GetNumberOfReceivedMonitoredItems = function() {
        var d;
        var numMonitoredItems = 0;
        for( d = 0; d < this.ReceivedDataChanges.length; d++ ) numMonitoredItems += this.ReceivedDataChanges[d].MonitoredItems.length;
        return numMonitoredItems;
    }
    
    this.HandleIsInCurrentDataChanges = function( handle ) {
        var m;
        if( handle === undefined || handle === null ){ return( false ); }
        if( this.CurrentlyContainsData() ) {
                // within the dataChange, now loop through each monitoredItem
            for( m=0; m<this.CurrentDataChanges[0].MonitoredItems.length; m++ ) {
                if( handle === this.CurrentDataChanges[0].MonitoredItems[m].ClientHandle ) return( true );
            }// loop thru monitoredItems
        }
        return( false );
    };

    this.HandleIsInReceivedDataChanges = function( handle ) {
        var m, d;
        if( handle === undefined || handle === null ){ return( false ); }
        for( d=0; d<this.ReceivedDataChanges.length; d++ ) {
            // within the dataChange, now loop through each monitoredItem
            for( m=0; m<this.ReceivedDataChanges[d].MonitoredItems.length; m++ ) {
                if( handle === this.ReceivedDataChanges[d].MonitoredItems[m].ClientHandle ) return( true );
            }// loop thru monitoredItems
        }
        return( false );
    };

    this.PendingAcknowledgmentsForSubscription = function( subId ) {
        var results = [];
        var i;
        if( isDefined( subId ) ) {
            // loop through all subscriptionIds because it has a matching SequenceNumber that is unacked.
            for( i=0; i<this.SubscriptionIds.length; i++ ) {
                if( this.SubscriptionIds[i] === subId ) results.push( this.UnAcknowledgedSequenceNumbers[i] );
            }//for i
        }
        return( results );
    };

    this.FindPurgedNotifications = function( subId ) {
        var missing = [];
        var pending = this.PendingAcknowledgmentsForSubscription( subId );
        if( isDefined( pending ) && pending.length > 0 ) {
            for( var p=0; p<pending.length; p++ ) {
                var found = false;
                for( var a=0; a<this.AvailableSequenceNumbers.length; a++ ) {
                    if( pending[p] === this.AvailableSequenceNumbers[a] ) {
                        found = true;
                        break;
                    }
                }//for p (pending)
                if( !found ) missing.push( pending[p] );
            }// for a (available)
        }
        return missing;
    }

    this.RegisterSubscription = function( subs ) {
        // turn the parameter into an array if not one already
        if( subs.length === undefined ){ subs = [subs]; }
        print( "Registering " + subs.length + " subscriptions with Publish." );
        // replace subscription if already added
        var found = false;
        for( var o=0; o<subs.length; o++ ) {
            print( "\tSubscription Id: " + subs[o].SubscriptionId );
            for( var i=0; i<this.Subscriptions.length; i++ ) {
                if( this.Subscriptions[i].SubscriptionId === subs[o].SubscriptionId ) {
                    this.Subscriptions[i] = subs[o];
                    found = true;
                    break;
                }
            }//for i
            if( !found ) this.Subscriptions.push( subs[o] );
        }
    }
    
    this.UnregisterSubscription = function( subs ) {
        // turn the parameter into an array if not one already
        if( subs.length === undefined ){ subs = [subs]; }
        print( "Unregistering " + subs.length + " subscriptions from Publish." );
        // find the subscription and remove it from the collection 
        for( var o=0; o<subs.length; o++ ) {
            print( "\tSubscription Id: " + subs[o].SubscriptionId );
            for( var i=0; i<this.Subscriptions.length; i++ ) {
                if( this.Subscriptions[i].SubscriptionId === subs[o].SubscriptionId ) {
                    this.Subscriptions.splice( i, 1 );
                    break;
                }
            }//for i
        }//for o
    }


    // helper function to find and remove the first instance of a "something" in a specified array
    this.removeFirstInstanceFromArray = function( value, array ) {
        if( !isDefined( [ value, array, array.length ] ) )return( false );
        for( var i=0; i<array.length; i++ ) {
            if( value === array[i] ) {
                array.splice( i, 1 );
                return( true );
            }
        }//for i
    }
}

PublishService.PrintDataChange = function( dataChange, doNotPrint ) {
    var message = "";
    var m;
    for( m=0; m<dataChange.MonitoredItems.length; m++ ) { // 'm' for MonitoredItem
        message +=
            "\t\tHandle: " + dataChange.MonitoredItems[m].ClientHandle +
            "; Value: " + dataChange.MonitoredItems[m].Value.Value +
            "; Quality: " + dataChange.MonitoredItems[m].Value.StatusCode +
            "; Time: " + dataChange.MonitoredItems[m].Value.ServerTimestamp.toString() + "\n";
    }
    if( doNotPrint === undefined || doNotPrint === null || doNotPrint === false ) print( message );
    return( message );
};


// the service is expected to succeed
// all operations are expected to succeed
function checkPublishValidParameter( Request, Response, suppressMessaging, noAcks ) {
    if( !isDefined( suppressMessaging ) ) suppressMessaging = false;
    if( !isDefined( noAcks ) ) noAcks = false;
    var bSucceeded = true;
    // as this is a valid parameter test we don't expect any diagnositcinfo        
    if( Response.DiagnosticInfos.length !== 0 ) {
        addError( "Publish().Response.DiagnosticInfos was returned although no DiagnosticInfos were expected." );
        bSucceeded = false;
    }
    // check number of results
    if( !noAcks ) {
        if( Response.Results.length !== Request.SubscriptionAcknowledgements.length ) {
            addError( "Publish().Response.Results length (" + Response.Results.length + ") does not match the number of SubscriptionAcknowledgements (" + Request.SubscriptionAcknowledgements.length + "). ServiceResult: " + Response.ResponseHeader.ServiceResult.toString() );
            bSucceeded = false;
        }
        else {
            // check each result
            for( var i=0; i<Response.Results.length; i++ ) {
                // status code
                if( Response.Results[i].isNotGood() ) {
                    addError( "Publish().Results[" + i + "] expected 'Good', but received: " + Response.Results[i] + "\nPublish.Request.SubscriptionAcknowledgements[" + i + "] = " + Request.SubscriptionAcknowledgements[i], Response.Results[i] );
                    bSucceeded = false;
                }
            }
        }
    }
    // AvailableSequenceNumbers 
    // does *this* Publish response contain any dataChanges? if so then does the sequenceNumber also 
    // appear in the AvailableSequenceNumbers collection?
    if( !suppressMessaging ) print( "\tSequenceNumber: Checking if there are notificationMessages in the Publish response. Notifications count: " + Response.NotificationMessage.NotificationData.length );
    if( Response.NotificationMessage !== null && Response.NotificationMessage.NotificationData.length > 0 ) {
        // the Publish response can contain notifications for StatusChanges, Events, and also 
        // DataChanges. Below, we will look for DataChanges only to determine that the 
        // sequenceNumber acknowledged is not in the AvailableSequenceNumbers list.
        for( var n=0; n<Response.NotificationMessage.NotificationData.length; n++ ) {
            // we only care for DataChanges...
            var thisNotification = Response.NotificationMessage.NotificationData[n].toDataChangeNotification();
            if( thisNotification === null ) {
                // notification was not a dataChange, so was it an Event?
                thisNotification = Response.NotificationMessage.NotificationData[n].toEventNotificationList();
            }
            if( thisNotification !== null ) {
                var currentSeq = Response.NotificationMessage.SequenceNumber;
                if( !suppressMessaging ) print( "\tSequenceNumber: DataChanges were found in this Publish response, looking for SequenceNumber '" + currentSeq + "' in the AvailableSequenceNumbers collection, length: " + Response.AvailableSequenceNumbers.length );
                // see if we can find this sequenceNumber in the availableSequenceNumbers - WE EXPECT IT!
                var seqFound = false;
                for( var a=0; a<Response.AvailableSequenceNumbers.length; a++ ) {
                    if( !suppressMessaging ) print( "\t\tAvailableSequenceNumbers[" + a + "] = " + Response.AvailableSequenceNumbers[a] );
                    if( Response.AvailableSequenceNumbers[a] === currentSeq ) {
                        seqFound = true;
                        break;
                    }
                }
                Assert.True( seqFound, "Publish().Response.AvailableSequenceNumbers does not show SequenceNumber '" + currentSeq + "'; it has not been acknowledged and should therefore be available for Re-transmission." );
            }
            else if( !suppressMessaging ) addLog( "Publish() response SequenceNumber validation skipped notificationData[" + n + "] because it is NOT a DataChange notification." );
        }
    }
    if( Response.AvailableSequenceNumbers.length === 0 ) if( !suppressMessaging ) print( "\tAvailableSequenceNumbers empty... skipping checks." );
    else {
        // check the availableSequenceNumbers parameter/array and check that any
        // values stored within it are consecutively stored and in numeric order.
        if( !suppressMessaging ) print( "\tChecking the order of AvailableSequenceNumbers... (" + Response.AvailableSequenceNumbers.length + " returned)" );
        var previousValue = -1;
        for( var a=0; a<Response.AvailableSequenceNumbers.length; a++ ) {
            // is this the same sequenceNumber as last time?
            if( previousValue !== Response.AvailableSequenceNumbers[a] ) {
                if( !Assert.GreaterThan( previousValue, Response.AvailableSequenceNumbers[a], "Publish().Response.AvailableSequenceNumbers are not in numeric order!" ) ) bSucceeded = false;
                previousValue = Response.AvailableSequenceNumbers[a];
            }
        }// for a...
        // now checking AvailableSequenceNumbers to make sure that none of the 
        // acknowledged sequenceNumbers appear.
        if( !suppressMessaging ) print( "\tChecking if acknowledged sequenceNumbers appear in AvailableSequenceNumbers." );
        for( var i=0; i<Response.AvailableSequenceNumbers.length; i++ ) {
            for( var a=0; a<Request.SubscriptionAcknowledgements.length; a++ ) {
                // make sure the request/response refer to the same subscription in the ack
                if( Request.SubscriptionAcknowledgements[a].SubscriptionId == Response.SubscriptionId ) {
                    // check sequenceNumber previously acknowledged does show as still available
                    if( Request.SubscriptionAcknowledgements[a].SequenceNumber === Response.AvailableSequenceNumbers[i] ) {
                        addError( "Publish().Response.AvailableSequenceNumbers should NOT contain acknowledged SequenceNumbers" );
                        bSucceeded = false;
                        break;
                    }
                }
            }
        }
    }
    if( !suppressMessaging ) print( "\tPublish validation ends" );
    return bSucceeded;
}

// the service is expected to succeed
// one, some or all operations are expected to fail
// This function checks if the server returned the expected error codes
// Request is of Type UaPublishRequest
// Response is of Type UaPublishResponse
// ExpectedOperationResultsArray is an array ExpectedAndAcceptedResult (defined in Base/objects.js)
function checkPublishError( Request, Response, ExpectedOperationResultsArray ) {
    // check in parameters
    if( arguments.length !== 3 ) {
        addError( "function checkPublishError(Request, Response, ExpectedOperationResultsArray): Number of arguments must be 3" );
        return( false );
    }
    // ExpectedOperationResultsArray needs to have the correct size
    if( ExpectedOperationResultsArray.length !== Request.SubscriptionAcknowledgements.length ) {
        var e = "function checkPublishError(): ExpectedOperationResultsArray[] must have the same size as Request.SubscriptionAcknowledgements[]." +
            "\n\tExpectedOperationResultsArray length: " + ExpectedOperationResultsArray.length + 
            "; but Request.SubscriptionAcknowledgements length: " + Request.SubscriptionAcknowledgements.length ;
        addError( e );
        return( false );
    }  
    var result = true;
    // check results
    if( Response.Results.length !== Request.SubscriptionAcknowledgements.length ) {
        addError( "Publish().Response.SubscriptionAcknowledgements.length=" + Request.SubscriptionAcknowledgements.length + " Results.length=" + Response.Results.length + ". Both should be the same length." );
        result = false;
    }
    else {
        // check each result
        for( var i=0; i<Response.Results.length; i++ ) {
            // StatusCode
            var bMatch = false;
            // check if result matches any of the expected status codes
            for( var j=0; j<ExpectedOperationResultsArray[i].ExpectedResults.length; j++ ) {
                if( Response.Results[i].StatusCode == ExpectedOperationResultsArray[i].ExpectedResults[j].StatusCode ) {
                    print( "\tPublish().Response.Results[" + i + "] = " + Response.Results[i], Response.Results[i] );
                    bMatch = true;
                    break;
                }
            }
            if( !bMatch ) {
                // check if result matches any of the accepted status codes
                for( var j=0; j<ExpectedOperationResultsArray[i].AcceptedResults.length; j++ ) {
                    if( Response.Results[i].StatusCode == ExpectedOperationResultsArray[i].AcceptedResults[j].StatusCode ) {
                        bMatch = true;
                        break;
                    }
                }
                if( bMatch ) addWarning( "Publish().Response.Results[" + i + "] = " + Response.Results[i] + ", but " + ExpectedOperationResultsArray[i].ExpectedResults[0] + " was expected.", Response.Results[i] );
                else {
                    addError( "Publish().Response.Results[" + i + "] = " + Response.Results[i] + ", but " + ExpectedOperationResultsArray[i].ExpectedResults[0] + " was expected.", Response.Results[i] );
                    result = false;
                }
            }
        }
    }
    return( result );
}