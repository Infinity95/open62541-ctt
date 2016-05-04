/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Read any attribute except Value, from a valid node. SourceTimestamp is null. ServerTimestamp is a valid timestamp, if provided */

function read581030() {
    // get an item
    var item = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings )[0];
    if( item == undefined || item == null ) {
        addSkipped( SETTING_UNDEFINED_SCALARSTATIC );
        return( false );
    }
    
    // get a list of attributes applicable to a Variable 
    var attribs = new NodeTypeAttributesMatrix().Variable;

    var items = [];

    // create a read entry for each attribute type
    for( var i=0; i<attribs.length; i++ ) {
        // we do NOT want the "value" attribute
        if( attribs[i] !== Attribute.Value ) {
            var clonedItem = MonitoredItem.Clone( item );
            clonedItem.AttributeId = attribs[i];
            items.push( clonedItem );
        }
    }

    return( ReadHelper.Execute( { NodesToRead: items, TimestampsToReturn: TimestampsToReturn.Both } ) );
}

Test.Execute( { Procedure: read581030 } );