/*    This class object is responsible for calling the ModifySubscription() service and for also
      performing any validation etc. This is a quick-use class. */

function ModifySubscriptionService( args ) {
    this.Name = "ModifySubscription";
    this.Session = null;
    this.Request  = new UaModifySubscriptionRequest();
    this.Response = new UaModifySubscriptionResponse();
    this.uaStatus = null;

    if( !isDefined( args ) ) throw( this.Name + " CTOR, arguments not specified." );
    if( !isDefined( args.Session ) ) throw( this.Name + " CTOR, session not specified." );
    else this.Session = args.Session;


    /*  Executes the call to ModifySubscription()
        Parameters:
            - SubscriptionId- a subscription object
            - MaxNotificationsPerPublish
            - Priority
            - RequestedLifetimeCount
            - RequestedMaxKeepAliveCount
            - RequestedPublishingInterval
            - ServiceResult (formerly 'ExpectedErrors')
            - SuppressMessaging (true/false; default=false)
            */
    this.Execute = function( args ) {//subscription, expectedErrors )
        if( !isDefined( args ) )throw( "ModifySubscription::.Execute() argument not specified." );
        if( !isDefined( args.SubscriptionId ) )throw( "ModifySubscription::Execute() argument 'Subscription' not specified." );
        if( isDefined( args.ExpectedErrors ) ) args.ServiceResult = args.ExpectedErrors;
        if( isDefined( args.MaxNotificationsPerPublish ) ) args.SubscriptionId.MaxNotificationsPerPublish = args.MaxNotificationsPerPublish;
        if( isDefined( args.Priority ) ) args.SubscriptionId.Priority = args.Priority;
        if( isDefined( args.RequestedLifetimeCount ) ) args.SubscriptionId.RequestedLifetimeCount = args.RequestedLifetimeCount;
        if( isDefined( args.RequestedMaxKeepAliveCount ) ) args.SubscriptionId.RequestedMaxKeepAliveCount = args.RequestedMaxKeepAliveCount;
        if( isDefined( args.RequestedPublishingInterval ) ) args.SubscriptionId.RequestedPublishingInterval = args.RequestedPublishingInterval;
        if( !isDefined( args.SuppressMessaging ) ) args.SuppressMessaging = false;

        ServiceRegister.Register( { Service: ServiceRegister.UaService( { Name: this.Name, Available: true, Tested: true } ) } );

        var result = true;
        this.Request = new UaModifySubscriptionRequest();
        this.Response = new UaModifySubscriptionResponse();
        var session = isDefined( this.Session.Session )? this.Session.Session : this.Session;
        this.Request.RequestHeader = UaRequestHeader.New( { Session: session } );

        this.Request.RequestedPublishingInterval = args.SubscriptionId.PublishingInterval;
        this.Request.SubscriptionId = args.SubscriptionId.SubscriptionId;
        this.Request.RequestedLifetimeCount = args.SubscriptionId.LifetimeCount;
        this.Request.RequestedMaxKeepAliveCount  = args.SubscriptionId.MaxKeepAliveCount;
        this.Request.MaxNotificationsPerPublish  = args.SubscriptionId.MaxNotificationsPerPublish;
        this.Request.Priority = args.SubscriptionId.Priority;

        if( isDefined( args.PreHook ) ) args.PreHook();
        this.uaStatus = session.modifySubscription( this.Request, this.Response );
        if( isDefined( args.PostHook ) ) args.PostHook();
        if( this.uaStatus.isGood() ) {
            result = UaResponseHeader.IsValid( { Service: this, ServiceResult: args.ServiceResult, SuppressMessaging: args.SuppressMessaging, SuppressErrors: args.SuppressErrors, ServiceInfo: "SubscriptionId: " + this.Request.SubscriptionId } );
            if( result && this.Response.ResponseHeader.ServiceResult.isGood() ) {
                if( checkModifySubscriptionValidParameter( this.Request, this.Response ) ) {
                    args.SubscriptionId.RevisedLifetimeCount = this.Response.RevisedLifetimeCount;
                    args.SubscriptionId.RevisedMaxKeepAliveCount = this.Response.RevisedMaxKeepAliveCount;
                    args.SubscriptionId.RevisedPublishingInterval = this.Response.RevisedPublishingInterval;
                    if( !args.SuppressMessaging ) print( "\tModify Subscription REVISED values: " +
                        "\n\t\tRevisedPublishingInterval: " + args.SubscriptionId.RevisedPublishingInterval +
                        "\n\t\tRevisedMaxKeepAliveCount: " + args.SubscriptionId.RevisedMaxKeepAliveCount +
                        "\n\t\tRevisedLifetimeCount: " + args.SubscriptionId.RevisedLifetimeCount );
                }
                else result = false;
            }
        }
        else {
            addError( "ModifySubscription() failed, status: " + this.uaStatus, this.uaStatus );
            result = false;
        }
        if( !result ) ServiceRegister.SetFailed( { Name: this.Name } )
        return( result );
    }// Execute()
}



// the service is expected to succeed
// all operations are expected to succeed
function checkModifySubscriptionValidParameter( Request, Response ) {
    var bSucceeded = true;
    if( Response.RevisedPublishingInterval == 0 ) {
        addError( "The server returned an invalid RevisedPublishingInterval value of: " + Response.RevisedPublishingInterval );
        bSucceeded = false;
    }
    if( Response.RevisedMaxKeepAliveCount == 0 ) {
        addError( "The server returned an invalid RevisedMaxKeepAliveCount value of: " + Response.RevisedMaxKeepAliveCount );
        bSucceeded = false;
    }
    //make sure there is 3x multiplier between the lifetimeCount and maxKeepAlive
    if( (Response.RevisedMaxKeepAliveCount*3) > Response.RevisedLifetimeCount ) {
        addError( "The RevisedLifetimeCount should be 3x bigger than RevisedMaxKeepAliveCount. RevisedMaxKeepAliveCount=" + Response.RevisedMaxKeepAliveCount + "; RevisedLifetimeCount=" + Response.RevisedLifetimeCount );
        bSucceeded = false;
    }
    return( bSucceeded );
}