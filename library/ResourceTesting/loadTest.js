/*  RESOURCE TESTING;
    prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description:
        Establishes a connection to a UA Server. Create a single Subscription. Creates 1 monitoredItem per line in the CSV file.
        In a loop: Read all of the Nodes in a single call. Write a new value to all of the Nodes, in a single call. call Publish(). 
            Some errors may be received in the WRITE call, which is OK.
        Deletes the monitoredItems.
        Deletes the Subscription.
        Closes the connection to the UA Server. */

const RUN_TIME_IN_MINUTES = 1; //default, 1 hour
const DELAY_BETWEEN_READWRITEPUBLISH = 1; //time is in msec

include( "./library/ResourceTesting/repetitiveCall.js" );
include( "./library/ServiceBased/Helpers.js" );

var Test.Session.Session;
var g_channel;

// this function parses the CSV file and returns "MonitoredItem" objects array,
// or an empty array.

function initialize() {
    g_channel = new UaChannel();
    Test.Session.Session = new UaSession( g_channel );
    Test.Session.Session.DefaultTimeoutHint = parseInt( readSetting( "/Server Test/Session/DefaultTimeoutHint" ) );
    if( !connect( g_channel, Test.Session.Session ) ) { addError("connect failed"); return false; }
    if( !activateSession( Test.Session.Session ) ) { addError( "Unable to activateSession" ); return false; }
    InstanciateHelpers( { Session: Test.Session.Session } );
    return true;
}

function disconnectOverride() { disconnect( g_channel, Test.Session.Session ); }

// Get a list of items to read from settings
var originalItems = MonitoredItem.GetRequiredNodes( { Number: 500 } );
if( originalItems !== null && originalItems.length > 0  ) {
    // Get the test control parameters from the settings
    var i, j;
    var writeValues = new UaWriteValues();
    var readRequest = new UaReadRequest();
    var readResponse = new UaReadResponse();
    var writeRequest = new UaWriteRequest();
    var writeResponse = new UaWriteResponse();
    var checkItemResults = false;

    if( initialize() ) {
        // Read all values
       Test.Session.Session.buildRequestHeader( readRequest.RequestHeader );
        for( i=0; i<originalItems.length; i++ ) {
            readRequest.NodesToRead[i].NodeId = originalItems[i].NodeId;
            readRequest.NodesToRead[i].AttributeId = Attribute.Value;
        }

        var status = Test.Session.Session.read( readRequest, readResponse );
        if( status.isBad() ) addError("initial read returned error", status);
        else if( readResponse.ResponseHeader.ServiceResult.isBad() ) addError("initial read service failed", readResponse.ResponseHeader.ServiceResult);
        else for( i = 0; i < readResponse.Results.length; i++ ) writeValues[i].Value.Value = readResponse.Results[i].Value;

        writeRequest.NodesToWrite = writeValues;

        // do the following for 1 hrs
        var startTime = UaDateTime.utcNow();
        print( startTime );
        var endTime = startTime.clone();
        endTime.addSeconds( 60 * RUN_TIME_IN_MINUTES );
        var i=0;
        var errCountRead = 0;
        var errCountWrite = 0;
        while( UaDateTime.utcNow() < endTime ) {
            if( i++ === 500 ) {
                print( "500th loop iteration at: " + UaDateTime.utcNow() + "\t\tTest ending in: " + DurationToString( UaDateTime.utcNow().msecsTo( endTime ) ) );
                i=0;
            }

            // Read all 
            Test.Session.Session.buildRequestHeader( readRequest.RequestHeader );
            status = Test.Session.Session.read( readRequest, readResponse );
            if( status.isBad() ) {
                addError("read failed in loop " + i + " at: " + UaDateTime.utcNow(), status);
                if( errCountRead++ > 100 ) break;
            }
            else if( readResponse.ResponseHeader.ServiceResult.isBad() ) {
                addError("read service failed in loop " + i, readResponse.ResponseHeader.ServiceResult);
                if( errCountRead++ > 100 ) break;
            }

            if( checkItemResults ) for( j=0; j<readResponse.Results.length; j++ ) if(readResponse.Results[j].StatusCode.isBad()) addError("read error in loop " + i + " item " + j);

            // Write all
            Test.Session.Session.buildRequestHeader( writeRequest.RequestHeader );
            status = Test.Session.Session.write( writeRequest, writeResponse );

            if( status.isBad() ) {
                addError( "write failed in loop " + i + " at: " + UaDateTime.utcNow(), status );
                if( errCountWrite++ > 100 ) break;
            }
            else if( writeResponse.ResponseHeader.ServiceResult.isBad() ) {
                addError( "write service failed in loop " + i, writeResponse.ResponseHeader.ServiceResult );
                if( errCountWrite++ > 100 ) break;
            }

            if( checkItemResults ) for( j=0; j<writeResponse.Results.length; j++ ) if( writeResponse.Results[j].isBad() ) addError("write error in loop " + i + " item " + j);
        }
        disconnectOverride()
    }
}
else addError( "No items to use!" );