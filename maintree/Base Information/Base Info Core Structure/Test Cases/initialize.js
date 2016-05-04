include( "./library/Base/safeInvoke.js" );
include( "./library/Information/_Base/NodeContainsSubStructure.js" );
include( "./library/Information/_Base/InformationModelObjectHelper.js" );
include( "./library/ServiceBased/Helpers.js" );

const CU_NAME = "\n\n\n***** CONFORMANCE UNIT 'Base Info Core Structure' TESTING ";

if( !Test.Connect() ) {
    addError( "Unable to connect to Server. Check settings." );
    stopCurrentUnit();
}

print( CU_NAME + " BEGINS ******\n" );