/*  Test 6.6 Test 1; prepared by Nathan Pocock nathan.pocock@opcfoundation.org

    Description:
        Read a node and read the values of both the TrueState and FalseState attributes.
        Do this twice, once where the value is TRUE and then where the value is FALSE.
    Expectations:
        Service and operation level results are Good for the Value (attribute) and the
        two Variables (TrueState and FalseState).

    Revision History:
        16-Feb-2010 NP: Initial version.
        23-May-2012 NP: Reviewed.
*/

function read66001()
{
    if( twoStateItems == null || twoStateItems.length == 0 )
    {
        addSkipped( TSDT );
        return( false );
    }

    // read the node and display the Value
    if( ReadHelper.Execute( { NodesToRead: twoStateItems[0] } ) )
    {
        Assert.Equal( BuiltInType.toString( BuiltInType.Boolean ), BuiltInType.toString( twoStateItems[0].Value.Value.DataType ), "Data Type of .Value attribute should be Boolean!" );
        print( "\tRead complete of Node: " + twoStateItems[0].NodeSetting + "\n\t\tItem value: " + twoStateItems[0].Value.Value.toBoolean() );
        
        // we have the main node itself, now to get the TrueState and FalseState into a Node 
        var trueFalseState = null;
        trueFalseState = GetTrueStateFalseState( twoStateItems[0].NodeSetting, Test.Session.Session, ReadHelper );
        if( trueFalseState !== null )
        {
            Assert.StringNotNullOrEmpty( trueFalseState.TrueState.Value, "A TrueState is Required" );
            Assert.StringNotNullOrEmpty( trueFalseState.TrueStateLocalized.Text, "A TrueState Text is required." );
            Assert.StringNotNullOrEmpty( trueFalseState.FalseState.Value, "A FalseState is Required" );
            Assert.StringNotNullOrEmpty( trueFalseState.FalseStateLocalized.Text, "A FalseState Text is Required" );
        }
    }
}

safelyInvoke( read66001 );