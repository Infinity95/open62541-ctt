/*  Test prepared by Nathan Pocock: nathan.pocock@opcfoundation.org
    Description: Reads the BROWSENAME attribute of multiple valid nodes. Checks the length of the results > 0. */

function read581011() {
    // make sure all items are going to read the BrowseName:
    for( var i=0; i<originalScalarItems.length; i++ ) originalScalarItems[i].AttributeId = Attribute.BrowseName;
    // conduct the test...
    if( ReadHelper.Execute( { NodesToRead: originalScalarItems, MaxAge: 10000 } ) ) {
        for( var i=0; i<ReadHelper.Response.Results.length; i++ ) {             // iterate thru item results checking for good data
            if( false == ReadHelper.Response.Results[i].StatusCode.isGood() ) { // see *this* item is not in good quality
                addError( "Item (" + i + ") (setting: '" + items[i].NodeSetting + "') is not good quality, but is actually: " + ReadHelper.Response.Results[i].StatusCode.toString() );
            }
            else {
                // checking the length > 0 because checking for null would cause script compiler to exit (no error thrown).
                if( ReadHelper.Response.Results[i].Value.toString().length == 0 ) addError( "BrowseName is empty/null" );
                else addLog( "  (" + i + ") BrowseName = " + ReadHelper.Response.Results[i].Value.toString() + " (setting: '" + originalScalarItems[i].NodeSetting + "') " );
            }//else...if...
        }//for i...
    }
    // revert all items to use Value attribute:
    for( var i=0; i<originalScalarItems.length; i++ ) originalScalarItems[i].AttributeId = Attribute.Value;
    return( true );
}

Test.Execute( { Procedure: read581011 } );