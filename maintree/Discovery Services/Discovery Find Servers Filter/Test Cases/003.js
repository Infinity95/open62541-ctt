/*  Test prepared by compliance@opcfoundation.org; original work by: Ronaldo T. Duarte ronaldotd@smar.com.br
    Description: List with supported and unsupported locales. */

function findServers551004() {
    var unsupportedLocale = GetUnsupportedLocale( supportedLocales );
    var localesToSearch = [];
    localesToSearch.push( unsupportedLocale );
    for( var i=0; i<supportedLocales.length; i++ ) localesToSearch.push( supportedLocales[i] );
    if( FindServersHelper.Execute( { LocaleIds: localesToSearch } ) ) {
        // check that server returns at least its own description with a default locale.
        addLog( "Expected locale for localized application names: \"" + supportedLocales[0] + "\"." );
        for( var jj=0; jj<FindServersHelper.Response.Servers.length; jj++ ) {
            var description = FindServersHelper.Response.Servers[jj];
            addLog( "Application name #" + jj + ": locale: \"" + description.ApplicationName.Locale + "\" text: \"" + description.ApplicationName.Text + "\"" );
            if ( description.ApplicationName.Locale.length > 0 && description.ApplicationName.Locale != supportedLocales[0] ) {
                addWarning( "Returned locale is not the expected one when reading the Application Name (NodeId: " + localeReadRequest.NodesToRead[0].NodeId + "). Expected: '" + expectedLocale + "'; Received: '" + description.ApplicationName.Locale + "'." );
            }
        }// for jj
    }//find servers
    return( true );
}

Test.Execute( { Procedure: findServers551004 } );