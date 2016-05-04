/*  Test preapared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: RegisterServer() default values; multiple server names while varying locale */

function registerServer013() {
    var pseudoServer = getDefaultPseudoServer();

    pseudoServer.ServerNames[1] = new UaLocalizedText();
    pseudoServer.ServerNames[1].Text = "Le UACTT";
    pseudoServer.ServerNames[1].Locale = "fr";

    pseudoServer.ServerNames[2] = new UaLocalizedText();
    pseudoServer.ServerNames[2].Text = "Ze UACTT";
    pseudoServer.ServerNames[2].Locale = "de";

    pseudoServer.ServerNames[3] = new UaLocalizedText();
    pseudoServer.ServerNames[3].Text = "el UACTT";
    pseudoServer.ServerNames[3].Locale = "es";

    RegisterServerHelper.Execute( { Server:pseudoServer } );
    return( true );
}

Test.Execute( { Procedure: registerServer013 } );