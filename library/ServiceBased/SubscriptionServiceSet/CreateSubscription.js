function CreateSubscriptionService( args ) {
    this.Name = "CreateSubscription";
    this.Session  = null;
    this.Request  = null;
    this.Response = null;

    if( !isDefined( args ) ) throw( "CreateSubscription::constructor - args not specified." );
    if( !isDefined( args.Session ) ) throw( "CreateSubscription.js::constructor - session parameter missing." );
    else this.Session = args.Session;

    /* Invokes CreateSubscription. Parameters include: 
        Subscription: 
        ServiceResult: 
        MaxNotificationsPerPublish: 
        Priority: 
        PublishingEnabled: 
        RequestedLifetimeCount: 
        RequestedPublishingInterval: 
        RequestedMaxKeepAliveCount:
        SuppressMessaging :*/
    this.Execute = function( args ) {
        // first, make sure all required parameters are here 
        if( !isDefined( args ) ){ throw( "CreateSubscription.js::Execute() parameter missing: args." ); }
        if( !isDefined( args.Subscription ) ){ throw( "CreateSubscription.js::Execute() parameter missing: args.Subscription." ); }
        // second, make sure any error-checking parameters are correctly configured 
        if( isDefined( args.ExpectedErrors ) ){ args.ServiceResult = args.ExpectedErrors; }
        // third, make sure any subscription control parameters are used 
        if( isDefined( args.MaxNotificationsPerPublish ) ){ args.Subscription.MaxNotificationsPerPublish = args.MaxNotificationsPerPublish; }
        if( isDefined( args.Priority ) ){ args.Subscription.Priority = args.Priority; }
        if( isDefined( args.PublishingEnabled ) ){ args.Subscription.PublishingEnabled = args.PublishingEnabled; }
        if( isDefined( args.RequestedLifetimeCount ) ){ args.Subscription.LifetimeCount = args.RequestedLifetimeCount; }
        if( isDefined( args.RequestedPublishingInterval ) ){ args.Subscription.PublishingInterval = args.RequestedPublishingInterval; }
        if( isDefined( args.RequestedMaxKeepAliveCount ) ) { args.Subscription.MaxKeepAliveCount = args.RequestedMaxKeepAliveCount; }

        ServiceRegister.Register( { Service: ServiceRegister.UaService( { Name: this.Name, Available: true, Tested: true } ) } );

        // now to invoke the call using our existing function (above)
        var result = createSubscriptionDeprecated( args.Subscription, this.Session, args.ServiceResult, args.SuppressMessaging );
        this.Request = subscriptionReq;
        this.Response = subscriptionRes;

        if( !result ) ServiceRegister.SetFailed( { Name: this.Name } )
        return( result );
    }

}



