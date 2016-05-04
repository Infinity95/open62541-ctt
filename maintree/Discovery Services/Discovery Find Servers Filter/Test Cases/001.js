/*  Test prepared by compliance@opcfoundation.org; original work by: Ronaldo T. Duarte ronaldotd@smar.com.br
    Description: Filter the list of servers by server URI. */

function findServers551002() {
    if( FindServersHelper.Execute() ) { 
        var initialCount = FindServersHelper.Response.Servers.length;
        addLog( "FindServers() returned " + initialCount + " description(s)." );      
        if( FindServersHelper.Execute( { ServerUris: FindServersHelper.Response.Servers[0].ApplicationUri } ) ) {
            addLog( "FindServers() returned " + FindServersHelper.Response.Servers.length + " description(s)." );      
            // is the count the same?
            var filteredCount = FindServersHelper.Response.Servers.length;
            if( filteredCount == initialCount && initialCount > 1 ) addWarning( "The unfiltered results count is the same as the filtered results count. original count: " + initialCount + "; filtered count: " + filteredCount );
            // check that returned descriptions were correctly filtered.
            for( var i=0; i<FindServersHelper.Response.Servers.length; i++ ) {
                var description = FindServersHelper.Response.Servers[i];  
                if( description.ApplicationUri !== serverUri ) addError( "FindServers: filter:  " + serverUri + ", but server returned: " + description.ApplicationUri );
            }// for i...
        }
    }// if findServers is Bad
    return( true );
}

Test.Execute( { Procedure: findServers551002 } );