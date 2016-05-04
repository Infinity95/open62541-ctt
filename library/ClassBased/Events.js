/* Contains all validation routines and objects for Event analysis. Functions/objects include: 
        function BaseEvent( args )
        function AuditEventType( args ) 
        function SystemEventType( args )
        function DeviceFailureEventType( args )
        function SystemStatusChangeEventType( args )
        function BaseModelChangeEventType( args ) 
        function GeneralModelChangeEventType( args )
        function SemanticChangeEventType( args )
        function EventQueueOverflowEventType( args )
        function ProgressEventType( args ) 
        function TransitionEventType( args )

        function EventsFactory( rawEvent ) //TODO
*/

include( "./library/Base/Objects/JSQueue.js" );

const MAX_EVENTIDS_TO_REMEMBER = 100;

var _eventIdsBuffer = undefined;
if( _eventIdsBuffer === undefined ) _eventIdsBuffer = new JSQueue( MAX_EVENTIDS_TO_REMEMBER );



function BaseEvent( args ) {
    this.Name = "BaseEvent";
    // properties, automatically initialized via "args" parameter
    this.EventId = ( isDefined( args ) && args.EventId !== undefined )? args.EventId : new UaByteString();
    this.EventType = ( isDefined( args ) && isDefined( args.EventType ) )? args.EventType : new UaNodeId();
    this.SourceNode = ( isDefined( args ) && isDefined( args.SourceNode ) )? args.SourceNode : new UaNodeId();
    this.SourceName = ( isDefined( args ) && isDefined( args.SourceName ) )? args.SourceName : "";
    this.Time = ( isDefined( args ) && isDefined( args.Time ) )? args.Time : new UaDateTime();
    this.ReceiveTime = ( isDefined( args ) && isDefined( args.ReceiveTime ) )? args.ReceiveTime : new UaDateTime();
    this.LocalTime = ( isDefined( args ) && isDefined( args.LocalTime ) )? args.LocalTime : UaDateTime.utcNow();
    this.Message = ( isDefined( args ) && isDefined( args.Message ) )? args.Message : new UaLocalizedText();
    this.Severity = ( isDefined( args ) && isDefined( args.Severity ) )? args.Severity : 0;
    if( isDefined( args ) && args.EventId !== undefined && args.EventId !== null ) {
        if( Assert.False( _eventIdsBuffer.Contains( args.EventId ), "EventId already received. EventIds must be unique. Check EventId: '" + args.EventId + "'." ) ) _eventIdsBuffer.Push( args.EventId );
    }// buffer the eventId
    /* validate function; parameters:
        - Suppress: true/false = True to hide messages, False to show message. Default = False. */
    this.Validate = function( args ) { 
        if( !isDefined( args ) ) args = { Suppress: false };
        return( !this.EventId.isEmpty() 
            && Assert.NodeIdNotNull( this.EventType, "BaseEvent.EventType should not be null. Received: '" + this.EventType + "'.", undefined, args.Suppress )
            && Assert.StringNotNullOrEmpty( this.SourceName, "BaseEvent.SourceName should not be empty. Received: '" + this.SourceName + "'.", undefined, args.Suppress )
            && Assert.False( this.Time.isNull(), "BaseEvent.Time should contain a valid timestamp that is somewhat current. Received: '" + this.Time + "'.", undefined, args.Suppress )
            && Assert.False( this.LocalTime.isNull(), "BaseEvent.LocalTime should contain a valid timestamp that is somewhat current. Received: '" + this.LocalTime + "'.", undefined, args.Suppress )
            && Assert.StringNotNullOrEmpty( this.Message.Text, "BaseEvent.Message should not be empty. Received: '" + this.Message + "'.", undefined, args.Suppress )
            && Assert.InRange( 1, 1000, this.Severity, "BaseEvent.Severity must be between 1-1000. Received: '" + this.Severity + "'.", undefined, args.Suppress )
            );
    }// this.Validate = function()
    // toString override
    this.toString = function() { 
        return( "EventId: " + this.EventId.toString()
            + "; EventType: " + this.EventType.toString()
            + "; SourceNode: " + this.SourceNode.toString()
            + "; SourceName: " + this.SourceName.toString()
            + "; Time: " + this.Time.toString()
            + "; ReceiveTime: " + this.ReceiveTime.toString()
            + "; LocalTime: " + this.LocalTime.toString()
            + "; Message: " + this.Message.toString()
            + "; Severity: " + this.Severity.toString() );
    }// this.ToString = function()
    // clear all cached event ids
    this.ClearEventIds = function() {
        if( _eventIdsBuffer !== undefined && _eventIdsBuffer !== null ) _eventIdsBuffer.Clear();
    }// this.ClearEventIds = function()
}// function BaseEvent()