/*
create a subscription with the parameters specified in the Subscription object
   Revision History: 
       01-Jul-2009 DEV: Initial Version
       22-Mar-2010 NP: Added "TimeoutHint" calculation
*/
var subscriptionReq;
var subscriptionRes;
function createSubscriptionDeprecated( Subscription, Session, expectedErrors, suppressMessaging ) {
    var bSucceeded = true;
    // check in parameters
    if( arguments.length < 2 ) {
        addError( "function createSubscription(Subscription, Session): Number of arguments must be at least 2!" );
        return false;
    }

    if( Subscription.SubscriptionCreated == true ) {
        addError( "function createSubscription(Subscription, Session): Subscription is already created." );
        return false;
    }

    if( !isDefined( suppressMessaging ) ) suppressMessaging = false;
    subscriptionReq = new UaCreateSubscriptionRequest();
    subscriptionRes = new UaCreateSubscriptionResponse();
    var session = isDefined( Session.Session )? Session.Session : Session;
    session.buildRequestHeader( subscriptionReq.RequestHeader );
    subscriptionReq.RequestHeader = UaRequestHeader.New( { Session: session } );

    subscriptionReq.RequestedPublishingInterval = Subscription.PublishingInterval;
    subscriptionReq.RequestedLifetimeCount = Subscription.LifetimeCount;
    subscriptionReq.RequestedMaxKeepAliveCount = Subscription.MaxKeepAliveCount;
    subscriptionReq.MaxNotificationsPerPublish = Subscription.MaxNotificationsPerPublish;
    subscriptionReq.PublishingEnabled = Subscription.PublishingEnabled;
    subscriptionReq.Priority = Subscription.Priority;

    // get the defaultTimeoutHint from the settings
    var defaultTimeoutHintSettingValue = readSetting( "/Server Test/Session/DefaultTimeoutHint" ).toString();
    subscriptionReq.RequestHeader.TimeoutHint = parseInt( defaultTimeoutHintSettingValue );

    if( !suppressMessaging ) print( "CreateSubscription Requested Parameters:" +
        "\n\tDefaultTimeoutHint: " + subscriptionReq.RequestHeader.TimeoutHint +
        "\n\tPublishingInterval: " + subscriptionReq.RequestedPublishingInterval +
        "\n\tLifetimeCount: " + subscriptionReq.RequestedLifetimeCount +
        "\n\tMaxKeepAliveCount: " + subscriptionReq.RequestedMaxKeepAliveCount +
        "\n\tPublishingEnabled: " + subscriptionReq.PublishingEnabled +
        "\n\tPriority: " + subscriptionReq.Priority +
        "\n\tMaxNotificationsPerPublish: " + subscriptionReq.MaxNotificationsPerPublish );

    var uaStatus = session.createSubscription( subscriptionReq, subscriptionRes );
    Subscription.ServiceResult = subscriptionRes.ResponseHeader.ServiceResult;
    if( uaStatus.isGood() ) {
        bSucceeded = UaResponseHeader.IsValid( { Service: { Name: "CreateSubscription", Request: subscriptionReq, Response: subscriptionRes }, ServiceResult: expectedErrors, ServiceInfo: "SubscriptionId: " + subscriptionRes.SubscriptionId, SuppressMessaging: suppressMessaging } );
        if( bSucceeded ) {
            if( subscriptionRes.ResponseHeader.ServiceResult.isGood() ) {
                if(!checkCreateSubscriptionValidParameter( subscriptionReq, subscriptionRes )) bSucceeded = false;
                Subscription.RevisedPublishingInterval = subscriptionRes.RevisedPublishingInterval;
                Subscription.SubscriptionId = subscriptionRes.SubscriptionId;
                Subscription.RevisedLifetimeCount = subscriptionRes.RevisedLifetimeCount;
                Subscription.RevisedMaxKeepAliveCount = subscriptionRes.RevisedMaxKeepAliveCount;
                Subscription.SubscriptionCreated = true;
    
                //store the revised values in the Revised properties of our subscription object
                Subscription.RevisedPublishingInterval = subscriptionRes.RevisedPublishingInterval;
                Subscription.RevisedLifetimeCount      = subscriptionRes.RevisedLifetimeCount;
                Subscription.RevisedMaxKeepAliveCount  = subscriptionRes.RevisedMaxKeepAliveCount;
    
                //calculate the "TimeoutHint" and store in the Subscription object
                Subscription.TimeoutHint = 2 * ( Subscription.RevisedPublishingInterval * Subscription.RevisedMaxKeepAliveCount );
    
                if( !suppressMessaging ) print( "CreateSubscription Revised Parameters:" +
                    "\n\tRevisedPublishingInterval: " + Subscription.RevisedPublishingInterval +
                    "\n\tRevisedLifetimeCount: "      + Subscription.RevisedLifetimeCount +
                    "\n\tRevisedMaxKeepAliveCount: "  + Subscription.RevisedMaxKeepAliveCount );
            }
        }
    }
    else {
        addError( "CreateSubscription() status " + uaStatus, uaStatus );
        bSucceeded = false;
    }
    return bSucceeded;
}


// the service is expected to succeed
// all operations are expected to succeed
function checkCreateSubscriptionValidParameter( Request, Response ) {
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
}// function checkCreateSubscriptionValidParameter( Request, Response )