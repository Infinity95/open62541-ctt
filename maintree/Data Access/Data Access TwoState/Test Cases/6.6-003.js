/*  Test 6.6 Test 3; prepared by Nathan Pocock nathan.pocock@opcfoundation.org

    Description:
        Write to multiple nodes of this type, all values are False.
    Expectations:
        Service and operation level results are Good and the Read values match
        those written.

    Revision History:
        16-Feb-2010 NP: Initial version.
        23-May-2012 NP: Reviewed.
*/

function write66003()
{
    if( twoStateItems == null || twoStateItems.length == 0 )
    {
        addSkipped( TSDT );
        return( false );
    }

    var originalValues = [];
    // read the values of all the nodes first
    if( Assert.True( ReadHelper.Execute( { NodesToRead: twoStateItems } ), "Read must succeed in order for the writes to be reset, after this test is complete." ) )
    {
        for( var i=0; i<twoStateItems.length; i++ )
        {
            if( Assert.True( twoStateItems[i].Value.StatusCode.isGood(), "Bad quality data, aborting test." ) )
            {
                Assert.Equal( BuiltInType.toString( BuiltInType.Boolean ), BuiltInType.toString( twoStateItems[i].Value.Value.DataType ), "Incorrect data-type. Must be a Boolean!" );
                originalValues.push( twoStateItems[i].Value.Value.toBoolean() );
                print( "\tStored value: " + twoStateItems[i].Value.Value.toBoolean() + " into originalValues[" + ( originalValues.length - 1 ) + "]" );
            }
        }// for i...
    }
    if( Assert.Equal( twoStateItems.length, originalValues.length, "Incorrect value count. Aborting test." ) )
    {
        // flip each bit, and then write them all back!
        for( var w=0; w<twoStateItems.length; w++ )
        {
            twoStateItems[w].Value.Value.setBoolean( false );
            print( "\tResetting value of originalItem[" + w + "] = " + twoStateItems[w].Value.Value.toBoolean() );
        }// for w...
        // write the new values
        if( Assert.True( WriteHelper.Execute( { NodesToWrite: twoStateItems } ), "Expected the Write to succeed" ) )
        {
            // reset the bits to their original values...
            for( var r=0; r<twoStateItems.length; r++ )
            {
                twoStateItems[r].Value.Value.setBoolean( originalValues[r] );
                print( "\tReverted value of originalItem[" + r + "] = " + twoStateItems[r].Value.Value.toBoolean() );
            }// for r...
            WriteHelper.Execute( { NodesToWrite: twoStateItems, ReadVerification: false } );
        }
    }
}

safelyInvoke( write66003 );