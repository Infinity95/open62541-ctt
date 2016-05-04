/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Write to a node whose AccessLevel does not contain write capabilities. */

function write582err015() {
    var item = MonitoredItem.fromSetting( "/Server Test/NodeIds/SecurityAccess/AccessLevel_CurrentRead_NotCurrentWrite" );
    if( !isDefined( item ) ) { addSkipped( "No ReadOnly NodeId defined. Please check setting '/Server Test/NodeIds/SecurityAccess/AccessLevel_CurrentRead_NotCurrentWrite'." ); return( false ); }

    // read the node (actually read the 'accesslevel' and 'value' attributes (saves a 2nd read later)
    var expectedResult = new ExpectedAndAcceptedResults( StatusCode.Good );
    item.AttributeId = Attribute.AccessLevel;
    if( !ReadHelper.Execute( { NodesToRead: item, TimestampsToReturn: TimestampsToReturn.Server, OperationResults: [ expectedResult ], } ) ) {
        addError( "Aborting test, initial reading of the 'WriteMask' attribute failed." );
        return( false );
    }

    // is this node configured correctly, can we use it?
    if( ( ReadHelper.Response.Results[0].Value & AccessLevel.CurrentWrite ) === AccessLevel.CurrentWrite ) {
        item.AttributeId = Attribute.UserAccessLevel;
        if( ReadHelper.Execute( { NodesToRead: item } ) ) {
            if( ( ReadHelper.Response.Results[0].Value & AccessLevel.CurrentWrite ) === AccessLevel.CurrentWrite ) {
                addError( "The UserAccessLevel shows as '" + ReadHelper.Response.Results[0].Value.toString() + "'. We need something that can be read, but cannot be written to. Check setting '" + ROSETTING + "'." );
                return( false );
            }
        }
        else {
            addError( "The AccessLevel shows as '" + ReadHelper.Response.Results[0].Value.toString() + "'. We need something that can be read, but cannot be written to. Check setting '" + ROSETTING + "'." );
            return( false );
        }
    }
    print( "AccessLevel = " + ReadHelper.Response.Results[0].Value + " (vs. CurrentWrite=" + AccessLevel.CurrentWrite + ")" );

    // if we reach this far then we have a node that we can test.
    // setup our expected errors
    expectedResult = new ExpectedAndAcceptedResults( [ StatusCode.BadNotWritable, StatusCode.BadUserAccessDenied ] );

    // just write back the same value we received.
    WriteHelper.Execute( { NodesToWrite: item, OperationResults: expectedResult, ReadVerification: false } );

    // clean-up
    item = null;
    return( true );
}

Test.Execute( { Procedure: write582err015 } );