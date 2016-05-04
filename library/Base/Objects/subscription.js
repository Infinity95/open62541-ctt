/* Object holding all parameters needed for a subscription (nathan.pocock@opcfoundation.org) */

function Subscription( publishingInterval, publishingEnabled, requestedLifetimeCount, requestedMaxKeepAliveCount, maxNotificationsPerPublish, priority ) {
    this.SubscriptionId = 0;
    this.LifetimeCount = 9;
    this.MaxKeepAliveCount = 3;
    this.MaxNotificationsPerPublish = 0;
    this.Priority = 0;
    this.SubscriptionCreated = false;

    // adding properties to capture the Revised parameters
    this.PublishingInterval = 1000;
    this.PublishingEnabled = true;
    this.RevisedPublishingInterval = -1;
    this.RevisedLifetimeCount = -1;
    this.RevisedMaxKeepAliveCount = -1;
    this.TimeoutHint = -1;

    // some statistics
    this.DataChangeNotificationCount = 0;
    this.SequenceNumber = -1;

    this.SetParameters = function( publishingInterval, publishingEnabled, requestedLifetimeCount, requestedMaxKeepAliveCount, maxNotificationsPerPublish, priority ) {
        if( requestedLifetimeCount !== undefined && requestedLifetimeCount !== null ) this.LifetimeCount = requestedLifetimeCount;
        if( requestedMaxKeepAliveCount !== undefined && requestedMaxKeepAliveCount !== null ) this.MaxKeepAliveCount = requestedMaxKeepAliveCount;
        if( publishingInterval !== undefined && publishingInterval !== null ) this.PublishingInterval = publishingInterval;
        else {
            // no publishingInterval specified, check the settings.
            this.PublishingInterval = Settings.ServerTest.DefaultSubscriptionPublishInterval;
            // value validation
            if( this.PublishingInterval < 1 ) {
                addError( "The setting \"/Server Test/Default Subscription Publish Interval\" must be at least one" );
                this.PublishingInterval = 1000;
            }
        }
        if( requestedLifetimeCount == undefined ) {
            // calculate a lifetime based on our setting (+ 2 to ensure a value of at least 3)
            var totalTimeInSec = Settings.ServerTest.SubscriptionTimeout;
            var totalTimeInMsec = 1000 * totalTimeInSec;
            this.LifetimeCount = Math.ceil( totalTimeInMsec / this.PublishingInterval ) + 2;
            if( requestedMaxKeepAliveCount == undefined && ( this.MaxKeepAliveCount * 3 ) > this.LifetimeCount ) this.MaxKeepAliveCount = Math.floor( this.LifetimeCount / 3 );
        }

        if( publishingEnabled !== undefined && publishingEnabled !== null ) this.PublishingEnabled = publishingEnabled;
        if( maxNotificationsPerPublish !== undefined && maxNotificationsPerPublish !== null ) this.MaxNotificationsPerPublish = maxNotificationsPerPublish;
        if( priority !== undefined && priority !== null ) this.Priority = priority;
    };


    /* Arguments include:
         - PublishingInterval
         - PublishingEnabled 
         - RequestedLifetimeCount 
         - RequestedMaxKeepAliveCount 
         - MaxNotificationsPerPublish 
         - Priority */
    this.SetParameters2 = function( args ) {
        if( !isDefined( args ) ) throw( "subscription.js::SetParameters2() args not specified." );
        return( this.SetParameters( args.PublishingInterval, args.PublishingEnabled, args.RequestedLifetimeCount, args.RequestedMaxKeepAliveCount, args.MaxNotificationsPerPublish, args.Priority ) );
    }

    if( arguments.length > 0 ) this.SetParameters( publishingInterval, publishingEnabled, requestedLifetimeCount, requestedMaxKeepAliveCount, maxNotificationsPerPublish, priority );
    else this.SetParameters( null );
    
    this.Clone = function() {
        var newSubscription = new Subscription( this.PublishingInterval, this.PublishingEnabled, 
            this.LifetimeCount, this.MaxKeepAliveCount, this.MaxNotificationsPerPublish, this.Priority );
        newSubscription.RevisedPublishingInterval = this.RevisedPublishingInterval;
        newSubscription.RevisedLifetimeCount = this.RevisedLifetimeCount;
        newSubscription.RevisedMaxKeepAliveCount = this.RevisedMaxKeepAliveCount;
        return( newSubscription );
    }

    this.KeepAlivePeriod = function() {
        return( this.RevisedPublishingInterval * this.RevisedMaxKeepAliveCount );
    }

    this.Expiration = function() {
        return( this.RevisedPublishingInterval * this.RevisedLifetimeCount );
    }
}

