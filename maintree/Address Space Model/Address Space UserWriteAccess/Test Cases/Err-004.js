/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Write to a node whose UserAccessLevel does not contain write capabilities. */

function write582err017()
{
    const ROSETTING = "/Server Test/NodeIds/SecurityAccess/AccessLevel_CurrentWrite_NotUser";

    // read the node setting, then read the node; determine if this test can proceed
    var item = MonitoredItem.fromSetting( ROSETTING );
    if( !isDefined( item ) )
    {
        addSkipped( "No writalbe node defined that is NOT writable to the current user. Please check setting '" + ROSETTING + "'." );
        return( false );
    }

    // read the node (actually read the 'accesslevel' and 'value' attributes (saves a 2nd read later)
    item.AttributeId = Attribute.UserAccessLevel;
    if( !ReadHelper.Execute( { NodesToRead: item } ) )
    {
        addError( "Aborting test, initial reading of the 'UserAccessLevel' attribute failed." );
        return( false );
    }

    // is this node configured correctly, can we use it?
    if( !ReadHelper.Response.Results[0].Value === AccessLevel.CurrentRead )
    {
        addError( "The AccessLevel shows as '" + ReadHelper.Response.Results[0].Value.toString() + "'. We need something that cannot be written to. Check setting '" + ROSETTING + "'." );
        return( false );
    }

    // if we reach this far then we have a node that we can test.
    // setup our expected errors
    var expectedResult = new ExpectedAndAcceptedResults( StatusCode.BadNotWritable );

    // just write back the same value we received.
    WriteHelper.Execute( { NodesToWrite: item, OperationResults: [ expectedResult ] } );

    // clean-up
    item = null;
    return( true );
}

Test.Execute( { Procedure: write582err017 } );