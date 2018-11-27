// This tells Ibex you will send the results early
var manualSendResults = true;
var showProgressBar = true;
var shuffleSequence = seq("setcounter","consent","instructions","prepractice",startsWith("Practice"),"balance","scaleinstr","distract",randomize("experiment-first"),randomize("experiment"),"feedback","send","prolificConf");
PennController.ResetPrefix(null);


var items = [

    ["setcounter", "__SetCounter__", { } ]
    ,    
    ["consent", "PennController", PennController(
        newHtml("consent", "ProlificConsent.html")
            .settings.log()
            .print()
        ,
        newButton("consent btn", "Ich willige ein, dieses Experiment zu machen.")
            .print()
            .wait( getHtml("consent").test.complete().failure( getHtml("consent").warn() ) )
    )]
    ,
    ["instructions", "PennController", PennController(
//        newHtml("instructions form", "TaskInstructionsUnmarked.html") 
        newHtml("instructions form", "TaskInstructionsV2.html") 
//        newHtml("instructions form", "TaskInstructionsSpAct.html") 

            .print()
        ,
        newButton("continue btn", "Klicken Sie f&uuml;r weitere Anweisungen.")
            .print()
            .wait()
    )]
    ,
    ["prepractice", "PennController", PennController(
        newHtml("prepractice form", "NaturalnessInstructions.html")
            .print()
        ,
        newButton("continue to expt", "Weiter.")
            .print()
            .wait( getHtml("prepractice form").test.complete().failure(getHtml("prepractice form").warn()) )
    )]
    ,
    ["balance", "PennController", PennController(
        newHtml("balance form", "Balance.html")
            .print()
        ,
        newButton("continue btn", "Weiter.")
            .print()
            .wait( getHtml("balance form").test.complete().failure(getHtml("balance form").warn()) )
    )]
    ,  
     ["scaleinstr", "PennController", PennController(
        newHtml("scale form", "Scale.html")
            .print()
        ,
        newButton("continue btn", "Weiter.")  
            .print()
            .wait( getHtml("scale form").test.complete().failure(getHtml("scale form").warn()) )
    )]
    ,     
    ["distract", "PennController", PennController(
        newHtml("distract form", "DistractionsOff.html")
            .print()
        ,
        newButton("continue btn", "Weiter.")
            .print()
            .wait( getHtml("distract form").test.complete().failure(getHtml("distract form").warn()) )
    )] 
    ,      
    ["feedback", "PennController", PennController(
        newHtml("feedback form", "ProlificFeedback.html")
            .settings.log()
            .print()
        ,
        newButton("continue to confirm", "Klicken Sie hier, um fortzufahren.")
            .settings.bold()
            .print()
            .wait( getHtml("feedback form").test.complete().failure(getHtml("feedback form").warn()) )              
    )]
    ,      
    ["send", "__SendResults__", {}]   
    ,
    ["prolificConf", "PennController", PennController(
        newHtml("thanks", "ProlificConfirmation.html")
            .settings.log()
            .print() 
        ,
        newButton("continue btn", "Jag &auml;r klar.")
            .settings.bold()
     //       .print()
            .wait()                 
    )]                     
];
PennController.GetTable( "GER-datasource-MCP.csv" ).setLabel("Expt");