function SubscriptionsToIdsArray( subscriptions )
{
    if( arguments.length !== 1 )
    {
        throw( "'SubscriptionsToIdsArray' requires 1 parameter of type 'Subscription' array." );
    }

    var ids = [];
    if( subscriptions.length !== undefined )
    {
        for( var s=0; s<subscriptions.length; s++ ) // 's' = Subscription
        {
            ids.push( subscriptions[s].SubscriptionId );
        }// for s...
    }
    else if( subscriptions.SubscriptionId !== undefined )
    {
        ids.push( subscriptions.SubscriptionId );
    }
    else
    {
        throw( "'SubscriptionsToIdsArray' parameter not of type 'Subscription' or as an array of." );
    }
    return( ids );
}

/* TEST
include( "./library/Base/assertions.js" );
include( "./library/Base/SettingsUtilities/validate_setting.js")

var s
// no parameters
s = new Subscription();
// 1 param
s = new Subscription(333);
Assert.Equal(333,s.PublishingInterval);
// 2 param
s = new Subscription(333,false);
Assert.Equal(333,s.PublishingInterval);
Assert.Equal(false,s.PublishingEnabled);
// 3 param
 s =new Subscription(333,false,17);
 Assert.Equal(333,s.PublishingInterval);
 Assert.Equal(false,s.PublishingEnabled);
 Assert.Equal(17,s.LifetimeCount);
// 4 param
s = new Subscription(333,false,17,4);
Assert.Equal(333,s.PublishingInterval);
Assert.Equal(false,s.PublishingEnabled);
Assert.Equal(17,s.LifetimeCount);
Assert.Equal(4,s.MaxKeepAliveCount);
// 5 param
s = new Subscription(333,false,17,4,100);
Assert.Equal(333,s.PublishingInterval);
Assert.Equal(false,s.PublishingEnabled);
Assert.Equal(17,s.LifetimeCount);
Assert.Equal(4,s.MaxKeepAliveCount);
Assert.Equal(100,s.MaxNotificationsPerPublish);
// 6 param
s = new Subscription(333,false,17,4,100,10);
Assert.Equal(333,s.PublishingInterval);
Assert.Equal(false,s.PublishingEnabled);
Assert.Equal(17,s.LifetimeCount);
Assert.Equal(4,s.MaxKeepAliveCount);
Assert.Equal(100,s.MaxNotificationsPerPublish);
Assert.Equal(10,s.Priority);
//*/
function Subscription2( args ) {
    this.inheritFrom = Subscription;
    this.inheritFrom();

    // instanciation
    if( isDefined( args ) ) {
        // set default values first, and then override with values in our parameter
        this.SetParameters( null );
        if( isDefined( args.SubscriptionId ) )            { this.SubscriptionId = args.SubscriptionId; };
        if( isDefined( args.RequestedLifetimeCount ) )    { this.LifetimeCount = args.RequestedLifetimeCount; };
        if( isDefined( args.LifetimeCount ) )             { this.LifetimeCount = args.LifetimeCount; };
        if( isDefined( args.RequestedMaxKeepAliveCount ) ){ this.MaxKeepAliveCount = args.RequestedMaxKeepAliveCount; };
        if( isDefined( args.MaxKeepAliveCount ) )         { this.MaxKeepAliveCount = args.MaxKeepAliveCount; };
        if( isDefined( args.MaxNotificationsPerPublish ) ){ this.MaxNotificationsPerPublish = args.MaxNotificationsPerPublish; };
        if( isDefined( args.Priority ) )                  { this.Priority = args.Priority; };
        if( isDefined( args.PublishingInterval ) )        { this.PublishingInterval = args.PublishingInterval; };
        if( isDefined( args.RequestedPublishingInterval ) ){this.PublishingInterval = args.RequestedPublishingInterval; }
        if( isDefined( args.PublishingEnabled ) )         { this.PublishingEnabled = args.PublishingEnabled; };
        if( isDefined( args.RevisedPublishingInterval ) ) { this.RevisedPublishingInterval = args.RevisedPublishingInterval; };
        if( isDefined( args.RevisedLifetimeCount ) )      { this.RevisedLifetimeCount = args.RevisedLifetimeCount; };
        if( isDefined( args.RevisedMaxKeepAliveCount ) )  { this.RevisedMaxKeepAliveCount = args.RevisedMaxKeepAliveCount; };
        if( isDefined( args.TimeoutHint ) )               { this.TimeoutHint = args.TimeoutHint; };
    }
    
    // return a string identifying the parameters in this object
    this.toString = function() {
        var s = "SubscriptionId: " + this.SubscriptionId +
            "; LifetimeCount: " + this.LifetimeCount +
            "; MaxKeepAliveCount: " + this.MaxKeepAliveCount +
            "; MaxNotificationsPerPublish: " + this.MaxNotificationsPerPublish +
            "; Priority: " + this.Priority +
            "; PublishingInterval: " + this.PublishingInterval +
            "; PublishingEnabled: " + this.PublishingEnabled +
            "; RevisedPublishingInterval: " + this.RevisedPublishingInterval +
            "; RevisedLifetimeCount: " + this.RevisedLifetimeCount +
            "; RevisedMaxKeepAliveCount: " + this.RevisedMaxKeepAliveCount +
            "; TimeoutHint: " + this.TimeoutHint;
        return( s );
    }
}