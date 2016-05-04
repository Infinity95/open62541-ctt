/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Write to a node whose AccessLevel does not contain write capabilities. */

function write582err016() {
    const ROSETTING = "/Server Test/NodeIds/SecurityAccess/AccessLevel_CurrentRead_NotCurrentWrite";
    if( !AssertSettingGood( ROSETTING, undefined, true ) ) return( false );

    // read the node setting, then read the node; determine if this test can proceed
    var item = MonitoredItem.fromSetting( ROSETTING );

    // read the node (actually read the 'accesslevel'
    item.AttributeId = Attribute.AccessLevel;
    if( !ReadHelper.Execute( { NodesToRead: item } ) ) {
        addError( "Aborting test, initial reading of the 'AccessLevel' attribute failed." );
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

    // if we reach this far then we have a node that we can test.
    // setup our expected errors
    var expectedResult = new ExpectedAndAcceptedResults( [ StatusCode.BadNotWritable, StatusCode.BadUserAccessDenied ] );

    // We need to read the VALUE attribute first, and then we can write it back
    item.AttributeId = Attribute.Value;
    if( ReadHelper.Execute( { NodesToRead: item } ) ) WriteHelper.Execute( { NodesToWrite: item, OperationResults: [ expectedResult ] } );
    return( true );
}

Test.Execute( { Procedure: write582err016 } );