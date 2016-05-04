/* Includes: 
    UaStatusCode.ToHexString()
    UaSubscriptionDiagnosticsDataType.FindSubscription( args )
*/
UaStatusCode.ToHexString = function( number ) {
    if (number < 0) number = 0xFFFFFFFF + number + 1;
    return "0x" + number.toString(16).toUpperCase();
}

/* Find subscription(s) in a a collection of SubscriptionDiagnostics
   Parameters: 
       - Diagnostics: ExtensionObject array containing UaSubscriptionDiagnosticsDataType collection
       - SubscriptionId: single object of either (a) integers (b) subscription objects */
UaSubscriptionDiagnosticsDataType.FindSubscription = function( args ) {
    if( !isDefined( args ) ) throw( "UaSubscriptionDiagnostic.FindSubscription::args not specified" );
    if( !isDefined( args.Diagnostics ) || !isDefined( args.SubscriptionId ) ) throw( "UaSubscriptionDiagnostic.FindSubscription::args.Diagnostics or args.SubscriptionIds not specified" );
    var subid = isNaN( parseInt( args.SubscriptionId ) ) ? args.SubscriptionId.SubscriptionId : parseInt( args.SubscriptionId );
    for( var i=0; i<args.Diagnostics.length; i++ ) { // iterate thru all diagnostics
        var currDiag = args.Diagnostics[i].toSubscriptionDiagnosticsDataType();
        if( currDiag !== null ) if( currDiag.SubscriptionId === subid ) return( i );
    }//for i
    return( -1 );
}

ServiceLevel = {
    "Maintenance" : 0,
    "NoData" :  1,
    "Degraded" : 2,
    "Healthy" : 200 };
ServiceLevel.ToString = function( value ) {
    if( value === 0 ) return( "Maintenance" );
    else if( value === 1 ) return( "NoData" );
    else if( value >= 2 && value <= 199 ) return( "Degraded" );
    else if( value >= 200 && value <= 255 ) return( "Healthy" );
    else throw( "Invalid ServiceLevel value '" + value + "'." );
}