function AuditEventType( args ) {
    this.prototype = new BaseEvent( args );
    this.Name = "AuditEvent";
    // properties, automatically initialized via "args" parameter
    this.ActionTimestamp = ( isDefined( args ) && isDefined( args.ActionTimestamp ) )? args.ActionTimestamp : new UaDateTime();
    this.Status = ( isDefined( args ) && isDefined( args.Status ) )? args.Status : false;
    this.ServerId = ( isDefined( args ) && isDefined( args.ServerId ) )? args.ServerId : "";
    this.ClientAuditEntryId = ( isDefined( args ) && isDefined( args.ClientAuditEntryId ) )? args.ClientAuditEntryId : "";
    this.ClientUserId = ( isDefined( args ) && isDefined( args.ClientUserId ) )? args.ClientUserId : "";
    // validate function 
    this.Validate = function() { 
        return( Assert.False( this.ActionTimestamp.isNull(), "AuditEventType.ActionTimestamp should contain a valid timestamp that is somewhat current. Received: '" + this.ActionTimestamp + "'." )
             && Assert.StringNotNullOrEmpty( this.ServerId, "AuditEventType.ServerId should not be empty. Received: '" + this.ServerId + "'." )
             && Assert.StringNotNullOrEmpty( this.ClientAuditEntryId, "AuditEventType.ClientAuditEntryId should not be empty. Received: '" + this.ClientAuditEntryId + "'." )
             && Assert.StringNotNullOrEmpty( this.ClientUserId, "AuditEventType.ClientUserId should not be empty (unless Anonymous). Received: '" + this.ClientUserId + "'." )
             && this.prototype.Validate() );
    }// this.Validate = function() 
    // toString override
    this.toString = function() {
        return( "ActionTimestamp: " + this.ActionTimestamp.toString() 
            + "; Status: " + this.Status.toString()
            + "; ServerId: " + this.ServerId.toString()
            + "; ClientAuditEntryId: " + this.ClientAuditEntryId.toString()
            + "; ClientUserId: " + this.ClientUserId.toString()
            + "; " 
            + this.prototype.toString() );
    }// this.toString = function()
}



function SystemEventType( args ) { 
    this.prototype = new BaseEvent( args );
    this.Name = "SystemEvent";
    // properties, some automatically modified by the args parameter
    // validate function
    this.Validate = function() {
        return( this.prototype.Validate() );
    }// this.Validate = function() 
    // toString override 
    this.toString = function() { 
        return( this.prototype.toString() ); 
    }// this.toString = function() 
}// function SystemEventType( args ) 



function DeviceFailureEventType( args ) { 
    this.prototype = new BaseEvent( args );
    this.Name = "DeviceFailureEvent";
    // properties, some automatically modified by the args parameter
    // validate function
    this.Validate = function() {
        return( this.prototype.Validate() );
    }// this.Validate = function() 
    // toString override 
    this.toString = function() { 
        return( this.prototype.toString() ); 
    }// this.toString = function() 
}// function DeviceFailureEventType( args ) 



function SystemStatusChangeEventType( args ) { 
    this.prototype = new BaseEvent( args );
    this.Name = "SystemStatusChangeEvent";
    // properties, some automatically modified by the args parameter
    this.SystemState = ( isDefined( args ) && isDefined( args.SystemState ) )? args.SystemState : null;
    // validate function
    this.Validate = function() {
        return( Assert.True( ServerState.Validate( this.SystemState.Validate ), "SystemStatusChangeEvent.ServerState should contain a value. Received: '" + this.ServerState + "'." )
             && this.prototype.Validate() );
    }// this.Validate = function() 
    // toString override 
    this.toString = function() { 
        return( this.prototype.toString() ); 
    }// this.toString = function() 
}// function SystemStatusChangeEventType( args ) 



function BaseModelChangeEventType( args ) { 
    this.prototype = new BaseEvent( args );
    this.Name = "BaseModelChangeEvent";
    // properties, some automatically modified by the args parameter
    // validate function
    this.Validate = function() {
        return( this.prototype.Validate() );
    }// this.Validate = function() 
    // toString override 
    this.toString = function() { 
        return( this.prototype.toString() ); 
    }// this.toString = function() 
}// function BaseModelChangeEventType( args ) 



function GeneralModelChangeEventType( args ) { 
    this.prototype = new BaseModelChangeEventType( args );
    this.Name = "GeneralModelChangeEvent";
    // properties, some automatically modified by the args parameter
    this.Affected = ( isDefined( args ) && isDefined( args.Affected ) )? args.Affected : null;
    this.AffectedType = ( isDefined( args ) && isDefined( args.AffectedType ) )? args.AffectedType : null;
    this.Verb = ( isDefined( args ) && isDefined( args.Verb ) )? args.Verb : 0;
    // validate function
    this.Validate = function() {
        // AffectedType can be null, so leave it.
        return( Assert.NodeIdNotNull( this.Affected, "GeneralModelChangeEvent.Affected should not be null/empty. Received: '" + this.Affected + "'." )
             && Assert.InRange( 0, 31, this.Verb, "GeneralModelChangeEvent.Verb should be between 0 and 31. Received: '" + this.Verb + "'." )
             && this.prototype.Validate() );
    }// this.Validate = function() 
    // toString override 
    this.toString = function() { 
        return( this.prototype.toString() ); 
    }// this.toString = function() 
}// function GeneralModelChangeEventType( args ) 



