/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Write to a localizedText passing in all params, no params, and some params. */

function newLT( locale, value ) {
    var lt = new UaLocalizedText();
    lt.Locale = locale;
    lt.Text = value;
    return( lt );
}

function clearAllTexts( item ) {
    // write "" - "": this will clear all texts
    var itemClone = MonitoredItem.Clone( item );
    itemClone.Value.Value.setLocalizedText( newLT( "", "" ) );
    WriteHelper.Execute( { NodesToWrite: itemClone, ReadVerification: true } ); // verify that all texts have been cleared
}

function write582024() {
    const SETTING = "/Server Test/NodeIds/Static/All Profiles/Scalar/LocalizedText";
    var item = MonitoredItem.fromSettings( SETTING )[0];
    if( !isDefined( item ) ) { 
        addSkipped( "LocalizedText not configured in setting: " + SETTING + "." );  
        return( false ); 
    }

    // capture the original value so that we can revert to it after the test
    ReadHelper.Execute( { NodesToRead: item } );
    item.OriginalValue = item.Value.Value.clone();
    var originalLocalizedText = item.OriginalValue.toLocalizedText();

    // clear all existing texts
    var itemClone = MonitoredItem.Clone( item );
    clearAllTexts( itemClone );

    // write  <original locale> - "hello world"
    itemClone.Value.Value.setLocalizedText( newLT( originalLocalizedText.Locale, "hello world" ) );
    WriteHelper.Execute( { NodesToWrite: itemClone, ReadVerification: true } ); // verify that the value has been written to the variable

    // write <original locale> - "": this will erase the text for the original locale
    var emptyText = newLT( "", "" );
    itemClone.Value.Value.setLocalizedText( emptyText );
    WriteHelper.Execute( { NodesToWrite: itemClone, ReadVerification: false } );
    // Verify that all texts have now been removed
    if( ReadHelper.Execute( { NodesToRead: itemClone } ) ) Assert.Equal( itemClone.Value.Value.toLocalizedText(), emptyText )
    else addError( "Read() failed: Unable to verify that all texts have been removed" );

    // write "" - "hello world": this will set a text for the invariant locale
    itemClone.Value.Value.setLocalizedText( newLT( originalLocalizedText.Locale, "hello world" ) );
    WriteHelper.Execute( { NodesToWrite: itemClone, ReadVerification: true } ); // verify that the value has been written to the variable

    // clear all existing texts in order to ensure that the value is correctly reverted
    clearAllTexts( itemClone );

    // now revert the values
    item.Value.Value = item.OriginalValue;
    return( WriteHelper.Execute( { NodesToWrite: item, ReadVerification: false } ) );
}

Test.Execute( { Procedure: write582024 } );