PennController.FeedItems( PennController.GetTable( "GER-datasource-MCP.csv" ).filter("ExptType","Practice"),
    (item) => PennController(
        newFunction("isGood", function(){ return item.Expt=="Practice-good"; })
        ,
        newFunction("isIntermed", function(){ return item.Expt=="Practice-intermed"; })
        ,
         newCanvas("stimbox", 850, 190)
            .settings.add(25,40,
                newText("context", item.Background)
                    .settings.size(700, 30)
            )
            .settings.add(25, 85,
                newText("context", item.Says)
                    .settings.size(700, 30)
            )               
             .settings.add(25,130,
             //   newText("stimuli", item.InSitu_Stims)
                newText("stimuli", item.V2_Stims)
             //   newText("stimuli", item.SpActAdv_Stims)
                    .settings.italic()
                    .settings.size(700, 30)
            )
            .print()
        ,
        newTimer("transit", 2000)
            .start()
            .wait()
        ,
        newText("instructionsText", "")
            .settings.center()
            .settings.bold()
        ,
        getFunction("isGood")
            .test.is(true)
            .success( getText("instructionsText").settings.text("Es ist wahrscheinlich ziemlich leicht vorstellbar, wann Du diesen Satz verwenden w&uuml;rdest. Leute geben ihm normalerweise eine hohe Punktzahl:") )
            .failure(
                getFunction("isIntermed")
                    .test.is(true)
                    .success( getText("instructionsText").settings.text("Es ist m&ouml;glicherweise nicht so klar, wann oder ob Du diesen Satz verwenden w&uuml;rdest. Leute geben ihm normalerweise eine mittlere Punktzahl:") )
                    .failure( getText("instructionsText").settings.text("Unabh&auml;ngig von der Situation w&uuml;rdest Du diesen Satz wahrscheinlich nicht verwenden. Leute geben ihm normalerweise eine niedrige Punktzahl:") )
            )
        ,            
        getText("instructionsText")
            .print()
        ,
         newTimer("transfer", 2000)
            .start()
            .wait()         
        ,                   
        newScale("answer", 9)
            .settings.disable()
        ,            
        getFunction("isGood")
            .test.is(true)
            .success( getScale("answer").settings.default(8) )
            .failure(
                getFunction("isIntermed")
                    .test.is(true)
                    .success( getScale("answer").settings.default(4) )
                    .failure( getScale("answer").settings.default(0) )
            )
        ,    
        newCanvas("ansbox", 850, 150)
            .settings.add(25,25, newText("background", "F&uuml;r mich h&ouml;rt sich dieser Satz:").settings.size(700, 30) )   
            .settings.add( 25,75, newText("labelLeft", "vollkommen unnat&uuml;rlich").settings.bold() )
            .settings.add(195,70, getScale("answer").settings.size(200, 0) )
            .settings.add(425,75, newText("labeRight", "vollkommen nat&uuml;rlich an.").settings.bold() )
            .print()
        ,        
        newButton("validate", "Weiter.")
            .settings.center()    
            .print()    
            .wait()
    )
);

PennController.FeedItems( PennController.GetTable( "GER-datasource-MCP.csv" ).filter("Expt","experiment-first"),
    (item) => PennController(
        newTimer("blank", 1000)
            .start()
            .wait()
        ,    
        newTooltip("instructions", "Klicken Sie die Leertaste, um fortzufahren.")
            .settings.size(180, 25)
            .settings.position("bottom center")
            .settings.key(" ", "no click")
        ,
        newCanvas("stimbox", 850, 190)
            .settings.add(25,40,
                newText("context", item.Background)
                    .settings.size(700, 30)
            )
            .settings.add(25, 85,
                newText("context", item.Says)
                    .settings.size(700, 30)
            )               
             .settings.add(25,130,
             //   newText("stimuli", item.InSitu_Stims)
                newText("stimuli", item.V2_Stims)
             //   newText("stimuli", item.SpActAdv_Stims)
                    .settings.italic()
                    .settings.size(700, 30)
            )
            .print()
        ,
        newTimer("transit", 1000)
            .start()
            .wait()
        ,   
        newScale("answer", 9)
            .settings.log()
        ,
        newCanvas("ansbox", 850, 150)
            .settings.add(25,25, newText("background", "F&uuml;r mich h&ouml;rt sich dieser Satz:").settings.size(700, 30) )   
            .settings.add( 25,75, newText("labelLeft", "vollkommen unnat&uuml;rlich").settings.bold() )
            .settings.add(195,70, getScale("answer").settings.size(200, 0) )
            .settings.add(425,75, newText("labeRight", "vollkommen nat&uuml;rlich an.").settings.bold() )
            .print()
        ,
        newText("warning","Bitte w&auml;hlen Sie eine Antwort aus.")
            .settings.hidden()
            .settings.color("red")
            .settings.bold()
            .settings.css("margin-left", 50 )
            .print()
        ,
        newButton("validate", "Weiter.")
            .settings.center() 
            .print()    
            .wait(getScale("answer")
                  .test.selected()
                  .failure(getText("warning")
                           .settings.visible()
                          )
                 )        

    ).log("Expt", item.Expt)
    .log("ExptType", item.ExptType)
    .log("ItemName", item.ItemName)
    .log("Tense", item.Tense)
    .log("polarity", item.polarity)
    .log("EmbPred", item.EmbPred)
    .log("lemma", item.lemma)
    .log("SpActAdverb", item.SpActAdverb)    
    .log("Group", item.Group)
    .log("Item", item.Item)
    .log("NoExpt", item.NoExpt)
    .log("EmbCondition", item.EmbCondition)
    .log("mcpred", item.mcpred)
   // .log("InSitu_Stims", item.InSitu_Stims)     
   // .log("V2_Stims", item.V2_Stims)  
   // .log("SpActAdv_Stims", item.SpActAdv_Stims)           
    .log("PROLIFIC_PID", PennController.GetURLParameter("PROLIFIC_PID"))
);

