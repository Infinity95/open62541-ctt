include( "./library/Base/connectChannel.js" );
include( "./library/Base/safeInvoke.js" );
include( "./library/Base/array.js" );
include( "./library/Base/SettingsUtilities/NodeIds.js" );
include( "./library/Base/Objects/expectedResults.js" );
include( "./library/ServiceBased/Helpers.js" );


// Connect to the server 
if( !Test.Connect() ) stopCurrentUnit();