function SemanticChangeEventType( args ) { 
    this.prototype = new BaseEvent( args );
    this.Name = "SemanticChangeEvent";
    // properties, some automatically modified by the args parameter
    this.Changes = ( isDefined( args ) && isDefined( args.Changes ) )? args.Changes : [];
    this.Affected = ( isDefined( args ) && isDefined( args.Affected ) )? args.Affected : null;
    this.AffectedType = ( isDefined( args ) && isDefined( args.AffectedType ) )? args.AffectedType : null;
    // validate function
    this.Validate = function() {
        if( Assert.GreaterThan( 0, this.Changes.length, "SemanticChangeEventType.Changes should not be empty/null. Received: '" + this.Changes + "'." )
             && Assert.NodeIdNotNull( this.Affected, "SemanticChangeEvent.Affected should not be null/empty. Received: '" + this.Affected + "'." )
             && this.prototype.Validate() ) {
             var isGood = true;
             for( var i=0; i<this.Changes.length; i++ ) {
                 notImplemented( "Events.SemanticChangeEventType.Changes[*] validation." );
                 isGood = false;
                 break;
             }//for i...
             return( isGood );
         }
         else {
             return( false );
         }
    }// this.Validate = function() 
    // toString override 
    this.toString = function() { 
        return( this.prototype.toString() ); 
    }// this.toString = function() 
}// function SemanticChangeEventType( args ) 



function EventQueueOverflowEventType( args ) { 
    this.prototype = new BaseEvent( args );
    this.Name = "EventQueueOverflowEvent";
    // properties, some automatically modified by the args parameter
    // validate function
    this.Validate = function() {
        return( this.prototype.Validate() );
    }// this.Validate = function() 
    // toString override 
    this.toString = function() { 
        return( this.prototype.toString() ); 
    }// this.toString = function() 
}// function EventQueueOverflowEventType( args ) 



function ProgressEventType( args ) { 
    this.prototype = new BaseEvent( args );
    this.Name = "ProgressEvent";
    // properties, some automatically modified by the args parameter
    this.Context  = ( isDefined( args ) && isDefined( args.Context ) )? args.Context : null;
    this.Progress = ( isDefined( args ) && isDefined( args.Progress) )? args.Progress: Constants.UInt16_Max;
    this._OriginalRequestHandle = ( isDefined( args ) && isDefined( args.OriginalRequest ) )? args.OriginalRequest : null;
    // validate function
    this.Validate = function() {
        return( Assert.StringNotNullOrEmpty( this._OriginalRequestHandle, "ProgressEvent.Context should not be empty. It should match the 'Progress' value in the event details." )
             && Assert.Equal( this._OriginalRequestHandle, this.Progress, "ProgressEvent.Progress should match the RequestHandle of the original call." )
             && Assert.InRange( 0, 100, this.Progress, "ProgressEvent.Progress should be between 0-100." )
             && this.prototype.Validate() );
    }// this.Validate = function() 
    // toString override 
    this.toString = function() { 
        return( this.prototype.toString() ); 
    }// this.toString = function() 
}// function ProgressEventType( args )



function TransitionEventType( args ) { 
    this.prototype = new BaseEvent( args );
    this.Name = "TransitionEvent";
    // properties, some automatically modified by the args parameter
    this.Transition = ( isDefined( args ) && isDefined( args.Transition ) )? args.Transition : new UaLocalizedText();
    this.FromState  = ( isDefined( args ) && isDefined( args.FromState ) ) ? args.FromState : new UaLocalizedText();
    this.ToState    = ( isDefined( args ) && isDefined( args.ToState ) )   ? args.ToState   : new UaLocalizedText();
    // validate function
    this.Validate = function() {
        return( Assert.StringNotNullOrEmpty( this.Transition.Text, "TransitionEventType.Transition should not be empty/null. Received: '" + this.Transition + "'." )
             && Assert.StringNotNullOrEmpty( this.FromState.Text,  "TransitionEventType.FromState should not be empty/null. Received: '" + this.FromState + "'." )
             && Assert.StringNotNullOrEmpty( this.ToState.Text,    "TransitionEventType.ToState should not be empty/null. Received: '" + this.ToState + "'." )
             && this.prototype.Validate() );
    }// this.Validate = function() 
    // toString override 
    this.toString = function() { 
        return( this.prototype.toString() ); 
    }// this.toString = function() 
}// function TransitionEventType( args ) 


function EventsFactory( rawEvent ) { 
    throw( "TODO" );
}// function EventsFactory( rawEvent )