PennController.FeedItems( PennController.GetTable( "GER-datasource-MCP.csv" ).filter("Expt","experiment"),
    (item) => PennController(
        newTimer("blank", 1000)
            .start()
            .wait()
        ,    
        newTooltip("instructions", "Klicken Sie die Leertaste, um fortzufahren.")
            .settings.size(180, 25)
            .settings.position("bottom center")
            .settings.key(" ", "no click")
        ,
        newCanvas("stimbox", 850, 190)
            .settings.add(25,40,
                newText("context", item.Background)
                    .settings.size(700, 30)
            )
            .settings.add(25, 85,
                newText("context", item.Says)
                    .settings.size(700, 30)
            )               
             .settings.add(25,130,
             //   newText("stimuli", item.InSitu_Stims)
                newText("stimuli", item.V2_Stims)
             //   newText("stimuli", item.SpActAdv_Stims)
                    .settings.italic()
                    .settings.size(700, 30)
            )
            .print()
        ,
        newTimer("transit", 1000)
            .start()
            .wait()
        ,   
        newScale("answer", 9)
            .settings.log()
        ,
        newCanvas("ansbox", 850, 150)
            .settings.add(25,25, newText("background", "F&uuml;r mich h&ouml;rt sich dieser Satz:").settings.size(700, 30) )   
            .settings.add( 25,75, newText("labelLeft", "vollkommen unnat&uuml;rlich").settings.bold() )
            .settings.add(195,70, getScale("answer").settings.size(200, 0) )
            .settings.add(425,75, newText("labeRight", "vollkommen nat&uuml;rlich an.").settings.bold() )
            .print()
        ,
        newText("warning","Bitte w&auml;hlen Sie eine Antwort aus.")
            .settings.hidden()
            .settings.color("red")
            .settings.bold()
            .settings.css("margin-left", 50 )
            .print()
        ,
        newButton("validate", "Weiter.")
            .settings.center() 
            .print()    
            .wait(getScale("answer")
                  .test.selected()
                  .failure(getText("warning")
                           .settings.visible()
                          )
                 )        

    ).log("Expt", item.Expt)
    .log("ExptType", item.ExptType)
    .log("ItemName", item.ItemName)
    .log("Tense", item.Tense)
    .log("polarity", item.polarity)
    .log("EmbPred", item.EmbPred)
    .log("lemma", item.lemma)
    .log("SpActAdverb", item.SpActAdverb)    
    .log("Group", item.Group)
    .log("Item", item.Item)
    .log("NoExpt", item.NoExpt)
    .log("EmbCondition", item.EmbCondition)
    .log("mcpred", item.mcpred)
   // .log("InSitu_Stims", item.InSitu_Stims)     
   // .log("V2_Stims", item.V2_Stims)  
   // .log("SpActAdv_Stims", item.SpActAdv_Stims)           
    .log("PROLIFIC_PID", PennController.GetURLParameter("PROLIFIC_PID"))  
);





