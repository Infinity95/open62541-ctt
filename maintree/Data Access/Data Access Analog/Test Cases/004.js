/*  Test prepared by Anand Taparia; ataparia@kepware.com
    Description: Read the EURange property of multiple analog nodes. */

function read613004() {
    if( AnalogItems == null || AnalogItems.length < 2 ) {
        addSkipped( "Static Analog" );
        return( false );
    }
    // Read the EURange property of the analog nodes
    var analogNodeEURange;
    for( var i=0; i<AnalogItems.length; i++ ) {
        analogNodeEURange = GetNodeIdEURange( AnalogItems[i].NodeSetting );
        if ( analogNodeEURange != null ) addLog( "EURange property of analog node '" + AnalogItems[i].NodeSetting + "' is: " + analogNodeEURange );
        else addError( "Unable to read the EURange property of the analog node '" + AnalogItems[i].NodeSetting + "'." );
    }
    return( true );
}// function read613004()

Test.Execute( { Procedure: read613004 } );