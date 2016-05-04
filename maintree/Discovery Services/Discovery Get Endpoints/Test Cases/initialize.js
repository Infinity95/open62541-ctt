include( "./library/Base/connectChannel.js" );
include( "./library/Base/safeInvoke.js" );
include( "./library/Base/locales.js" );
include( "./library/Base/assertions.js" );
include( "./library/ServiceBased/Helpers.js" );


// check the required settings first
if( readSetting( "/Discovery/Endpoint Url" ).toString() === "" ) {
    addError( "Please check the 'Discovery Url ' within the settings, under the 'Discovery Server' category. Aborting conformance unit until the issue is corrected." );
    stopCurrentUnit();
}
else {
    if( !Test.Connect() ) {
        addError( "Unable to connect to the Server. Please check settings." );
        stopCurrentUnit();
    }
}