/* functions include:
        function checkRepublishValidParameter( Request, Response )
        function checkRepublishFailed( Request, Response, ExpectedServiceResults )
        function RepublishService( session )
*/


function RepublishService( args ) {
    this.Name     = "Republish";
    this.Session  = null;
    this.Request  = null;
    this.Response = null;
    this.ReceivedDataChange;


    if( !isDefined( args ) ) throw( this.Name + " CTOR, arguments not specified." );
    if( !isDefined( args.Session ) ) throw( this.Name + " CTOR, session not specified." );
    else this.Session = args.Session;


    /* Arguments
        SubscriptionId 
        RetransmitSequenceNumber 
        ServiceResult, formerly ExpectedResults
        */
    this.Execute = function( args ) { 
        if( !isDefined( args ) ) throw( "RepublishService::Execute() - arguments not specified." );
        if( !isDefined( args.SubscriptionId ) ) throw( "RepublishService::Execute() SubscriptionId not specified." );
        if( !isDefined( args.RetransmitSequenceNumber ) ) throw( "RepublishService::Execute() RetransmitSequenceNumber not specified." );
        if( !isDefined( args.SuppressMessaging ) ) args.SuppressMessaging = false;

        ServiceRegister.Register( { Service: ServiceRegister.UaService( { Name: this.Name, Available: true, Tested: true } ) } );

        this.Request = new UaRepublishRequest();
        this.Response = new UaRepublishResponse();
        var session = isDefined( this.Session.Session )? this.Session.Session : this.Session;
        this.Request.RequestHeader = UaRequestHeader.New( { Session: session } );
        this.ReceivedDataChange;

        this.Request.SubscriptionId = args.SubscriptionId.SubscriptionId;
        this.Request.RetransmitSequenceNumber = args.RetransmitSequenceNumber;

        if( isDefined( args.PreHook ) ) args.PreHook();
        var uaStatus = session.republish( this.Request, this.Response );
        if( isDefined( args.PostHook ) ) args.PostHook();
        var result;
        if( uaStatus.isGood() ) { 
            result = UaResponseHeader.IsValid( { Service: this, ServiceResult: args.ServiceResult, SuppressMessaging: args.SuppressMessaging, SuppressErrors: args.SuppressErrors, ServiceInfo: "SubscriptionId: " + this.Request.SubscriptionId + "; RetransmitSequenceNumber: " + this.Request.RetransmitSequenceNumber } );
            if( result ) {
                result = checkRepublishValidParameter( this.Request, this.Response, args.SuppressMessaging );
                if( result ) this.ReceivedDataChange = this.Response.NotificationMessage.NotificationData[0].toDataChangeNotification();
                else this.ReceivedDataChange = null;
            }
        }
        if( !result ) ServiceRegister.SetFailed( { Name: this.Name } )
        return( result );
    }// Execute();


    this.CurrentlyContainsData = function() { 
        return( isDefined( this.ReceivedDataChange ) );
    }//CurrentlyContainsData

}//RepublishService




// the service is expected to succeed
// all operations are expected to succeed
function checkRepublishValidParameter( Request, Response, suppressMessaging ) {
    var bSucceeded = true;
    // check in parameters
    if( !isDefined( Request ) || !isDefined( Response ) ) throw( "Republish::checkRepublishValidParameter:Request/Reponse parameters not specified." );
    // check the notification message is not null or empty, if serviceResult Good
    if( Response.ResponseHeader.ServiceResult.isGood() ) {
        if( Response.NotificationMessage == null ) {
            addError( "Republish error! notificationMessage is null." );
            bSucceeded = false;
        }
        else {
            if( Response.NotificationMessage.NotificationData == null || Response.NotificationMessage.NotificationData.length == 0 ) {
                addError( "Republish error! notificationMessage contains 0 data." );
                bSucceeded = false;
            }
        }
    }
    // exit if the overall service failed
    if( Response.ResponseHeader.ServiceResult.isBad() ) return( false );
    // check if the notification message has the correct sequence number
    if( Response.NotificationMessage.SequenceNumber !== Request.RetransmitSequenceNumber ) {
        addError( "The SequenceNumber in the NotificationMessage does not match the RetransmitSequenceNumber." );
        addError( "Request.RetransmitSequenceNumber = " + Request.RetransmitSequenceNumber + " Response.NotificationMessage.SequenceNumber = " + Response.NotificationMessage.SequenceNumber );
        bSucceeded = false;
    }
    return bSucceeded;
}