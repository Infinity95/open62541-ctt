include( "./library/ServiceBased/DetectUAServices.js" );

try {
    __GLOBAL_SessionNumber += 0;
}
catch( ex ) {
    __GLOBAL_SessionNumber = 1;
}
// print the warnings/errors etc.
addLog( "script afterTest.js executed" );
print( "******************************************" );
print( "\tCOMPLIANCE TEST RUN COMPLETE" );
print( "******************************************" );
print( "\tFINAL REPORT" );
print( "******************************************" );
print( "\tUA SERVICES TESTED" );
var sr = ServiceRegister.toString().split( "\n" );
for( var i=0; i<sr.length; i++ ) addLog( sr[i] );
print( "******************************************" );
if( __GLOBAL_SessionNumber !== undefined  ) {
    print( "\tSessions Used: " + ( __GLOBAL_SessionNumber - 1 ) );
    addLog( "Sessions  Used: " + ( __GLOBAL_SessionNumber - 1 ) );
}
print( "\t******************************************" );
/*if( _notSupported !== undefined ) printLog( "FUNCTIONALITY NOT SUPPORTED", _notSupported );
if( _dataTypeUnavailable !== undefined ) printLog( "DATA TYPES NOT AVAILABLE FOR TESTING", _dataTypeUnavailable );
if( _warning !== undefined ) printLog( "WARNINGS DETECTED DURING TESTING", _warning );*/

function printLog( message, log ) {
    if( log.length() > 0 ) {
        print( "--- " + message + " ---" );
        addLog( message );
        print( "Purpose of this log: " + log.usage );
        addLog( log.usage );
        var logs = log.toStrings();
        for( var s=0; s<logs.length; s++ )
        {
            addLog( "\t\t" + logs[s].toString() );
            print( logs[s].toString() );
        }
    }
}